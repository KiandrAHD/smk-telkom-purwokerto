import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const paths = ['/src/components/StelaAISection.jsx', '/src/components/jurusan/JurusanFaqSection.jsx', '/src/components/pengumuman/PengumumanBantuanCard.jsx', '/src/components/tentang/TentangHeroSection.jsx'];
  for (const language of ['id', 'en']) {
    const value = { language, locale: language === 'en' ? 'en-US' : 'id-ID', t: (text, vars) => translate(text, language, vars) };
    for (const path of paths) {
      const { default: Component } = await server.ssrLoadModule(path);
      const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(LanguageContext.Provider, { value }, createElement(Component))));
      assert.match(html, /<img\s/, `${path} must retain artwork in ${language}`);
      if (language === 'en') assert.ok(html.includes(path.includes('Tentang') ? 'profil-hero-en' : 'stela-card-en'), `${path} must select the English image`);
      else assert.ok(!html.includes('stela-card-en') && !html.includes('profil-hero-en'), `${path} must retain the Indonesian image`);
      assert.ok(html.includes(path.includes('Tentang') ? 'href="#profil"' : 'href="/stela"'), `${path} must retain a usable CTA`);
      if (path.endsWith('/StelaAISection.jsx')) {
        const links = [...html.matchAll(/<a\b[^>]*href="\/stela"[^>]*>([\s\S]*?)<\/a>/g)];
        assert.equal(links.length, 1, `STELA must have one CTA in ${language}`);
        if (language === 'en') {
          assert.match(links[0][1], /<span class="sr-only">Ask STELA Now<\/span>/, 'English artwork CTA must remain accessible without duplicate visible text');
          assert.ok(!links[0][1].includes('<svg'), 'English CTA must use the arrow already in the artwork');
        } else {
          assert.match(links[0][1], /Tanya STELA Sekarang/);
          assert.ok(links[0][1].includes('<svg'), 'Indonesian CTA must retain its visible arrow');
        }
      }
    }
  }
  console.log('Localized artwork: ID/EN images and CTA destinations pass.');
} finally {
  await server.close();
}
