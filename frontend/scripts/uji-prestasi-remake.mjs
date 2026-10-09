import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const { hallOfFame, kisahAlumni, videoHighlight } = await server.ssrLoadModule('/src/data/dummyData.js');
  const load = async (path) => (await server.ssrLoadModule(path)).default;
  const Hall = await load('/src/components/prestasi/PrestasiPerjalananSection.jsx');
  const Support = await load('/src/components/prestasi/PrestasiDukunganSection.jsx');
  const Stela = await load('/src/components/StelaAISection.jsx');
  const CTA = await load('/src/components/CTASection.jsx');
  const Footer = await load('/src/components/Footer.jsx');
  const render = (Component, props = {}, language = 'id') => renderToStaticMarkup(
    createElement(MemoryRouter, null, createElement(LanguageContext.Provider, {
      value: { language, locale: language === 'en' ? 'en-US' : 'id-ID', t: (text, variables) => translate(text, language, variables) },
    }, createElement(Component, props))));
  assert.deepEqual(hallOfFame.items.map(({ name, image }) => ({ name, image })), kisahAlumni.items.map(({ name, image }) => ({ name, image })));
  for (const length of [0, 1, 3, 4, 6]) {
    const items = Array.from({ length }, (_, index) => ({ ...hallOfFame.items[0], name: 'Alumni ' + index }));
    const html = render(Hall, { items });
    assert.equal((html.match(/<article/g) || []).length, Math.min(4, length));
    assert.equal((html.match(/<button/g) || []).length, length ? 2 : 0);
    assert.equal((html.match(/ disabled=""/g) || []).length, length && length <= 4 ? 2 : 0);
    if (!length) assert.ok(html.includes('Profil alumni belum tersedia.'));
    else assert.ok(html.includes('aria-live="polite"'));
  }
  const hall = render(Hall);
  for (const person of hallOfFame.items) {
    assert.ok(hall.includes(person.image), 'Keep the photo paired with its alumni identity.');
    assert.ok(hall.includes(person.sourceUrl), 'Keep the official profile source accessible.');
  }
  for (const language of ['id', 'en']) {
    const support = render(Support, {}, language);
    assert.ok(support.includes(videoHighlight.video.poster), 'Use the existing matching video poster.');
    assert.ok(!support.includes('<iframe'), 'Load the external player only after user activation.');
    assert.ok(support.includes(language === 'en' ? 'Video Highlights' : 'Video Highlight'));
    for (const variant of ['default', 'prestasi']) {
      assert.ok(render(Stela, { variant }, language).includes('href="/stela"'));
      assert.ok(render(CTA, { variant }, language).includes('href="/spmb"'));
      const footer = render(Footer, { variant }, language);
      assert.ok(footer.includes('competition-supporters'), 'Every page uses the shared footer with the competition supporter block.');
      assert.ok(footer.includes('google.com/maps/search/'));
      assert.ok(footer.includes('href="/kebijakan-privasi"'));
      assert.ok(footer.includes('href="/login"'));
    }
  }
  for (const name of fs.readdirSync('src/assets/prestasi-remake')) {
    assert.ok(fs.statSync('src/assets/prestasi-remake/' + name).size > 0, 'Every local Figma asset must be nonempty.');
  }
  console.log('Prestasi remake: empty/small/overflow lists, original photo identities, profile sources, lazy video, ID/EN actions, default variants and footer links pass.');
} finally {
  await server.close();
}
