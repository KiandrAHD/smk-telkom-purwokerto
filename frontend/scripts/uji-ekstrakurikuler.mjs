import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [page, data] = await Promise.all([
  readFile(new URL('../src/pages/EkstrakurikulerPage.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/dummyData.js', import.meta.url), 'utf8'),
]);

const kegiatan = [
  'Desain Grafis', 'Web Technologies', 'AI / Artificial Intelligence', 'IT Software',
  'Robotik', 'Cyber Security (EISS)', 'Information Network Cabling (INC)',
  '3D Game Art (Animasi)', 'English Club', 'Paduan Suara', 'Seni Musik', 'Seni Tari',
  'PMR', 'Paskibra', 'Photografi dan Vidiografi', 'Basket', 'Bulu Tangkis', 'Futsal',
  'Voli', 'Bela Diri', 'E-Sport', 'Musik Tradisional/Karawitan', 'Hand Ball/Bola Tangan',
  'OSIS', 'Pramuka', 'MPK', 'Wirausaha', 'PIK-R', 'ROHIS', 'ROHKRIS',
  'Brand Ambassador', 'Team Konten', 'Stematel ART', 'Stematel Reader',
];

const activityData = data.split('export const ekstrakurikulerData = {')[1].split('// ── STELA AI ──')[0];
const activityTitles = [...activityData.matchAll(/\{ title: '([^']+)'/g)].map(([, title]) => title);
assert.equal(activityTitles.length, kegiatan.length, 'Daftar ekskul memiliki entri ganda atau jumlahnya salah');
assert.equal(new Set(activityTitles).size, activityTitles.length, 'Nama ekskul harus unik');

for (const nama of kegiatan) {
  assert.ok(data.includes(`title: '${nama}'`), `${nama} belum tersedia`);
}

assert.match(page, /aria-label="Cari kegiatan"/);
assert.match(page, /const \[activeCategory, setActiveCategory\] = useState\('Ekstrakurikuler'\)/);
assert.match(page, /activeCategory === 'Ekstrakurikuler' \|\| item\.category === activeCategory/);
assert.match(page, /CategoryTabs activeCategory=\{activeCategory\} onSelect=\{onSelect\}/);
assert.match(page, /onSelect=\{setActiveCategory\}/);
assert.match(page, /name === 'Ekstrakurikuler' \? 'Semua' : name/);
assert.match(page, /Semua kegiatan/);
assert.ok(!page.includes('slice(0, 4)'), 'Daftar kegiatan masih dibatasi empat item');
assert.match(page, /lg:grid-cols-4/);
assert.ok(!page.includes('Penjelasan kategori'), 'Penjelasan kategori masih tampil di halaman');
assert.ok(!data.includes('categoryDetails:'), 'Data penjelasan kategori masih tersisa');
assert.match(page, /const ActivityDetailDialog/);
assert.match(page, /<dialog/);
assert.match(page, /showModal\(\)/);
assert.match(page, /const \[selectedItem, setSelectedItem\] = useState\(null\)/);
assert.match(page, /onOpen\(item\)/);
for (const nama of kegiatan) {
  const item = data.match(new RegExp(`title: '${nama.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?focus: \\[([\\s\\S]*?)\\]`));
  assert.ok(item?.[1], `Detail yang dipelajari untuk ${nama} belum tersedia`);
}
assert.ok(!page.includes('scrollIntoView'), 'Filter masih menggulir ke section lain');
assert.ok(!page.includes('RibbonDivider'), 'Kategori masih dirender sebagai section bertumpuk');
assert.match(page, /footerAccent/);

assert.match(page, /max-w-7xl/, 'Container belum mengikuti skala halaman publik lain');
assert.match(page, /lg:px-8/, 'Padding desktop belum mengikuti halaman publik lain');
for (const ukuranBerlebih of ['max-w-[1763px]', 'max-w-[1565px]', 'lg:text-[50px]', 'lg:h-[416px]']) {
  assert.ok(!page.includes(ukuranBerlebih), `${ukuranBerlebih} masih membuat halaman tampak terlalu besar`);
}

console.log(`Filter kategori, pencarian, grid empat kolom, dan ${activityTitles.length} kegiatan tersedia.`);
