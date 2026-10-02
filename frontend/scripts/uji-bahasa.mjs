import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { translate, readLanguage } = await server.ssrLoadModule('/src/utils/language.js');
  assert.equal(readLanguage(), 'id', 'Storage unavailable uses Indonesian.');
  globalThis.localStorage = { getItem: () => 'unexpected' };
  assert.equal(readLanguage(), 'id', 'Unsupported language cannot enter state.');
  globalThis.localStorage = { getItem: () => 'en' };
  assert.equal(readLanguage(), 'en');
  assert.equal(translate('Beranda', 'en'), 'Home');
  assert.equal(translate('Beranda', 'id'), 'Beranda');
  assert.equal(translate('Kembali ke {label}', 'en', { label: 'News' }), 'Back to News');
  assert.equal(translate('Nama dari dashboard', 'en'), 'Nama dari dashboard');
  assert.equal(translate('constructor', 'en'), 'constructor');
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { aboutStats, visiMisi, timelineData, kepalaSekolah } = await server.ssrLoadModule('/src/data/dummyData.js');
  const profileTexts = [...aboutStats.map((item) => item.label), ...Object.values(visiMisi), ...timelineData.flatMap((item) => [item.title, item.desc]), kepalaSekolah.quote, kepalaSekolah.quoteFull, kepalaSekolah.ctaText, 'Masuk PPDB'];
  for (const text of profileTexts) {
    if (['Digital Smart School', 'AI & Future Ready'].includes(text)) continue;
    assert.notEqual(translate(text, 'en'), text, `Profile English translation missing: ${text}`);
    assert.equal(translate(text, 'id'), text, 'Indonesian content must remain unchanged.');
  }
  const { default: FormInput } = await server.ssrLoadModule('/src/components/dashboard/FormInput.jsx');
  const { default: Navbar } = await server.ssrLoadModule('/src/components/Navbar.jsx');
  const { default: Footer } = await server.ssrLoadModule('/src/components/Footer.jsx');
  const { default: Teachers } = await server.ssrLoadModule('/src/components/tentang/TentangKepalaSekolahSection.jsx');
  const value = { language: 'en', locale: 'en-US', t: (text, vars) => translate(text, 'en', vars), setLanguage: () => {} };
  const render = (element) => renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(LanguageContext.Provider, { value }, element)));
  const form = render(createElement(FormInput, { label: 'Jenis Kelamin', as: 'select', options: ['Laki-laki', 'Perempuan'] }));
  assert.ok(form.includes('value="Laki-laki"'));
  assert.ok(form.includes('>Male</option>'), 'Visible option translates but submitted value is unchanged.');
  const nav = render(createElement(Navbar));
  assert.ok(nav.includes('Announcements'));
  assert.ok(nav.includes('href="/pengumuman"'));
  assert.ok(nav.includes('Ganti ke Bahasa Indonesia'));
  const footer = render(createElement(Footer));
  assert.equal((footer.match(/class="footer-accent"/g) ?? []).length, 8);
  assert.ok(footer.includes('Staff &amp; Admin Access'));
  const teachers = render(createElement(Teachers));
  assert.ok(teachers.includes('href="/profil-sekolah/guru"'));
  assert.match(teachers, /View All Teacher Profiles/i);
  console.log('Bahasa: default/fallback, persistence reading, interpolation, routes, form values, teacher CTA, and eight footer motifs pass.');
} finally {
  delete globalThis.localStorage;
  await server.close();
}
