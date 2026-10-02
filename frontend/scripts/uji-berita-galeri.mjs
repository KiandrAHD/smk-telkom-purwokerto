import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: Agenda } = await server.ssrLoadModule('/src/components/berita/BeritaAgendaSection.jsx');
  const items = [
    { slug: 'berita-ai', title: 'Pelatihan AI terbaru', kategori: 'Teknologi', image: '/ai.jpg', iso: '2026-10-02' },
    { slug: 'berita-kunjungan', title: 'Kunjungan sekolah terbaru', kategori: 'Sekolah', image: '/kunjungan.jpg', iso: '2026-10-01' },
    { slug: 'tanpa-foto', title: 'Pengumuman tanpa foto', kategori: 'Sekolah', image: '', iso: '2026-09-30' },
  ];
  const render = (current) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Agenda, { items: current })));
  const html = render(items);
  assert.ok(html.includes('Pelatihan AI terbaru'), 'Panel kategori harus memakai berita yang ditampilkan, bukan agenda dummy.');
  assert.ok(html.includes('Teknologi') && html.includes('Sekolah'));
  assert.ok(html.includes('2 berita'), 'Jumlah kategori harus sesuai berita yang diberikan.');
  assert.ok(html.includes('src="/ai.jpg"') && html.includes('src="/kunjungan.jpg"'));
  assert.ok(html.includes('/berita/berita-ai?from=galeri'));
  assert.ok(!html.includes('Seminar Cyber Security bersama Telkom'));
  assert.ok(!html.includes('/galeri/tim-siswa-berprestasi'));
  const filtered = render([items[1]]);
  assert.ok(filtered.includes('/kunjungan.jpg') && !filtered.includes('/ai.jpg'));
  assert.ok(!filtered.includes('Teknologi'), 'Kategori juga harus mengikuti filter berita.');
  const empty = render([]);
  assert.ok(!empty.includes('/ai.jpg') && !empty.includes('/kunjungan.jpg'));
  assert.ok(empty.includes('Belum ada foto berita yang ditampilkan.'));
  console.log('Kategori, jumlah, foto, tautan detail, hasil filter, dan keadaan kosong sesuai sumber berita.');
} finally {
  await server.close();
}
