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
  'jurusan/stock-hd/rpl-software-development.webp',
  'jurusan/stock-hd/server-monitoring.webp',
  'jurusan/stock-hd/game-development.webp',
  'jurusan/stock-hd/fiber-optic-network.webp',
];
for (const image of images) {
  const file = path.join(root, 'src/assets', image);
  const { width, height, format } = await sharp(file).metadata();
  const bytes = (await stat(file)).size;
  assert(format === 'webp' && width >= 1000 && height >= 500, `Gambar tidak sesuai: ${image}`);
  assert(bytes < 350 * 1024, `Gambar terlalu besar: ${image} (${Math.round(bytes / 1024)} KB)`);
}

const responsive = [
  ['hero', [640, 960, 1440], 74220],
  ['poster', [640, 960, 1440], 145309],
  ['partners', [960, 1440, 1847], 284699],
  ['stela-card-en', [720, 960, 1440, 1920, 2172], 1536011],
];
for (const [name, widths, originalBytes] of responsive) {
  for (const width of widths) {
    const file = path.join(root, `src/assets/responsive/${name}-${width}.webp`);
    const meta = await sharp(file).metadata();
    assert.equal(meta.width, width, `Wrong width descriptor: ${name}-${width}`);
    assert.equal(meta.format, 'webp');
    if (name === 'stela-card-en') assert.equal(meta.height * 3, meta.width, 'STELA candidates must retain the exact 3:1 source ratio');
    assert((await stat(file)).size < originalBytes, `Derivative exceeds original transfer size: ${name}-${width}`);
  }
}
// WebP may rewrite RGB under fully transparent pixels. Compare visible pixels
// on both dark and light backgrounds, plus the alpha channel independently.
const originalFile = path.join(root, 'src/assets/landing/partners-bg.png');
const losslessFile = path.join(root, 'src/assets/responsive/partners-1847.webp');
for (const background of ['#000000', '#ffffff']) {
  const original = await sharp(originalFile).flatten({ background }).raw().toBuffer();
  const lossless = await sharp(losslessFile).flatten({ background }).raw().toBuffer();
  assert.ok(original.equals(lossless), 'Lossless partner background changed visible pixels');
}
const originalAlpha = await sharp(originalFile).ensureAlpha().extractChannel('alpha').raw().toBuffer();
const losslessAlpha = await sharp(losslessFile).ensureAlpha().extractChannel('alpha').raw().toBuffer();
assert.ok(originalAlpha.equals(losslessAlpha), 'Lossless partner background changed alpha');

const englishSource = path.join(root, 'src/assets/landing/stela-card-en.png');
const englishFull = path.join(root, 'src/assets/responsive/stela-card-en-2172.webp');
assert.ok((await sharp(englishSource).raw().toBuffer()).equals(await sharp(englishFull).raw().toBuffer()), 'Full-size English STELA must preserve every decoded pixel');

console.log(`uji-performa: JavaScript awal ${Math.round(entryBytes / 1024)} KB; ${images.length} gambar utama di bawah 350 KB; 14 varian responsif lebih kecil dari sumber, background dan STELA ukuran penuh lossless identik.`);
