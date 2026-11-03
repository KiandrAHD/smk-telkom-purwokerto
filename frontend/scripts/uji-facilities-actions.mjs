import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: FacilitiesSection } = await server.ssrLoadModule('/src/components/FacilitiesSection.jsx');
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  for (const language of ['id', 'en']) {
    const html = renderToStaticMarkup(h(MemoryRouter, null, h(LanguageContext.Provider, {
      value: { language, t: text => translate(text, language) },
    }, h(FacilitiesSection))));
    assert.match(html, /href="\/fasilitas#school-tour"[^>]*>School Tour<\/a>/);
    assert.match(html, new RegExp(`href="/fasilitas"[^>]*>${language === 'id' ? 'Lihat Fasilitas Lainnya' : 'View More Facilities'}</a>`));
    assert(html.indexOf('data-facilities-actions') > html.indexOf('</ol>'), 'Actions follow facility indicators.');
    assert.equal((html.match(/class="facilities-action facilities-action--/g) || []).length, 2);
    assert.doesNotMatch(html, /Lihat semua fasilitas/);
  }
  console.log('Facilities actions: Figma labels, destinations, ordering and ID/EN translations pass.');
} finally {
  await server.close();
}
