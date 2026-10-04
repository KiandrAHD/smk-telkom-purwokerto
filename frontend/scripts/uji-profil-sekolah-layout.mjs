import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const source = await readFile(new URL('../src/components/tentang/TentangKepalaSekolahSection.jsx', import.meta.url), 'utf8');
assert.match(source, /aspect-\[3\/4\] w-full/, 'Foto menjaga rasio saat lebar kontainer berubah.');
assert.doesNotMatch(source, /aspect-\[257\/321\]/, 'Foto tidak lagi memakai rasio sangat tinggi yang hanya cocok untuk ukuran besar.');
assert.match(source, /mt-4 flex min-w-0 justify-center/, 'Tautan guru berada di footer dengan spacing dan lebar yang dibatasi.');

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: Section } = await server.ssrLoadModule('/src/components/tentang/TentangKepalaSekolahSection.jsx');
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const { kepalaSekolah } = await server.ssrLoadModule('/src/data/dummyData.js');

  for (const language of ['id', 'en']) {
    const value = { language, t: (text, vars) => translate(text, language, vars) };
    const html = renderToStaticMarkup(createElement(MemoryRouter, null,
      createElement(LanguageContext.Provider, { value }, createElement(Section))));
    assert.doesNotMatch(html, /Sambutan Lengkap|Read Full Welcome Address|Tutup Ringkasan/);
    assert.ok(html.includes(translate(kepalaSekolah.quoteFull, language)), 'Sambutan lengkap tetap dapat dibaca tanpa tombol.');
    assert.ok(html.includes('<blockquote'), 'Sambutan memiliki markup kutipan yang semantik.');
    assert.equal((html.match(/href="\/profil-sekolah\/guru"/g) ?? []).length, 1, 'Tautan semua profil guru hanya muncul sekali.');
    const heading = html.indexOf(translate('Guru & Tenaga Pendidik', language).replace('&', '&amp;'));
    const link = html.indexOf('href="/profil-sekolah/guru"');
    const description = html.indexOf(translate('Mata pelajaran mengikuti informasi terbaru; jabatan organisasi mengacu pada SK Pengawakan 2026/2027.', language));
    const lastCarouselControl = html.lastIndexOf('aria-label="' + translate('Guru berikutnya', language) + '"');
    assert.ok(heading < description && description < lastCarouselControl && lastCarouselControl < link, 'Tombol berada setelah carousel dan indikator pill, bukan di header.');
    const profile = html.match(/<figure\b[^>]*>([\s\S]*?)<\/figure>/)?.[1];
    assert.ok(profile, 'Foto dan identitas kepala sekolah memiliki satu blok profil.');
    assert.ok(profile.includes('<img') && profile.includes('<figcaption'), 'Foto dan caption berada di blok yang sama.');
    assert.ok(profile.includes(translate(kepalaSekolah.name, language)));
    assert.ok(profile.includes(translate(kepalaSekolah.title, language)));
    assert.ok(html.includes(translate('Lihat semua profil guru', language)));
    assert.ok(html.includes(translate('Guru berikutnya', language)), 'Navigasi carousel tetap tersedia.');
  }
  console.log('Profil sekolah: foto, identitas, dan sambutan lengkap dipertahankan; tautan serta navigasi guru tersedia dalam kedua bahasa. Geometri diperiksa di browser.');
} finally {
  await server.close();
}
