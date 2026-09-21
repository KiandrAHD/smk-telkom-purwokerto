import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/data/dummyData.js', import.meta.url), 'utf8');
const guru = [
  'Firda Ayu Nirmala, S.Kom.',
  'Agus Indra Cahaya, S.Kom.',
  'Bayu Aji Sukma, S.Si.',
  'Herdiyanto, S.Sos.I., M.Pd.',
  'Arif Munandar, S.Si.',
  'Ragil Rudi Priyanto, S.Si.',
];

assert.match(source, /const guruDetailKonten = \{/);
assert.match(source, /const detail = guruDetailKonten\[guru\.nama\]/);
assert.doesNotMatch(source, /body: \[\],/);

for (const nama of guru) {
  assert.ok(source.includes(`'${nama}': {`), `Detail ${nama} belum tersedia`);
}

console.log('Detail enam guru tersedia dan tidak lagi kosong.');
