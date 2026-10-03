import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { isSectionRoute } = await server.ssrLoadModule('/src/utils/navigation.js');
  assert.equal(isSectionRoute('/berita/article', '/berita'), true);
  assert.equal(isSectionRoute('/berita-other', '/berita'), false);
  assert.equal(isSectionRoute('/profil-sekolah', '/'), false);
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const value = { language: 'en', locale: 'en-US', t: (text, vars) => translate(text, 'en', vars), setLanguage: () => {} };
  const render = (element, path = '/berita/article') => renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [path] }, createElement(LanguageContext.Provider, { value }, element)));
  const load = async (path) => (await server.ssrLoadModule(path)).default;
  const Navbar = await load('/src/components/Navbar.jsx');
  const MainLayout = await load('/src/layouts/MainLayout.jsx');
  const PublicDataState = await load('/src/components/PublicDataState.jsx');
  const SearchResultStatus = await load('/src/components/SearchResultStatus.jsx');
  const DetailLayout = await load('/src/components/DetailLayout.jsx');
  const nav = render(createElement(Navbar));
  assert.match(nav, /<a (?=[^>]*href="\/berita")(?=[^>]*aria-current="location")/);
  assert.equal(nav.includes('role="menu"'), false);
  assert.equal(nav.includes('role="menuitem"'), false);
  const shell = render(createElement(MainLayout, { busy: true }, createElement('h1', null, 'Content')));
  assert.match(shell, /href="#main-content"/);
  assert.match(shell, /Skip to main content/);
  assert.match(shell, /id="main-content" tabindex="-1" aria-busy="true"/);
  const failure = render(createElement(PublicDataState, { error: 'Berita belum dapat dimuat. Silakan coba lagi nanti.', onRetry: () => {}, label: 'berita' }));
  assert.match(failure, /role="alert"/);
  assert.match(failure, />Try again<\/button>/);
  const pending = render(createElement(PublicDataState, { loading: true, label: 'berita' }));
  assert.match(pending, /role="status"/);
  assert.match(pending, /aria-hidden="true"/);
  assert.equal((pending.match(/aspect-\[16\/10\]/g) || []).length, 4);
  const live = render(createElement(SearchResultStatus, { message: '1 result' }));
  assert.match(live, /role="status" aria-live="polite" aria-atomic="true"/);
  assert.equal(translate('{count} kegiatan ditemukan', 'en', { count: 1 }), '1 activities found');
  const detail = render(createElement(DetailLayout, { item: { title: 'Sample', kategori: 'Berita', body: [] }, backTo: '/berita', backLabel: 'Berita' }));
  assert.match(detail, /aria-label="Breadcrumb"/);
  assert.match(detail, /aria-current="page"[^>]*>Sample<\/span>/);
  console.log('QoL: route boundaries, current section, disclosure semantics, skip target, busy shell, error/retry, skeleton, live status and breadcrumb pass.');
} finally {
  await server.close();
}
