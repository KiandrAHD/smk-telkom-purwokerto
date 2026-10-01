import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
const render = (Component, props) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Component, props)));

try {
  const { default: PengumumanPopulerCard } = await server.ssrLoadModule('/src/components/pengumuman/PengumumanPopulerCard.jsx');
  const items = Array.from({ length: 6 }, (_, i) => ({ slug: `pengumuman-uji-${i}`, title: `Pengumuman uji ${i}`, date: 'Tanggal uji' }));
  const sidebar = render(PengumumanPopulerCard, { items });
  assert.ok(sidebar.includes('Pengumuman Terbaru'));
  assert.equal((sidebar.match(/href="\/pengumuman\/pengumuman-uji-/g) || []).length, 5);
  assert.ok(!sidebar.includes('Dilihat'));
  assert.ok(!sidebar.includes('ppdb-gelombang-1-dibuka'));
  assert.ok(sidebar.indexOf('pengumuman-uji-0') < sidebar.indexOf('pengumuman-uji-1'));
  const collection = render(PengumumanPopulerCard, { items, tampilkanLihatSemua: false });
  assert.equal((collection.match(/href="\/pengumuman\/pengumuman-uji-/g) || []).length, 6);
  assert.ok(!collection.includes('href="/pengumuman/populer"'));
  assert.ok(!render(PengumumanPopulerCard, {}).includes('ppdb-gelombang-1-dibuka'));

  const { default: BeritaHeroSection } = await server.ssrLoadModule('/src/components/berita/BeritaHeroSection.jsx');
  const berita = render(BeritaHeroSection, { items: [{ slug: 'berita-uji', text: 'Berita untuk pengujian', date: 'Tanggal uji' }] });
  assert.ok(berita.includes('href="/berita/berita-uji"'));
  assert.ok(berita.includes('Baca Berita'));
  assert.ok(!berita.includes('Lihat Prestasi'));

  console.log('Tautan pengumuman memakai items yang diberikan, mempertahankan urutan API, dan tautan berita memakai label yang sesuai.');
} finally {
  await server.close();
}
