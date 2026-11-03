import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

// Structural regression checks; real timing, seams and media playback need a browser.
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const { default: Partners } = await server.ssrLoadModule('/src/components/PartnersSection.jsx');
  const { default: Faq } = await server.ssrLoadModule('/src/components/jurusan/JurusanFaqSection.jsx');
  const render = (Component, props, language) => renderToStaticMarkup(h(MemoryRouter, null,
    h(LanguageContext.Provider, { value: { language, t: text => translate(text, language) } }, h(Component, props))));
  for (const language of ['id', 'en']) {
    for (const variant of ['home', 'default']) {
      const partners = render(Partners, { variant }, language);
      assert.match(partners, /partners-marquee flex w-max shrink-0/);
      assert.equal((partners.match(/aria-hidden="true" class="flex shrink-0/g) || []).length, 3, 'Three decorative copies follow the accessible original.');
      assert.equal((partners.match(/alt="Microsoft"/g) || []).length, 1);
      assert.match(partners, /aria-controls="mitra-logo-track" aria-pressed="false"/);
      assert.match(partners, /class="sr-only focus:not-sr-only/);
      assert.doesNotMatch(partners, /<svg/, 'The partner pause control must not render a visible icon.');
      const faq = render(Faq, { variant }, language);
      assert.doesNotMatch(faq, / hidden="/);
      assert.match(faq, /aria-hidden="true" inert="" data-open="false" class="faq-panel"/);
      assert.match(faq, /faq-toggle-vertical/);
      assert.doesNotMatch(faq, /aria-expanded="true"/, 'Every FAQ answer starts closed in both variants.');
      assert.ok((faq.match(/aria-expanded="false"/g) || []).length > 0);
    }
    assert.doesNotMatch(render(Partners, { animated: false }, language), /partners-marquee/);
  }
  const source = async path => readFile(new URL(`../src/${path}`, import.meta.url), 'utf8');
  const jurusan = await source('pages/JurusanPage.jsx');
  assert.match(jurusan, /showOpeningMarquee=\{false\}/);
  assert.equal((jurusan.match(/<RibbonDivider/g) || []).length, 1);
  assert.equal((jurusan.match(/<WaveMarquee/g) || []).length, 1);
  assert(jurusan.indexOf('<RibbonDivider') < jurusan.indexOf('<JurusanListSection'));
  assert(jurusan.indexOf('<JurusanListSection') < jurusan.indexOf('<WaveMarquee'));
  const facilities = await source('pages/FasilitasPage.jsx');
  assert.match(facilities, /className="facility-content mx-auto max-w-\[1644px\]"/);
  const facilityStyles = await source('styles/fasilitas.css');
  assert.match(facilityStyles, /\.facility-content\s*\{\s*padding-inline: calc\(clamp\(6px, 2\.11vw, 39px\) \+ clamp\(16px, 1\.5vw, 28px\)\);/);
  const video = await source('components/VideoEmbed.jsx');
  assert.match(video, /controls=1&fs=1&playsinline=1&iv_load_policy=3&hl=/);
  assert.match(video, /allowFullScreen/);
  assert.doesNotMatch(video, /[?&](?:modestbranding|showinfo|autohide)=/);
  const hero = await source('components/HeroCarousel.css');
  assert.match(hero, /mask-composite: intersect/);
  assert.match(hero, /var\(--hero-artwork-mask/);
  console.log('UI motion: ID/EN partner loops with focus-only pause control, closed FAQ defaults, facility chain gutters, Jurusan-only marquee order, supported video parameters and preserved Hero masks pass.');
} finally { await server.close(); }
