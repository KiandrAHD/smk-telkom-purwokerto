import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { hallOfFame, kisahAlumni } = await server.ssrLoadModule('/src/data/dummyData.js');
  const { default: EvidenceSection } = await server.ssrLoadModule('/src/components/prestasi/PrestasiPerjalananSection.jsx');
  const original = hallOfFame.items;
  try {
    for (const length of [0, 1, 3, 4, 6]) {
      hallOfFame.items = Array.from({ length }, (_, i) => ({
        ...original[0], name: `Peserta ${i}`, sourceUrl: `https://smktelkom-pwt.sch.id/prestasi/${i}/`,
      }));
      const html = renderToStaticMarkup(createElement(EvidenceSection));
      assert.equal((html.match(/<article/g) ?? []).length, Math.min(4, length), 'Jumlah bukti tidak boleh diduplikasi atau crash pada data kosong.');
      assert.equal(html.includes('aria-label="Bukti prestasi berikutnya"'), length > 4, 'Navigasi hanya diperlukan jika masih ada bukti lain.');
      if (length) assert.ok(html.includes('https://smktelkom-pwt.sch.id/prestasi/0/'), 'Bukti harus memiliki tautan sumber yang sama dengan datanya.');
    }
  } finally {
    hallOfFame.items = original;
  }
  const { default: AlumniSection } = await server.ssrLoadModule('/src/components/bkk/BkkAlumniSection.jsx');
  const { MemoryRouter } = await import('react-router-dom');
  const alumni = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(AlumniSection)));
  assert.ok(alumni.includes('Ringkasan testimoni dari situs resmi'));
  assert.ok(!alumni.includes('<blockquote'), 'Parafrasa tidak boleh ditampilkan sebagai kutipan langsung.');
  for (const item of kisahAlumni.items) assert.ok(alumni.includes(item.sourceUrl));
  console.log('Bukti prestasi aman pada 0/1/3/4/6 item; tautan sumber dan ringkasan alumni terpasang.');
} finally {
  await server.close();
}
