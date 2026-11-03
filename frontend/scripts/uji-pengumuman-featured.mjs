import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: Section } = await server.ssrLoadModule('/src/components/pengumuman/PengumumanPpdbSection.jsx');
  const { latestPublishedAnnouncements } = await server.ssrLoadModule('/src/utils/featuredAnnouncements.js');
  const { toPengumumanItem } = await server.ssrLoadModule('/src/utils/publicContent.js');
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const rows = [
    { id: 1, judul: 'Older publication', slug: 'older', tanggal: '2026-10-01T00:00:00Z', created_at: '2026-11-01T00:00:00Z', status: 'published' },
    { id: 2, judul: 'Latest publication', slug: 'latest', tanggal: '2026-10-02T00:00:00Z', created_at: '2026-10-03T00:00:00Z', status: 'published', ringkasan: 'Actual summary' },
    { id: 3, judul: 'Draft', slug: 'draft', tanggal: '2027-01-01', status: 'draft' },
    { id: 4, judul: 'No slug', tanggal: '2027-01-01', status: 'published' },
    { id: 5, judul: 'Created fallback', slug: 'fallback', created_at: '2026-09-01T00:00:00Z', status: 'published' },
  ];
  const items = rows.map(toPengumumanItem);
  assert.deepEqual(latestPublishedAnnouncements(items).map(item => item.id), [2, 1, 5]);
  assert.equal(items[0].id, 1, 'Input order must not be mutated.');
  const render = (props = {}, language = 'id') => renderToStaticMarkup(createElement(LanguageContext.Provider, { value: { language, locale: language === 'en' ? 'en-US' : 'id-ID', t: text => translate(text, language) } }, createElement(MemoryRouter, null, createElement(Section, { items, now: new Date('2026-11-03T00:00:00Z'), ...props }))));
  const html = render();
  assert.match(html, /Latest publication/);
  assert.match(html, /Actual summary/);
  assert.match(html, /href="\/pengumuman\/informasi-penting"/);
  for (const slug of ['latest', 'older', 'fallback']) assert.ok(html.includes(`href="/pengumuman/${slug}"`));
  assert.doesNotMatch(html, />Draft<|>No slug</);
  assert.match(html, /Belum ada pengumuman yang diterbitkan hari ini/);
  assert.doesNotMatch(render({ now: new Date('2026-10-02T04:00:00Z') }), /Belum ada pengumuman yang diterbitkan hari ini/);
  assert.match(render({ loading: true }), /aria-busy="true"/);
  assert.match(render({ loading: true }), /Memuat pengumuman/);
  assert.doesNotMatch(render({ loading: true }), /href="\/pengumuman\/latest"/);
  assert.match(render({ error: 'Gagal memuat pengumuman.' }), /role="alert"/);
  assert.match(render({ items: [] }), /Belum ada pengumuman\./);
  assert.doesNotMatch(render({ tampilkanLihatSemua: false }), /href="\/pengumuman\/informasi-penting"/);
  for (const text of ['Important Information Today', 'Latest Announcements', 'View All']) assert.ok(render({}, 'en').includes(text), text);
  assert.match(render({ items: [] }, 'en'), /No announcements yet/);
  assert.match(translate('Batik bukan sekadar warisan budaya, tetapi bagian dari identitas Indonesia yang terus hidup dan berkembang.\n\nDi tengah era digital, mari kita tetap bangga mengenal, memakai, dan melestarikan batik sebagai warisan budaya Nusantara.', 'en'), /Batik is more than cultural heritage/);
  console.log('PASS featured announcements: publication ordering/fallback, eligibility, source data, today/latest, links, loading/error/empty, ID/EN.');
} finally {
  await server.close();
}
