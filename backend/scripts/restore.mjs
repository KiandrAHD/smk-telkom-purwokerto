#!/usr/bin/env node
// Restore terenkripsi. Default menolak menyentuh database production.
// Usage:
//   node scripts/restore.mjs <file.sql.gz.enc> --db smk_telkom_purwokerto_restore_test --apply
//   node scripts/restore.mjs <file.sql.gz.enc> --target-url mysql://.../db --apply --allow-production
import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';

const argv = process.argv.slice(2);
const fileArg = argv.find((a) => !a.startsWith('--') && !['mysql', 'uploads', 'both'].includes(a));
const flags = Object.fromEntries(argv.filter((a) => a.startsWith('--')).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const targetKind = argv.includes('uploads') ? 'uploads' : argv.includes('both') ? 'both' : 'mysql';

if (!fileArg) { console.error('Gunakan: node scripts/restore.mjs <backup.sql.gz.enc|.tar.gz.enc> [--db=nama | --target-url=...] [--apply] [--uploads-root=...]'); process.exit(2); }
if (!flags.apply) { console.error('Restore destruktif diblokir. Tambahkan --apply setelah target diverifikasi.'); process.exit(2); }

const key = Buffer.from(process.env.BACKUP_ENCRYPTION_KEY || '', 'base64');
if (key.length !== 32) throw new Error('BACKUP_ENCRYPTION_KEY harus base64 dari 32 byte (AES-256).');

const input = path.resolve(fileArg);
const raw = await fs.readFile(input);
if (raw.subarray(0, 8).toString() !== 'SMKBACK1') throw new Error('Format backup tidak dikenal.');
const iv = raw.subarray(8, 20);
const tag = raw.subarray(-16);
const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
decipher.setAuthTag(tag);
const work = path.join(path.resolve(process.env.BACKUP_DIR || 'backups'), '.restore');
await fs.rm(work, { recursive: true, force: true });
await fs.mkdir(work, { recursive: true });
const decryptedGz = path.join(work, path.basename(input).replace(/\.enc$/, ''));
await pipeline(createReadStream(input, { start: 20, end: raw.length - 17 }), decipher, createWriteStream(decryptedGz));

const isUploads = input.includes('uploads-backup');
if (isUploads || targetKind === 'uploads') {
  const dest = path.resolve(flags['uploads-root'] || process.env.UPLOAD_ROOT || 'uploads');
  await fs.mkdir(dest, { recursive: true });
  await new Promise((resolve, reject) => {
    const child = spawn('tar', ['-xzf', decryptedGz, '-C', dest], { stdio: ['ignore', 'ignore', 'pipe'] });
    let error = '';
    child.stderr.on('data', (chunk) => { error += chunk.toString(); });
    child.on('error', reject);
    child.on('close', (code) => code === 0 ? resolve() : reject(new Error(`tar restore gagal (${code}): ${error.slice(0, 500)}`)));
  });
  await fs.rm(work, { recursive: true, force: true });
  console.log(JSON.stringify({ event: 'restore_uploads_complete', destination: dest }));
  process.exit(0);
}

const sql = path.join(work, 'backup.sql');
await pipeline(createReadStream(decryptedGz), createGunzip(), createWriteStream(sql));
const head = (await fs.readFile(sql, 'utf8')).slice(0, 2000);
if (!/CREATE TABLE|INSERT INTO/i.test(head)) throw new Error('File hasil dekripsi bukan dump SQL yang valid.');

const targetUrl = flags['target-url'] || (() => {
  if (!flags.db) return null;
  const u = new URL(process.env.DATABASE_URL);
  u.pathname = `/${flags.db}`;
  return u.toString();
})();
if (!targetUrl) throw new Error('Tentukan --db=nama_database atau --target-url.');
const target = new URL(targetUrl);
const productionName = new URL(process.env.DATABASE_URL).pathname.slice(1);
if (target.pathname.slice(1) === productionName && !flags['allow-production']) {
  throw new Error(`Menolak menimpa database production "${productionName}". Gunakan --allow-production setelah backup diverifikasi.`);
}

const mysqlBin = process.env.MYSQL_PATH || (process.platform === 'win32' ? 'mysql.exe' : 'mysql');
const args = [`--host=${target.hostname}`, `--port=${target.port || 3306}`, `--user=${decodeURIComponent(target.username)}`, `--default-character-set=utf8mb4`, target.pathname.slice(1)];
await new Promise((resolve, reject) => {
  const child = spawn(mysqlBin, args, { env: { ...process.env, MYSQL_PWD: decodeURIComponent(target.password) }, stdio: ['pipe', 'ignore', 'pipe'] });
  createReadStream(sql).pipe(child.stdin);
  let error = '';
  child.stderr.on('data', (chunk) => { error += chunk.toString(); });
  child.on('error', reject);
  child.on('close', (code) => code === 0 ? resolve() : reject(new Error(`mysql restore gagal (${code}): ${error.slice(0, 800)}`)));
});
await fs.rm(work, { recursive: true, force: true });
console.log(JSON.stringify({ event: 'restore_mysql_complete', database: target.pathname.slice(1) }));