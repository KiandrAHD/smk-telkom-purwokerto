import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: Quiz } = await server.ssrLoadModule('/src/components/jurusan/JurusanQuizSection.jsx');
  const markup = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Quiz)));
  assert.match(markup, /src="[^"]*stela-bot\.png"/, 'Ajakan memakai maskot STELA dari referensi.');
  assert.match(markup, /Rekayasa Perangkat Lunak \(RPL\)/, 'Contoh rekomendasi RPL terlihat sebelum kuis dimulai.');
  assert.match(markup, /href="\/jurusan\/rpl"/, 'Tombol contoh membuka detail RPL.');
  assert.match(markup, /Mulai Sekarang/);
  assert.equal((markup.match(/aria-pressed="false"/g) ?? []).length, 3, 'Contoh tidak dianggap sebagai pilihan pengguna.');
  console.log('Maskot STELA, contoh rekomendasi, dan tautan detail RPL terverifikasi.');
} finally {
  await server.close();
}
