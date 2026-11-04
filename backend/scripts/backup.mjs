#!/usr/bin/env node
// Backup MySQL + uploads -> gzip -> AES-256-GCM -> Supabase Storage (private).
// Env: DATABASE_URL, BACKUP_ENCRYPTION_KEY, BACKUP_DIR, BACKUP_RETENTION_DAYS,
//      UPLOAD_ROOT, MYSQLDUMP_PATH, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//      SUPABASE_BACKUP_BUCKET.
import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pipeline } from 'node:stream/promises';
import { createGzip } from 'node:zlib';
import mysql from 'mysql2/promise';

const args = new Set(process.argv.slice(2));
const NO_UPLOAD = args.has('--no-upload');
const root = path.resolve(process.env.BACKUP_DIR || 'backups');
const uploadRoot = path.resolve(process.env.UPLOAD_ROOT || 'uploads');
const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta' }).format(new Date());
const retention = Number(process.env.BACKUP_RETENTION_DAYS || 30);
const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY || '', 'base64');
if (key.length !== 32) throw new Error('BACKUP_ENCRYPTION_KEY harus base64 dari 32 byte (AES-256).');
const keyFingerprint = crypto.createHash('sha256').update(key).digest('hex').slice(0, 16);

const dbUrl = new URL(process.env.DATABASE_URL);
const database = dbUrl.pathname.slice(1);
const mysqlDump = process.env.MYSQLDUMP_PATH || (process.platform === 'win32' ? 'mysqldump.exe' : 'mysqldump');
const work = path.join(root, '.work', date);
await fs.mkdir(work, { recursive: true });

async function sha256(file) {
  const hash = crypto.createHash('sha256');
  for await (const chunk of createReadStream(file)) hash.update(chunk);
  return hash.digest('hex');
}

async function encryptFile(input, output) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const out = createWriteStream(output);
  await new Promise((resolve, reject) => { out.once('open', resolve); out.once('error', reject); });
  out.write(Buffer.from('SMKBACK1'));
  out.write(iv);
  await pipeline(createReadStream(input), cipher, out);
  await fs.appendFile(output, cipher.getAuthTag());
}

async function dumpDatabase(output) {
  const child = spawn(mysqlDump, [
    '--single-transaction', '--quick', '--routines', '--triggers', '--events',
    '--no-tablespaces', '--hex-blob', '--default-character-set=utf8mb4',
    `--host=${dbUrl.hostname}`, `--port=${dbUrl.port || 3306}`,
    `--user=${decodeURIComponent(dbUrl.username)}`, database,
  ], { env: { ...process.env, MYSQL_PWD: decodeURIComponent(dbUrl.password) }, stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
  const exited = new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve() : reject(new Error(`mysqldump gagal (${code}): ${stderr.slice(0, 800)}`)));
  });
  await pipeline(child.stdout, createGzip(), createWriteStream(output));
  await exited;
}

async function archiveUploads(output) {
  try { await fs.access(uploadRoot); } catch { return false; }
  const child = spawn('tar', ['-czf', output, '-C', uploadRoot, '.'], { stdio: ['ignore', 'ignore', 'pipe'] });
  let stderr = '';
  child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
  await new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve() : reject(new Error(`tar gagal (${code}): ${stderr.slice(0, 500)}`)));
  });
  return true;
}

async function tableCounts() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  const [tables] = await conn.query('SHOW TABLES');
  const counts = {};
  for (const row of tables) {
    const name = Object.values(row)[0];
    if (name === '_prisma_migrations') continue;
    const [[{ n }]] = await conn.query(`SELECT COUNT(*) AS n FROM \`${name}\``);
    counts[name] = Number(n);
  }
  await conn.end();
  return counts;
}

async function uploadObject(remote, local, contentType = 'application/octet-stream') {
  const base = `${process.env.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${process.env.SUPABASE_BACKUP_BUCKET}`;
  const res = await fetch(`${base}/${remote}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      'content-type': contentType,
      'x-upsert': 'true',
    },
    body: await fs.readFile(local),
  });
  if (!res.ok) throw new Error(`Upload ${remote} gagal: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
}

async function verifyRemote(remote, localSha, localSize) {
  const base = `${process.env.SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/authenticated/${process.env.SUPABASE_BACKUP_BUCKET}`;
  const res = await fetch(`${base}/${remote}`, { headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, apikey: process.env.SUPABASE_SERVICE_ROLE_KEY } });
  if (!res.ok) throw new Error(`Verifikasi ${remote} gagal: HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (buffer.length !== localSize) throw new Error(`Ukuran objek ${remote} tidak cocok (${buffer.length} != ${localSize}).`);
  const digest = crypto.createHash('sha256').update(buffer).digest('hex');
  if (digest !== localSha) throw new Error(`Checksum objek ${remote} tidak cocok.`);
}

async function cleanupLocal() {
  const cutoff = Date.now() - retention * 86400000;
  async function walk(dir) {
    let entries = [];
    try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if ((await fs.stat(full)).mtimeMs < cutoff) { await fs.unlink(full); console.log(JSON.stringify({ event: 'backup_retention_deleted', file: path.relative(root, full) })); }
    }
  }
  await walk(path.join(root, 'mysql'));
  await walk(path.join(root, 'uploads'));
  await walk(path.join(root, 'manifests'));
}

async function cleanupRemote() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.SUPABASE_BACKUP_BUCKET) return 0;
  const bucket = process.env.SUPABASE_BACKUP_BUCKET;
  const base = `${process.env.SUPABASE_URL.replace(/\/$/, '')}/storage/v1`;
  const cutoff = Date.now() - retention * 86400000;
  const toDelete = [];
  for (const prefix of ['mysql', 'uploads', 'manifests']) {
    const res = await fetch(`${base}/object/list/${bucket}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ prefix, limit: 1000, sortBy: { column: 'name', order: 'asc' } }),
    });
    if (!res.ok) continue;
    for (const item of await res.json()) {
      const name = item.name;
      const match = name.match(/(\d{4}-\d{2}-\d{2})/);
      if (!match) continue;
      if (new Date(`${match[1]}T00:00:00+07:00`).getTime() < cutoff) toDelete.push(`${prefix}/${name}`);
    }
  }
  if (toDelete.length) {
    const res = await fetch(`${base}/object/${bucket}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, 'content-type': 'application/json' },
      body: JSON.stringify({ prefixes: toDelete }),
    });
    if (!res.ok) console.error(JSON.stringify({ level: 'error', event: 'backup_remote_cleanup_failed', status: res.status }));
  }
  return toDelete.length;
}

const manifest = {
  version: 1,
  date,
  startedAt: new Date().toISOString(),
  database,
  schemaVersion: 'prisma',
  encryption: 'AES-256-GCM',
  keyFingerprint,
  retentionDays: retention,
  tableCounts: await tableCounts(),
  objects: {},
  status: 'started',
};

try {
  const dumpPlain = path.join(work, `mysql-${date}.sql.gz`);
  const dumpEnc = path.join(root, 'mysql', date.slice(0, 4), date.slice(5, 7), `mysql-backup-${date}.sql.gz.enc`);
  await fs.mkdir(path.dirname(dumpEnc), { recursive: true });
  await dumpDatabase(dumpPlain);
  await encryptFile(dumpPlain, dumpEnc);
  manifest.objects.database = { key: path.relative(root, dumpEnc).replaceAll('\\', '/'), size: (await fs.stat(dumpEnc)).size, sha256: await sha256(dumpEnc) };
  await fs.unlink(dumpPlain);

  const uploadsPlain = path.join(work, `uploads-${date}.tar.gz`);
  if (await archiveUploads(uploadsPlain)) {
    const uploadsEnc = path.join(root, 'uploads', `uploads-backup-${date}.tar.gz.enc`);
    await fs.mkdir(path.dirname(uploadsEnc), { recursive: true });
    await encryptFile(uploadsPlain, uploadsEnc);
    manifest.objects.uploads = { key: path.relative(root, uploadsEnc).replaceAll('\\', '/'), size: (await fs.stat(uploadsEnc)).size, sha256: await sha256(uploadsEnc) };
    await fs.unlink(uploadsPlain);
  }
  manifest.status = 'created';
} catch (error) {
  manifest.status = 'failed';
  manifest.error = error.message;
  console.error(JSON.stringify({ level: 'error', event: 'backup_failed', message: error.message }));
} finally {
  manifest.finishedAt = new Date().toISOString();
  const manifestPath = path.join(root, 'manifests', `backup-${date}.json`);
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  await fs.rm(work, { recursive: true, force: true });

  if (manifest.status !== 'created') process.exit(1);

  const remoteReady = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_BACKUP_BUCKET;
  if (NO_UPLOAD) {
    console.log(JSON.stringify({ event: 'backup_upload_skipped', reason: '--no-upload' }));
  } else if (!remoteReady) {
    if (process.env.NODE_ENV === 'production') {
      console.error(JSON.stringify({ level: 'error', event: 'backup_upload_failed', reason: 'Supabase backup env belum dikonfigurasi' }));
      process.exit(1);
    }
    console.log(JSON.stringify({ event: 'backup_upload_skipped', reason: 'Supabase backup env belum dikonfigurasi (local test)' }));
  } else {
    try {
      for (const [name, obj] of Object.entries(manifest.objects)) {
        await uploadObject(obj.key, path.join(root, obj.key), 'application/octet-stream');
        await verifyRemote(obj.key, obj.sha256, obj.size);
        console.log(JSON.stringify({ event: 'backup_object_uploaded_verified', object: name, key: obj.key }));
      }
      await uploadObject(`manifests/backup-${date}.json`, manifestPath, 'application/json');
      manifest.status = 'uploaded';
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    } catch (error) {
      console.error(JSON.stringify({ level: 'error', event: 'backup_upload_failed', message: error.message }));
      process.exit(1);
    }
  }

  const remoteDeleted = await cleanupRemote();
  await cleanupLocal();
  console.log(JSON.stringify({ event: 'backup_complete', date, objects: Object.keys(manifest.objects), remoteDeleted, retentionDays: retention }));
}