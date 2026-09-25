import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const html = await readFile(path.join(root, 'dist/index.html'), 'utf8');
const entry = html.match(/\/assets\/(index-[^"']+\.js)/)?.[1];
assert(entry, 'Berkas JavaScript awal tidak ditemukan di hasil build');
const entryBytes = (await stat(path.join(root, 'dist/assets', entry))).size;
assert(entryBytes < 450 * 1024, `JavaScript awal terlalu besar: ${Math.round(entryBytes / 1024)} KB`);

const images = [
  'drive/jurusan-pg.webp',
  'drive/jurusan-tkj.webp',
  'drive/jurusan-tjat.webp',
  'ekstrakurikuler/organisasi/paskibra.webp',
  'ekstrakurikuler/kegiatan/brand-ambassador.webp',
  'ekstrakurikuler/kegiatan/stematel-art.webp',
];
for (const image of images) {
  const file = path.join(root, 'src/assets', image);
  const { width, height, format } = await sharp(file).metadata();
  const bytes = (await stat(file)).size;
  assert(format === 'webp' && width >= 1000 && height >= 500, `Gambar tidak sesuai: ${image}`);
  assert(bytes < 350 * 1024, `Gambar terlalu besar: ${image} (${Math.round(bytes / 1024)} KB)`);
}

console.log(`uji-performa: JavaScript awal ${Math.round(entryBytes / 1024)} KB; enam gambar utama di bawah 350 KB.`);
