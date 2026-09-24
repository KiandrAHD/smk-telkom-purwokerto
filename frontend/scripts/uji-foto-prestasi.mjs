import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/data/dummyData.js', import.meta.url), 'utf8');

assert.doesNotMatch(source, /showcase-(projek-a|mobil|musik)/, 'Kartu prestasi masih memakai aset showcase.');
assert.match(source, /prestasi-lks-2024/, 'Foto LKS 2024 belum dipakai.');
assert.match(source, /prestasi-uiux-2024/, 'Foto UI/UX 2024 belum dipakai.');
assert.match(source, /prestasi-olahraga-2024/, 'Foto olahraga 2024 belum dipakai.');
assert.match(source, /prestasi-lks-2025/, 'Foto LKS 2025 belum dipakai.');
