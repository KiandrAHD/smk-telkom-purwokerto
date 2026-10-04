import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

// Exercise the rendered contract: small screens must receive a selectable image,
// while the original remains a fallback and the hero is never lazy-loaded.
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: HeroSection } = await server.ssrLoadModule('/src/components/HeroSection.jsx');
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(HeroSection)));
  const hero = html.match(/<img\b[^>]*alt="Siswa SMK Telkom Purwokerto"[^>]*>/)?.[0];
  assert.ok(hero, 'Hero artwork must remain an image');
  const candidates = hero.match(/srcSet="([^"]+)"/i)?.[1];
  assert.ok(candidates, 'Mobile hero still downloads the full-size image: srcSet is missing');
  assert.match(candidates, /640w/);
  assert.match(candidates, /960w/);
  assert.match(candidates, /1440w/);
  assert.match(candidates, /1920w/);
  assert.match(hero, /sizes="[^"]+"/);
  assert.match(hero, /src="[^"]*header-jurusan[^"]*"/);
  assert.match(hero, /width="1920" height="902"/);
  assert.match(hero, /fetchPriority="high"/i);
  assert.ok(!/loading="lazy"/.test(hero), 'LCP image must not be lazy-loaded');
  console.log('Responsive hero: selectable sizes, original fallback and eager high-priority image pass.');
  if (process.argv.includes('--poster')) {
    const { default: AboutSection } = await server.ssrLoadModule('/src/components/AboutSection.jsx');
    const about = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(AboutSection)));
    const poster = about.match(/<img\b[^>]*src="[^"]*profil-hero[^>]*>/)?.[0];
    assert.ok(poster, 'Video poster must remain an image');
    assert.match(poster, /srcSet="[^"]+"/i, 'Video poster still downloads the full JPEG at every viewport');
    assert.match(poster, /sizes="[^"]+"/);
    assert.ok(!/loading="lazy"/.test(poster), 'Above-fold desktop poster must remain eager');
    assert.ok(!about.includes('<iframe'), 'YouTube must not load until the visitor clicks play');
    console.log('Responsive poster and unchanged video facade pass.');
  }
  if (process.argv.includes('--partners')) {
    const { default: PartnersSection } = await server.ssrLoadModule('/src/components/PartnersSection.jsx');
    const partners = renderToStaticMarkup(createElement(PartnersSection));
    const decorations = [...partners.matchAll(/<img\b[^>]*src="[^"]*(?:partners-|mitra-bg)[^>]*>/g)].map((m) => m[0]);
    assert.equal(decorations.length, 3);
    for (const decoration of decorations) {
      assert.match(decoration, /loading="lazy"/, 'Below-fold partner decoration still loads eagerly');
      assert.match(decoration, /decoding="async"/);
      assert.match(decoration, /width="\d+" height="\d+"/);
    }
    assert.match(partners, /srcSet="[^"]+"/i, 'Partner background needs responsive image candidates');
    assert.match(partners, /aria-controls="mitra-logo-track"/);
    console.log('Partners: responsive background, lazy stable decorations and marquee control pass.');
  }
  if (process.argv.includes('--stela')) {
    const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
    const cases = [
      ['/src/components/StelaAISection.jsx', /stela-card\.jpg/, true],
      ['/src/components/jurusan/JurusanFaqSection.jsx', /stela-card\.jpg/, true],
      ['/src/components/pengumuman/PengumumanBantuanCard.jsx', /stela-help-panel\.png/, false],
    ];
    for (const [componentPath, originalId, lazy] of cases) {
      const { default: Component } = await server.ssrLoadModule(componentPath);
      const render = (language) => renderToStaticMarkup(createElement(MemoryRouter, null,
        createElement(LanguageContext.Provider, { value: { language, t: (text) => text } }, createElement(Component))));
      const english = render('en');
      const banner = english.match(/<img\b[^>]*src="[^"]*stela-card-en[^>]*>/)?.[0];
      assert.ok(banner, `${componentPath}: English artwork must remain an image`);
      assert.match(banner, /srcSet="[^"]+"/i, `${componentPath}: English banner still downloads the full PNG at every viewport`);
      assert.match(banner, /sizes="[^"]+"/);
      assert.match(banner, /src="[^"]*stela-card-en\.png"/, 'Original PNG must remain the fallback');
      assert.equal(/loading="lazy"/.test(banner), lazy, 'Preserve each caller\'s loading priority');
      assert.match(banner, /alt="" aria-hidden="true"/);
      assert.match(english, /href="\/stela"/);
      const indonesian = render('id');
      assert.match(indonesian, originalId, 'Indonesian artwork must remain unchanged');
      assert.doesNotMatch(indonesian, /stela-card-en/, 'ID must not download EN image candidates');
    }
    console.log('STELA: three English callers have selectable sizes, original fallback, unchanged loading/CTA and Indonesian sources.');
  }
} finally {
  await server.close();
}
