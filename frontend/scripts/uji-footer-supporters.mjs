import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: Footer } = await server.ssrLoadModule('/src/components/Footer.jsx');
  const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Footer)));
  const supporters = html.match(/<ul class="footer-supporters[\s\S]*?<\/ul>/)?.[0];
  assert.ok(supporters, 'Footer menyediakan daftar pendukung yang terpisah dari tautan sosial.');
  assert.equal((supporters.match(/<li\b/g) ?? []).length, 5, 'Kelima logo ditampilkan tepat satu kali.');
  for (const name of ['Jagoan Hosting', 'Kementerian Komunikasi dan Digital Republik Indonesia', 'Garuda Spark Innovation Hub', 'NGALUP.CO', 'Jagoan Hosting Innovation Competition 2026']) {
    assert.ok(supporters.includes(`alt="${name}"`), `Logo ${name} memiliki nama aksesibel.`);
  }
  assert.equal((supporters.match(/<a\b/g) ?? []).length, 1, 'Hanya URL pendukung yang terverifikasi ditautkan.');
  assert.ok(supporters.includes('href="https://www.jagoanhosting.com/"'));
  assert.equal((html.match(/class="footer-accent(?: footer-accent-turned)?"/g) ?? []).length, 10, 'Jumlah aksen simetris tetap 2 + 2 + 3 + 3.');
  assert.ok(html.indexOf('Supported by') > html.indexOf('TikTok SMK Telkom Purwokerto'));
  const png = await readFile(new URL('../src/assets/footer/competition-supporters.png', import.meta.url));
  assert.equal(png.readUInt32BE(16), 1920);
  assert.equal(png.readUInt32BE(20), 1080);
  console.log('Footer: 5 logo bernama aksesibel, URL terverifikasi, dan 10 aksen simetris terjaga.');
} finally {
  await server.close();
}
