import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const module = await server.ssrLoadModule('/src/pages/GuruPage.jsx');
  const { profilGuruData } = await server.ssrLoadModule('/src/data/profilGuruData.js');
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const render = (Component, teachers, language = 'id') => renderToStaticMarkup(h(MemoryRouter, null,
    h(LanguageContext.Provider, { value: { language, t: (text, vars) => translate(text, language, vars) } },
      h(Component, teachers ? { teachers } : {}))));
  // Server baseline is desktop: one current page, rather than every hidden slide.
  const initial = render(module.default);
  assert.equal((initial.match(/aria-label="Lihat profil /g) || []).length, 8, 'Desktop harus merender delapan profil, bukan seluruh carousel.');
  assert.equal(typeof module.GuruGrid, 'function');
  for (const language of ['id', 'en']) for (const count of [0, 1, 7, 8, 9]) {
    const html = render(module.GuruGrid, profilGuruData.slice(0, count), language);
    assert.equal((html.match(/data-teacher-card=/g) || []).length, Math.min(8, count));
    assert.equal(html.includes('data-teacher-pagination'), count > 8);
    if (count > 8) assert.match(html, /disabled=""/);
    console.log(`PASS ${count} teachers ${language}: page size and finite controls`);
  }
} finally { await server.close(); }
