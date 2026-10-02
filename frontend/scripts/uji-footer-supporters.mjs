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
  const contact = html.match(/<div class="footer-contact[\s\S]*?<\/div>/)?.[0];
  assert.ok(contact, 'Footer menyediakan satu kolom kontak.');
  assert.ok(contact.includes('https://www.google.com/maps/search/'), 'Peta berada di dalam kolom kontak.');
  assert.ok(contact.indexOf('mailto:') < contact.indexOf('https://www.google.com/maps/search/'), 'Peta berada setelah email kontak.');
  assert.equal((html.match(/class="footer-accent"/g) ?? []).length, 8, 'Delapan motif sesuai Accent Element / Group 478.');
  assert.ok(html.includes('footer-accent-side-left'));
  assert.ok(html.includes('footer-accent-side-right'));
  assert.deepEqual([...html.matchAll(/data-figma-node="([^"]+)"/g)].map((match) => match[1]),
    ['125:161', '125:167', '125:164', '125:136', '125:139', '125:142', '125:145', '125:148'],
    'The edge and bottom groups retain the Accent Element layer order.');
  assert.ok(html.includes('footer-accent-canvas'), 'The bottom composition has a separate clipping canvas.');
  assert.ok(html.indexOf('footer-accent-band') > html.indexOf('footer-supporters'), 'Motif bawah berada setelah konten, bukan di belakang logo.');
  assert.ok(html.indexOf('Supported by') > html.indexOf('TikTok SMK Telkom Purwokerto'));
  const png = await readFile(new URL('../src/assets/footer/competition-supporters.png', import.meta.url));
  assert.equal(png.readUInt32BE(16), 1920);
  assert.equal(png.readUInt32BE(20), 1080);
  const svg = await readFile(new URL('../src/assets/footer/figma-footer-fill.svg', import.meta.url), 'utf8');
  assert.ok(svg.includes('fill="#CECECE" fill-opacity="0.3"'), 'Fill native Figma tetap asli.');
  const mask = await readFile(new URL('../src/assets/footer/figma-footer-mask.png', import.meta.url));
  assert.ok(mask.length > 0, 'Mask native Figma tersedia.');
  console.log('Footer: peta di bawah kontak, 5 logo bernama aksesibel, dan 8 motif Accent Element terjaga.');
} finally {
  await server.close();
}
