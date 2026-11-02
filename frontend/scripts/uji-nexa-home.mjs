import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const { formatStelaPublicText } = await server.ssrLoadModule('/src/services/stela.js');
  assert.equal(formatStelaPublicText('STELA (Stematel Learning Assistant) siap.'), 'NEXA siap.');
  assert.equal(formatStelaPublicText('https://example.test/stela /api/stela stela_history'), 'https://example.test/stela /api/stela stela_history');
  const render = async (module, language, props = {}) => {
    const { default: Component } = await server.ssrLoadModule(`/src/${module}.jsx`);
    return renderToStaticMarkup(h(LanguageContext.Provider, { value: { language, t: text => translate(text, language) } }, h(MemoryRouter, null, h(Component, props))));
  };
  for (const language of ['id', 'en']) {
    const banner = await render('components/StelaAISection', language);
    assert.match(banner, /href="\/nexa"/);
    assert.doesNotMatch(banner, /\bSTELA\b/);
    assert.equal(banner.includes('nexa-banner.png'), language === 'id', 'English must not display baked Indonesian text');
    const faq = await render('components/jurusan/JurusanFaqSection', language, { variant: 'home' });
    assert.match(faq, /aria-expanded="true"/);
    assert.match(faq, /href="\/jurusan\/faq"/);
    assert.match(faq, /href="\/nexa"/);
    const stats = await render('components/HomeStatistics', language);
    for (const number of ['1030+', '57+', '59+', '45+']) assert.ok(stats.includes(number));
    const cta = await render('components/CTASection', language, { href: '/custom-admissions' });
    assert.match(cta, /href="\/custom-admissions"/);
    assert.match(cta, /spmb-target.svg/);
  }
  const home = await readFile(new URL('../src/pages/LandingPage.jsx', import.meta.url), 'utf8');
  const order = ['<HeroSection', '<RibbonDivider', '<AboutSection', '<HomeStatistics', '<WaveMarquee', '<DepartmentsSection', '<FacilitiesSection', '<PartnersSection', '<AchievementsSection', '<HallOfFameSection', '<JurusanFaqSection'];
  let previous = -1;
  for (const component of order) { const index = home.indexOf(component); assert.ok(index > previous, `Homepage order: ${component}`); previous = index; }
  for (const asset of ['about-background.png', 'nexa-banner.png', 'nexa-mark.png', 'nexttel-mark.png', 'spmb-target.svg']) assert.ok((await stat(new URL(`../public/assets/branding/${asset}`, import.meta.url))).size > 0);
  console.log('Nexa/home: ID/EN banner, safe branding normalization, FAQ defaults, statistics, CTA override, section order and local assets pass.');
} finally { await server.close(); }
