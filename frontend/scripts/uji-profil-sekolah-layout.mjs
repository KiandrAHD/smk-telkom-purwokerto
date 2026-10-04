import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const source = await readFile(new URL('../src/components/tentang/TentangKepalaSekolahSection.jsx', import.meta.url), 'utf8');
assert.match(source, /grid-cols-1 items-stretch/, 'Kedua kontainer mengikuti tinggi baris grid.');
assert.doesNotMatch(source, /self-start|setExpanded|kepalaSekolah\.ctaText/, 'Kartu kepala sekolah tidak lagi memiliki tombol sambutan atau alignment terpisah.');
assert.match(source, /flex flex-wrap items-start justify-between/, 'Header guru dapat turun baris pada layar kecil.');

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
    assert.equal((html.match(/href="\/profil-sekolah\/guru"/g) ?? []).length, 1, 'Tautan semua profil guru hanya muncul sekali.');
    const heading = html.indexOf(translate('Guru & Tenaga Pendidik', language).replace('&', '&amp;'));
    const link = html.indexOf('href="/profil-sekolah/guru"');
    const description = html.indexOf(translate('Mata pelajaran mengikuti informasi terbaru; jabatan organisasi mengacu pada SK Pengawakan 2026/2027.', language));
    assert.ok(heading < link && link < description, 'Tombol berada dalam header kontainer guru, sebelum deskripsi dan carousel.');
    assert.ok(html.includes(translate('Lihat semua profil guru', language)));
    assert.ok(html.includes(translate('Guru berikutnya', language)), 'Navigasi carousel tetap tersedia.');
  }
  console.log('Profil sekolah: kartu sejajar, tombol sambutan dihapus, dan tautan guru berada di header dalam kedua bahasa.');
} finally {
  await server.close();
}
