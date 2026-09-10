import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = fs.readFileSync(path.join(root, 'src/data/dummyData.js'), 'utf8');
const fallback = fs.readFileSync(path.join(root, 'src/utils/publicContent.js'), 'utf8');

for (const oldAsset of [
  'school-building.jpg',
  'lab-komputer.jpg',
  'perpustakaan.jpg',
  'studio-multimedia.jpg',
  'guru-group.jpg',
  'prestasi-1.jpg',
  'prestasi-2.jpg',
  'prestasi-3.jpg',
  'hero-prestasi.jpg',
  'hero-berita.jpg',
  'hero-panel.jpg',
]) {
  assert(!source.includes(oldAsset), `aset lama masih dipakai di dummyData: ${oldAsset}`);
  assert(!fallback.includes(oldAsset), `aset lama masih dipakai sebagai fallback: ${oldAsset}`);
}

for (const driveAsset of [
  'header-bkk.png',
  'header-jurusan.png',
  'jurusan-rpl.png',
  'jurusan-pg.png',
  'jurusan-tkj.png',
  'jurusan-tjat.png',
  'showcase-projek-a.png',
  'showcase-mobil.png',
  'showcase-musik.png',
]) {
  assert(fs.existsSync(path.join(root, 'src/assets/drive', driveAsset)), `aset Drive tidak ditemukan: ${driveAsset}`);
}

console.log('uji-aset-drive: semua aset utama memakai foto Drive.');
