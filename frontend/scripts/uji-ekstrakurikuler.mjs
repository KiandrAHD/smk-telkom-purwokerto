import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [page, data] = await Promise.all([
  readFile(new URL('../src/pages/EkstrakurikulerPage.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/dummyData.js', import.meta.url), 'utf8'),
]);

const kegiatan = [
  'OSIS', 'Pramuka', 'PMR', 'MPK',
  'Futsal', 'Basket', 'Robotik', 'E-Sport',
  'Wirausaha', 'PIK-R', 'ROHIS', 'ROHKRIS',
  'Brand Ambassador', 'Team Konten', 'Stematel ART', 'Stematel Reader',
];

for (const nama of kegiatan) {
  assert.ok(data.includes(`title: '${nama}'`), `${nama} belum tersedia`);
}

assert.match(page, /aria-label="Cari kegiatan"/);
assert.match(page, /const \[activeCategory, setActiveCategory\] = useState\('Semua'\)/);
assert.match(page, /activeCategory === 'Semua' \|\| item\.category === activeCategory/);
assert.match(page, /CategoryTabs activeCategory=\{activeCategory\} onSelect=\{onSelect\}/);
assert.match(page, /onSelect=\{setActiveCategory\}/);
assert.ok(!page.includes('scrollIntoView'), 'Filter masih menggulir ke section lain');
assert.ok(!page.includes('RibbonDivider'), 'Kategori masih dirender sebagai section bertumpuk');
assert.match(page, /footerAccent/);
assert.match(page, /ChevronLeft/);
assert.match(page, /ChevronRight/);
assert.match(page, /event\.key === 'ArrowLeft'/);
assert.match(page, /event\.key === 'ArrowRight'/);
assert.match(page, /aria-current/);
assert.match(page, /carousel && index/);
assert.match(page, /hidden h-full lg:block/);

assert.match(page, /max-w-7xl/, 'Container belum mengikuti skala halaman publik lain');
assert.match(page, /lg:px-8/, 'Padding desktop belum mengikuti halaman publik lain');
for (const ukuranBerlebih of ['max-w-[1763px]', 'max-w-[1565px]', 'lg:text-[50px]', 'lg:h-[416px]']) {
  assert.ok(!page.includes(ukuranBerlebih), `${ukuranBerlebih} masih membuat halaman tampak terlalu besar`);
}

console.log('Filter kategori tunggal, carousel, pencarian, skala halaman publik, dan 16 kegiatan tersedia.');
