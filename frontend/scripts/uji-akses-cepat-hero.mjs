import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [hero, footer, layout, data, app] = await Promise.all([
  readFile(new URL('../src/components/HeroSection.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/Footer.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/layouts/MainLayout.jsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/data/dummyData.js', import.meta.url), 'utf8'),
  readFile(new URL('../src/App.jsx', import.meta.url), 'utf8'),
]);

const quickLinks = data.match(/export const quickLinks = \[([\s\S]*?)\n\];/)?.[1] ?? '';
const expectedLinks = [
  ['PPDB', '/ppdb'],
  ['STELA AI', '/stela'],
  ['NextTel AI', '/nexttel'],
];

for (const [title, href] of expectedLinks) {
  assert.ok(quickLinks.includes(`title: '${title}'`), `${title} belum ada di panel akses cepat`);
  assert.ok(quickLinks.includes(`href: '${href}'`), `Tautan ${href} belum ada`);
  assert.ok(app.includes(`path="${href}"`), `Rute ${href} belum tersedia`);
}

for (const obsolete of ['Jurusan', 'BKK']) {
  assert.ok(!quickLinks.includes(`title: '${obsolete}'`), `${obsolete} masih ada di panel akses cepat`);
}

assert.match(hero, /lg:grid-cols-3/);
assert.match(hero, /lg:absolute/);
assert.match(hero, /lg:translate-y-1\/2/);
assert.doesNotMatch(hero, /to="\/login"[\s\S]*Login Admin/);
assert.match(footer, /to="\/login"[\s\S]*Akses Staf & Admin/);
assert.match(footer, /Kebijakan Privasi/);
assert.match(layout, /<Footer \/>/);

console.log('Panel hero hanya memuat tiga akses utama; akses admin berada di bar footer bersama.');
