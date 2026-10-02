import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const { stelaData, hallOfFame, kisahAlumni } = await server.ssrLoadModule('/src/data/dummyData.js');
  assert.deepEqual(hallOfFame.items.map(({ name, image }) => ({ name, image })), kisahAlumni.items.map(({ name, image }) => ({ name, image })), 'Alumni photos must match their actual identities.');
  const { default: Stela } = await server.ssrLoadModule('/src/components/StelaAISection.jsx');
  const { default: CTA } = await server.ssrLoadModule('/src/components/CTASection.jsx');
  const { default: Department } = await server.ssrLoadModule('/src/components/DepartmentCard.jsx');
  for (const language of ['id', 'en']) {
    const t = (text, variables) => translate(text, language, variables);
    const value = { language, locale: language === 'en' ? 'en-US' : 'id-ID', t, setLanguage: () => {} };
    const render = (element) => renderToStaticMarkup(createElement(MemoryRouter, null,
      createElement(LanguageContext.Provider, { value }, element)));
    const markup = render(createElement(Stela));
    assert.match(markup, language === 'en' ? /stela-card-en/ : /stela-card\.jpg/, `${language}: shared red artwork must match its locale.`);
    assert.doesNotMatch(markup, /<iframe/, 'Banner must not load a player.');
    assert.match(markup, /block h-auto w-full/, 'Complete artwork must retain its aspect ratio.');
    assert.ok(markup.includes(renderToStaticMarkup(createElement('span', null, t(stelaData.description))).replace(/^<span>|<\/span>$/g, '')));
    assert.match(markup, /<h2\b/);
    assert.match(markup, /href="\/stela"/);
    if (language === 'en') {
      for (const text of [stelaData.title, stelaData.description, stelaData.ctaText, ...stelaData.chats.map((chat) => chat.text)]) {
        assert.notEqual(t(text), text, 'English preview must not fall back to Indonesian.');
      }
    }
    for (const chat of stelaData.chats) {
      const escaped = renderToStaticMarkup(createElement('span', null, t(chat.text))).replace(/^<span>|<\/span>$/g, '');
      assert.ok(markup.includes(escaped), `${language}: complete example message must be readable.`);
    }
    const cta = render(createElement(CTA));
    assert.match(cta, /href="\/ppdb"/);
    const department = render(createElement(Department, { icon: 'code', name: 'Rekayasa Perangkat Lunak', desc: 'Program keahlian', image: '/test.webp', slug: 'rpl' }));
    assert.match(department, /href="\/jurusan\/rpl"/);
  }
  console.log('Desain publik: shared localized STELA artwork, accessible messages, matched alumni identities, and department/PPDB routes pass.');
} finally {
  await server.close();
}
