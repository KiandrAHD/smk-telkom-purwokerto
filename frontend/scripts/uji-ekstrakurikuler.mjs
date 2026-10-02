import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

// Daftar Prestasi yang dikonfirmasi pengguna; PMR/Paskibra juga Organisasi.
const prestasi = [
  'Desain Grafis', 'Web Technologies', 'AI / Artificial Intelligence', 'IT Software',
  'Robotik', 'Cyber Security (EISS)', 'Information Network Cabling (INC)',
  '3D Game Art (Animasi)', 'English Club', 'Paduan Suara', 'Seni Musik', 'Seni Tari',
  'PMR', 'Paskibra', 'Fotografi dan Videografi', 'Basket', 'Bulu Tangkis', 'Futsal',
  'Voli', 'Bela Diri', 'E-Sport', 'Musik Tradisional/Karawitan', 'Hand Ball/Bola Tangan',
];
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { ekstrakurikulerData: data } = await server.ssrLoadModule('/src/data/dummyData.js');
  const titles = (category) => data.items
    .filter((item) => (item.categories ?? [item.category]).includes(category))
    .map((item) => item.title).sort();
  assert.deepEqual(titles('Prestasi'), [...prestasi].sort(), 'Tab Prestasi harus mencakup semua 23 ekskul yang dikonfirmasi.');
  assert.deepEqual(titles('Organisasi'), ['OSIS', 'Pramuka', 'PMR', 'MPK', 'Paskibra'].sort());
  assert.equal(data.items.length, 34, 'Daftar Semua memiliki 34 kegiatan unik.');
  assert.equal(new Set(data.items.map((item) => item.title)).size, 34, 'Keanggotaan dua kategori tidak menggandakan kartu.');
  assert.deepEqual(data.stats.map((stat) => stat.value), [5, 23, 4, 4], 'Ringkasan harus sama dengan daftar kategori.');
  for (const item of data.items) {
    assert.ok((item.categories ?? [item.category]).every((category) => data.categories.includes(category)));
    assert.ok(Array.isArray(item.focus));
  }
  data.items.push({ title: 'Kegiatan uji', category: 'Prestasi' });
  try {
    assert.equal(data.stats.find((stat) => stat.category === 'Prestasi').value, 24, 'Ringkasan mengikuti perubahan data tanpa angka tetap.');
  } finally {
    data.items.pop();
  }
  const { default: Page } = await server.ssrLoadModule('/src/pages/EkstrakurikulerPage.jsx');
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Page)));
  assert.equal((html.match(/<article\b/g) ?? []).length, 34, 'Semua kegiatan harus dirender tanpa batas empat kartu.');
  assert.ok(html.includes('34 kegiatan'));
  assert.equal((html.match(/aria-label="Foto belum tersedia"/g) ?? []).length, 5, 'Foto kosong memakai penanda, bukan gambar rusak.');
  console.log('34 kegiatan unik; Organisasi 5, Prestasi 23, Sentra 4, Community 4; seluruh kartu dan ringkasan dinamis terverifikasi.');
} finally {
  await server.close();
}
