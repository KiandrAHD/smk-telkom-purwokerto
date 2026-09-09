import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const dataPath = new URL('../src/data/dummyData.js', import.meta.url);
const assetDir = new URL('../src/assets/tentang/fasilitas/', import.meta.url);
const source = await readFile(dataPath, 'utf8');
const galeri = source.match(/galeri: \[([\s\S]*?)\n {2}\],\n};/)?.[1] ?? '';
const assets = [
  ['kelasInovasi', 'kelas-inovasi.jpg'],
  ['studioGreenScreen', 'studio-green-screen.jpg'],
  ['robotikTiga', 'robotik-3.png'],
  ['robotikDua', 'robotik-2.png'],
  ['robotikSatu', 'robotik-1.png'],
  ['laboratoriumTjkt', 'laboratorium-tjkt.jpeg'],
  ['ruangKelasDua', 'ruang-kelas-2.jpeg'],
  ['ruangKelasSatu', 'ruang-kelas-1.jpg'],
  ['fasilitasSmkTelkom', 'fasilitas-smk-telkom.png'],
];

for (const [name, file] of assets) {
  await access(new URL(file, assetDir));
  assert.match(source, new RegExp(`import ${name} from '../assets/tentang/fasilitas/${file.replace('.', '\\.')}'`));
  assert.match(galeri, new RegExp(`image: ${name}`));
}

assert.equal((galeri.match(/\{ image:/g) ?? []).length, assets.length);
console.log(`Galeri fasilitas memakai ${assets.length} foto dari folder Drive.`);
