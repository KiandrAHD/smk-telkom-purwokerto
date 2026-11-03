#!/usr/bin/env node
// Read-only ETL: Supabase PostgreSQL -> MySQL.
// Usage: node scripts/etl/migrate.mjs [--dry-run] [--batch=500] [--retry=3]
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import mysql from 'mysql2/promise';

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
const DRY_RUN = Boolean(args['dry-run']);
const BATCH = Number(args.batch || 500);
const RETRY = Number(args.retry || 3);
const SOURCE = process.env.SOURCE_DATABASE_URL;
const TARGET = process.env.DATABASE_URL;

if (!SOURCE || !TARGET) {
  console.error('SOURCE_DATABASE_URL dan DATABASE_URL wajib. Tidak ada data yang diubah.');
  process.exit(1);
}
if (SOURCE === TARGET) {
  console.error('SOURCE dan TARGET sama. Batal.');
  process.exit(1);
}

const TABLES = [
  ['users', ['id', 'email', 'password_hash', 'email_verified', 'role', 'created_at', 'updated_at']],
  ['admins', ['id', 'user_id', 'nama', 'created_at']],
  ['berita', ['id', 'judul', 'slug', 'ringkasan', 'konten', 'gambar_url', 'penulis', 'status', 'created_at', 'updated_at']],
  ['pengumuman', ['id', 'judul', 'slug', 'ringkasan', 'konten', 'gambar_url', 'status', 'tanggal', 'created_at', 'updated_at']],
  ['prestasi', ['id', 'judul', 'slug', 'kategori', 'deskripsi', 'gambar_url', 'instagram_url', 'tingkat', 'tanggal', 'created_at', 'updated_at']],
  ['bkk', ['id', 'perusahaan', 'posisi', 'deskripsi', 'lokasi', 'tipe_pekerjaan', 'deadline', 'status', 'link_pendaftaran', 'logo_url', 'created_at', 'updated_at']],
  ['ppdb', ['id', 'auth_user_id', 'nama_lengkap', 'nisn', 'nik', 'asal_sekolah', 'tempat_lahir', 'tanggal_lahir', 'jenis_kelamin', 'agama', 'tahun_lulus', 'alamat', 'no_hp', 'email', 'pilihan_jurusan', 'nilai_rapor', 'dokumen_url', 'status', 'catatan_admin', 'created_at', 'updated_at']],
  ['ppdb_drafts', ['auth_user_id', 'biodata', 'nilai', 'updated_at']],
  ['events', ['id', 'judul', 'ringkasan', 'deskripsi', 'kategori', 'tanggal_mulai', 'waktu_mulai', 'tanggal_selesai', 'waktu_selesai', 'lokasi', 'penyelenggara', 'gambar_url', 'link_informasi', 'status', 'created_at', 'updated_at']],
  ['spmb_information', ['id', 'jenis', 'judul', 'deskripsi', 'urutan', 'tanggal_mulai', 'tanggal_selesai', 'tanggal_seleksi', 'tanggal_pengumuman', 'ikon', 'tautan_url', 'sumber_url', 'status', 'kuota_total', 'created_at', 'updated_at']],
  ['site_settings', ['id', 'school_name', 'npsn', 'address', 'phone', 'email', 'website', 'logo_url', 'academic_year', 'spmb_open', 'news_page_size', 'revision', 'updated_at']],
  ['ai_daily_attempts', ['feature', 'day', 'attempts']],
  ['site_visitors', ['visitor_hash', 'day', 'created_at']],
];

const toMysql = (value) => {
  if (value === null || value === undefined) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 23).replace('T', ' ');
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 1 : 0;
  return value;
};

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const errorsFile = path.resolve('docs', `etl-errors-${stamp}.jsonl`);
const summaryFile = path.resolve('docs', `etl-summary-${stamp}.json`);
const summary = { startedAt: new Date().toISOString(), dryRun: DRY_RUN, tables: {} };
let failed = 0;

const source = new pg.Client({ connectionString: SOURCE, statement_timeout: 60000 });
const target = await mysql.createConnection(TARGET);
await source.connect();

async function upsert(table, columns, row) {
  const updateCols = columns.filter((c) => c !== 'id');
  const sql = `INSERT INTO \`${table}\` (${columns.map((c) => `\`${c}\``).join(',')}) VALUES (${columns.map(() => '?').join(',')}) ON DUPLICATE KEY UPDATE ${updateCols.map((c) => `\`${c}\`=VALUES(\`${c}\`)`).join(',')}`;
  await target.execute(sql, columns.map((c) => toMysql(row[c])));
}

for (const [table, columns] of TABLES) {
  const where = table === 'users' ? "WHERE EXISTS (SELECT 1 FROM auth.users au WHERE au.id = users.id)" : '';
  const { rows: countRows } = await source.query(`SELECT count(*)::int AS n FROM "${table}" ${where}`);
  const sourceCount = countRows[0].n;
  let imported = 0;
  const cols = columns.map((c) => `"${c}"`).join(',');
  let offset = 0;
  while (offset < sourceCount) {
    const { rows } = await source.query(`SELECT ${cols} FROM "${table}" ${where} ORDER BY 1 LIMIT $1 OFFSET $2`, [BATCH, offset]);
    for (const row of rows) {
      let attempt = 0;
      for (;;) {
        try {
          if (!DRY_RUN) await upsert(table, columns, row);
          imported += 1;
          break;
        } catch (err) {
          attempt += 1;
          if (attempt > RETRY) {
            failed += 1;
            fs.appendFileSync(errorsFile, JSON.stringify({ table, id: row.id ?? row.auth_user_id ?? row.feature, error: err.message }) + '\n');
            break;
          }
        }
      }
    }
    offset += BATCH;
  }
  const [targetRows] = DRY_RUN ? [[{ n: 'n/a' }]] : await target.query(`SELECT count(*) AS n FROM \`${table}\``);
  summary.tables[table] = { sourceCount, imported, failed, targetCount: targetRows[0].n };
  console.log(`${table}: source=${sourceCount} imported=${imported} failed=${summary.tables[table].failed} target=${summary.tables[table].targetCount}`);
}

// FK integrity validation
const [orphanPpdb] = await target.query('SELECT count(*) AS n FROM ppdb p LEFT JOIN users u ON u.id = p.auth_user_id WHERE p.auth_user_id IS NOT NULL AND u.id IS NULL');
const [orphanDraft] = await target.query('SELECT count(*) AS n FROM ppdb_drafts d LEFT JOIN users u ON u.id = d.auth_user_id WHERE u.id IS NULL');
summary.integrity = { orphanPpdb: orphanPpdb[0].n, orphanDraft: orphanDraft[0].n };
summary.finishedAt = new Date().toISOString();
summary.totalFailed = failed;
fs.mkdirSync(path.dirname(summaryFile), { recursive: true });
fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
console.log(`Summary: ${summaryFile}`);

await source.end();
await target.end();
process.exit(failed > 0 || summary.integrity.orphanPpdb > 0 || summary.integrity.orphanDraft > 0 ? 1 : 0);
