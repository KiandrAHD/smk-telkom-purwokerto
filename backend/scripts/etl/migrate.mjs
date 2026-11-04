#!/usr/bin/env node
// Read-only ETL: Supabase REST API -> MySQL via Prisma.
// Usage: node scripts/etl/migrate.mjs [--dry-run] [--batch=500]
//
// Sumber Supabase hanya dibaca (GET). Tidak ada penulisan ke sumber.
// Target MySQL menerima upsert idempoten (ON DUPLICATE KEY UPDATE).
// File storage publik diunduh ke uploads/ agar gambar tetap dapat diakses
// tanpa ketergantungan operasional pada Supabase Storage.
import 'dotenv/config';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import { prisma } from '../../src/db.js';
import { storage } from '../../src/utils/storage.js';

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const DRY_RUN = Boolean(args['dry-run']);
const BATCH = Number(args.batch || 1000);

function readEnv(file) {
  const out = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (m) out[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return out;
}
const feEnvPath = path.resolve('frontend/.env');
const parentEnvPath = path.resolve('../frontend/.env');
const feEnv = fs.existsSync(feEnvPath) ? readEnv(feEnvPath) : fs.existsSync(parentEnvPath) ? readEnv(parentEnvPath) : {};
const SUPABASE_URL = process.env.SUPABASE_URL || feEnv.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || feEnv.VITE_SUPABASE_ANON_KEY;
if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('SUPABASE_URL/SUPABASE_ANON_KEY tidak tersedia. Baca README.'); process.exit(1); }
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const errorsFile = path.resolve('docs', `etl-errors-${stamp}.jsonl`);
const summaryFile = path.resolve('docs', `etl-summary-${stamp}.json`);
const summary = { startedAt: new Date().toISOString(), dryRun: DRY_RUN, tables: {}, storage: { downloaded: 0, failed: 0 } };
let totalFailed = 0;
fs.mkdirSync(path.dirname(errorsFile), { recursive: true });

const target = await mysql.createConnection(process.env.DATABASE_URL);

async function fetchAll(table, columns) {
  const cols = columns.join(',');
  const rows = [];
  let offset = 0;
  for (;;) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?select=${cols}&limit=${BATCH}&offset=${offset}`;
    const res = await fetch(url, { headers: { ...headers, Prefer: 'count=exact' } });
    if (res.status === 404) { console.log(`  ${table}: tabel tidak ditemukan (404)`); return null; }
    if (!res.ok) throw new Error(`${table} REST ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    rows.push(...batch);
    const range = res.headers.get('content-range');
    if (!range || range.endsWith('*')) break;
    const [, total] = range.split('/');
    if (rows.length >= Number(total)) break;
    offset += BATCH;
  }
  return rows;
}

const TABLES = [
  ['site_settings', ['id', 'school_name', 'npsn', 'address', 'phone', 'email', 'website', 'logo_url', 'academic_year', 'spmb_open', 'news_page_size', 'revision', 'updated_at']],
  ['berita', ['id', 'judul', 'slug', 'ringkasan', 'konten', 'gambar_url', 'penulis', 'status', 'created_at', 'updated_at']],
  ['pengumuman', ['id', 'judul', 'slug', 'ringkasan', 'konten', 'gambar_url', 'status', 'tanggal', 'created_at', 'updated_at']],
  ['prestasi', ['id', 'judul', 'slug', 'kategori', 'deskripsi', 'gambar_url', 'instagram_url', 'tingkat', 'tanggal', 'created_at', 'updated_at']],
  ['bkk', ['id', 'perusahaan', 'posisi', 'deskripsi', 'lokasi', 'tipe_pekerjaan', 'deadline', 'status', 'link_pendaftaran', 'logo_url', 'created_at', 'updated_at']],
  ['events', ['id', 'judul', 'ringkasan', 'deskripsi', 'kategori', 'tanggal_mulai', 'waktu_mulai', 'tanggal_selesai', 'waktu_selesai', 'lokasi', 'penyelenggara', 'gambar_url', 'link_informasi', 'status', 'created_at', 'updated_at']],
  ['spmb_information', ['id', 'jenis', 'judul', 'deskripsi', 'urutan', 'tanggal_mulai', 'tanggal_selesai', 'tanggal_seleksi', 'tanggal_pengumuman', 'ikon', 'tautan_url', 'sumber_url', 'status', 'kuota_total', 'created_at', 'updated_at']],
  ['admins', ['id', 'user_id', 'nama', 'created_at']],
  ['ppdb', ['id', 'auth_user_id', 'nama_lengkap', 'nisn', 'nik', 'asal_sekolah', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'tahun_lulus', 'alamat', 'no_hp', 'email', 'pilihan_jurusan', 'nilai_rapor', 'dokumen_url', 'status', 'catatan_admin', 'created_at', 'updated_at']],
  ['ppdb_drafts', ['auth_user_id', 'biodata', 'nilai', 'updated_at']],
  // ai_daily_attempts di Supabase dilindungi RLS (anon ditolak 401); dicatat sebagai blocked.
  ['ai_daily_attempts', ['feature', 'day', 'attempts'], { optional: true }],
  // site_visitors sumber tidak punya kolom `day`; diturunkan dari created_at (UTC date).
  ['site_visitors', ['visitor_hash', 'created_at']],
];

function toMysql(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return value ? 1 : 0;
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
}

async function upsert(table, columns, row) {
  const cols = columns.map((c) => `\`${c}\``).join(',');
  const updateCols = columns.filter((c) => !(table === 'site_settings' && c === 'id') && c !== 'id');
  const update = updateCols.length ? updateCols.map((c) => `\`${c}\`=VALUES(\`${c}\`)`).join(',') : '`id`=VALUES(`id`)';
  const sql = `INSERT INTO \`${table}\` (${cols}) VALUES (${columns.map(() => '?').join(',')}) ON DUPLICATE KEY UPDATE ${update}`;
  await target.execute(sql, columns.map((c) => toMysql(row[c])));
}

// Storage migration: unduh object Supabase Storage publik ke uploads/<bucket>/<path>.
async function downloadStorageObject(originalUrl) {
  if (!originalUrl || typeof originalUrl !== 'string') return null;
  if (!originalUrl.includes('/storage/v1/object/')) return null;
  const match = originalUrl.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!match) return null;
  const [, bucket, objectPath] = match;
  const res = await fetch(originalUrl);
  if (!res.ok) throw new Error(`Storage ${originalUrl} -> ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  if (!DRY_RUN) {
    const localUrl = await storage.put(bucket, objectPath, buffer);
    return localUrl;
  }
  return originalUrl;
}

const rewriteStorageUrls = ['gambar_url', 'logo_url'];

for (const [table, columns, options = {}] of TABLES) {
  try {
    const rows = await fetchAll(table, columns);
    if (rows === null) { summary.tables[table] = { source: 0, imported: 0, failed: 0, target: 'n/a', status: 'missing' }; console.log(`${table}: missing`); continue; }
    let imported = 0; let failed = 0;
    for (const row of rows) {
      try {
        // site_visitors: sumber tidak punya `day`, turunkan dari created_at (UTC).
        if (table === 'site_visitors') row.day = row.created_at ? new Date(row.created_at).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
        for (const field of rewriteStorageUrls) {
          if (row[field] && String(row[field]).includes('/storage/v1/object/')) {
            const localUrl = await downloadStorageObject(row[field]);
            if (localUrl) row[field] = localUrl;
            summary.storage.downloaded += 1;
          }
        }
        if (!DRY_RUN) await upsert(table, columns, row);
        imported += 1;
      } catch (err) {
        failed += 1; totalFailed += 1;
        fs.appendFileSync(errorsFile, JSON.stringify({ table, id: row.id ?? row.auth_user_id ?? row.feature, error: err.message }) + '\n');
      }
    }
    const [targetRows] = DRY_RUN ? [[{ n: 'n/a' }]] : await target.query(`SELECT count(*) AS n FROM \`${table}\``);
    summary.tables[table] = { source: rows.length, imported, failed, target: targetRows[0].n, status: failed === 0 ? 'PASS' : 'PARTIAL' };
    console.log(`${table}: source=${rows.length} imported=${imported} failed=${failed} target=${summary.tables[table].target}`);
  } catch (err) {
    const blocked = options.optional && /401|permission denied|42501/.test(err.message);
    summary.tables[table] = { source: 'blocked', imported: 0, failed: 0, target: 'n/a', status: blocked ? 'BLOCKED_RLS' : 'FAIL', error: err.message };
    console.error(`${table}: ${blocked ? 'BLOCKED (RLS)' : 'ERROR'} ${err.message}`);
  }
}

// FK integrity
const [orphanPpdb] = await target.query('SELECT count(*) AS n FROM ppdb p LEFT JOIN users u ON u.id = p.auth_user_id WHERE p.auth_user_id IS NOT NULL AND u.id IS NULL');
const [orphanDraft] = await target.query('SELECT count(*) AS n FROM ppdb_drafts d LEFT JOIN users u ON u.id = d.auth_user_id WHERE u.id IS NULL');
summary.integrity = { orphanPpdb: orphanPpdb[0].n, orphanDraft: orphanDraft[0].n };
summary.finishedAt = new Date().toISOString();
summary.totalFailed = totalFailed;
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
console.log(`Summary: ${summaryFile}`);
await target.end();
await prisma.$disconnect();
process.exit(totalFailed > 0 || summary.integrity.orphanPpdb > 0 ? 1 : 0);