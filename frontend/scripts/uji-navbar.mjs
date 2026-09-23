import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [navbar, data, app] = await Promise.all([
  readFile(new URL('../src/components/Navbar.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/dummyData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
]);

const navLinks = data.match(/export const navLinks = \[([\s\S]*?)\n\];/)?.[1] ?? '';
const expectedLinks = [
  ['PPDB', '/ppdb'],
  ['STELA AI', '/stela'],
  ['NextTel AI', '/nexttel'],
];

for (const [label, href] of expectedLinks) {
  assert.ok(navLinks.includes(`label: '${label}', href: '${href}'`), `${label} belum ada di navbar`);
  assert.ok(app.includes(`path="${href}"`), `Rute ${href} belum tersedia`);
}

for (const obsolete of ['Tentang', 'Jurusan', 'Prestasi', 'BKK', 'Berita', 'Pengumuman']) {
  assert.ok(!navLinks.includes(`label: '${obsolete}'`), `${obsolete} masih ada di navbar`);
}

assert.match(navbar, /hidden lg:flex flex-col items-center/);
assert.match(navbar, /to="\/login"[\s\S]*Login Admin/);
assert.ok(!navbar.includes('ChevronDown'), 'Dropdown navbar lama masih tersisa');
assert.ok(!navbar.includes('link.children'), 'Referensi submenu navbar lama masih tersisa');

console.log('Navbar memuat PPDB, STELA AI, NextTel AI, dan Login Admin pada baris terpisah.');
