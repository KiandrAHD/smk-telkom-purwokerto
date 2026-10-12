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
  const { fasilitasViews } = await server.ssrLoadModule('/src/data/fasilitasPageData.js');
  const { fasilitasData } = await server.ssrLoadModule('/src/data/fasilitasData.js');
  const { default: Landing } = await server.ssrLoadModule('/src/pages/LandingPage.jsx');
  const { default: Prestasi } = await server.ssrLoadModule('/src/pages/PrestasiPage.jsx');
  const { default: Facilities } = await server.ssrLoadModule('/src/components/FacilitiesSection.jsx');
  const { default: FacilitiesPage } = await server.ssrLoadModule('/src/pages/FasilitasPage.jsx');
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
    } catch (error) { failures.push(error.message); }

    try {
      const missing = new Set();
      const carousel = render(Facilities, language, missing);
      assert.equal((carousel.match(/data-facility-card/g) ?? []).length, 0);
      assert.ok(carousel.includes('href="/fasilitas"'));
      const html = render(FacilitiesPage, language, missing);
      assert.equal((html.match(/data-facility-card/g) ?? []).length, 16);
      for (const item of fasilitasData) {
        for (const field of ['name', 'category', 'preview', 'description']) {
          const text = item[field];
          if (language === 'en') {
            assert.ok(Object.hasOwn(english, text), `Translation fasilitas missing: ${text}`);
            assert.notEqual(translate(text, language), text);
          } else assert.equal(translate(text, language), text);
        }

      }
      for (const groups of Object.values(fasilitasViews)) for (const group of groups) {
        for (const text of [group.title, ...group.items.flatMap(item => [item.name, item.preview])].filter(Boolean)) {
          if (language === 'en') assert.ok(Object.hasOwn(english, text), `Translation missing: ${text}`);
        }
      }
      if (language === 'en') {
        const sharedNames = new Set(['BKK', 'Jagoan Hosting', 'Garuda Spark Innovation Hub', 'NGALUP.CO', 'Jagoan Hosting Innovation Competition 2026', 'Menu', 'SPMB', 'STELA AI', 'NextTel']);
        assert.deepEqual([...missing].filter(text => !sharedNames.has(text)), [], 'Seluruh key yang dirender fasilitas tersedia.');
        assert.ok(html.includes('School</span> Facilities'));
        assert.ok(carousel.includes(translate('Laboratorium Jaringan', language)));

        const content = html.replace(/aria-label="[^"]*"/g, '').replace(/<header[\s\S]*?<\/header>|<footer[\s\S]*?<\/footer>/g, '');
        assert.doesNotMatch(content, /Fasilitas|Laboratorium|Ruang Kelas|Selengkapnya|Perpustakaan|fasilitas dalam kategori/);
      } else {
        assert.ok(html.includes('Fasilitas</span> Sekolah'));
        assert.ok(carousel.includes('Laboratorium Jaringan'));
      }
      console.log(`Fasilitas ${language}: 16 kartu overview, preview, kategori, description, carousel dan key terverifikasi.`);
    } catch (error) { failures.push(error.message); }
  }
  assert.deepEqual(failures, [], failures.join('\n'));
} finally { await server.close(); }
