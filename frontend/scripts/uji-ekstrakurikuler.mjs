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
  'Brand Ambassador', 'Team Konten', 'Stematel ART', 'StematelReader',
];

for (const nama of kegiatan) {
  assert.ok(data.includes(`title: '${nama}'`), `${nama} belum tersedia`);
}

assert.match(page, /useMemo/);
assert.match(page, /aria-label="Cari kegiatan"/);
assert.match(page, /setKategori/);
assert.match(page, /filteredItems/);

console.log('Filter, pencarian, dan 16 kegiatan ekstrakurikuler tersedia.');
