import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
const failures = [];
try {
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const { default: english } = await server.ssrLoadModule('/src/data/translations.js');
  const { fasilitasData } = await server.ssrLoadModule('/src/data/fasilitasData.js');
  const { default: Landing } = await server.ssrLoadModule('/src/pages/LandingPage.jsx');
  const { default: Prestasi } = await server.ssrLoadModule('/src/pages/PrestasiPage.jsx');
  const { default: Facilities } = await server.ssrLoadModule('/src/components/FacilitiesSection.jsx');
  const render = (Component, language, missing = new Set()) => renderToStaticMarkup(
    h(MemoryRouter, null, h(LanguageContext.Provider, { value: {
      language, locale: language === 'en' ? 'en-US' : 'id-ID', setLanguage: () => {},
      t: (text, vars) => {
        if (language === 'en' && typeof text === 'string' && !Object.hasOwn(english, text)) missing.add(text);
        return translate(text, language, vars);
      },
    } }, h(Component))));

  for (const language of ['id', 'en']) {
    try {
      const footer = html => html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
      const home = footer(render(Landing, language));
      const prestasi = footer(render(Prestasi, language));
      assert.ok(home);
      assert.equal(prestasi, home, `Footer Prestasi harus identik dengan Beranda (${language}).`);
      console.log(`Footer ${language}: markup Prestasi dan Beranda identik.`);
    } catch (error) { failures.push(error.message.split('\n')[0]); }

    try {
      const missing = new Set();
      const html = render(Facilities, language, missing);
      assert.equal((html.match(/data-facility-card/g) ?? []).length, 8);
      for (const item of fasilitasData) {
        for (const field of ['name', 'category', 'preview', 'description']) {
          const text = item[field];
          if (language === 'en') {
            assert.ok(Object.hasOwn(english, text), `Translation fasilitas missing: ${text}`);
            assert.notEqual(translate(text, language), text);
          } else assert.equal(translate(text, language), text);
        }
        assert.ok(html.includes(translate(item.name, language)), `Nama kartu ${item.id} harus mengikuti locale.`);
        assert.ok(html.includes(translate(item.preview, language)), `Preview kartu ${item.id} harus mengikuti locale.`);
      }
      if (language === 'en') {
        assert.deepEqual([...missing], [], 'Seluruh key yang dirender fasilitas tersedia.');
        assert.ok(html.includes('School <span'));
        assert.ok(html.includes('Networking Laboratory'));
        assert.ok(html.includes('Robotics Lab'));
        const content = html.replace(/data-category="[^"]*"/g, '');
        assert.doesNotMatch(content, /Fasilitas|Laboratorium|Ruang Kelas|Selengkapnya|Perpustakaan|fasilitas dalam kategori/);
      } else {
        assert.ok(html.includes('Fasilitas <span'));
        assert.ok(html.includes('Laboratorium Jaringan'));
      }
      console.log(`Fasilitas ${language}: 8 kartu, preview, kategori, description, carousel dan key terverifikasi.`);
    } catch (error) { failures.push(error.message.split('\n')[0]); }
  }
  assert.deepEqual(failures, [], failures.join('\n'));
} finally { await server.close(); }
