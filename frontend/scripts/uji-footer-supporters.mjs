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
  assert.equal((html.match(/class="footer-accent"/g) ?? []).length, 9, 'Sembilan motif literal sesuai layer footer Figma.');
  assert.ok(html.includes('footer-accent-side-left'));
  assert.ok(html.includes('footer-accent-side-right'));
  for (const [group, count] of [['footer-accent-side-left', 2], ['footer-accent-side-right', 2], ['footer-accent-band', 5]]) {
    const start = html.indexOf(group);
    const end = html.indexOf('</div></div></div>', start);
    const groupHtml = html.slice(start, end);
    assert.equal((groupHtml.match(/class="footer-accent"/g) ?? []).length, count, `${group} has ${count} motifs.`);
  }
  assert.ok(html.indexOf('footer-accent-band') > html.indexOf('footer-supporters'), 'Motif bawah berada setelah konten, bukan di belakang logo.');
  for (const node of ['90:508', '90:511', '90:514', '90:517', '90:520', '90:523', '90:536', '90:539', '90:542']) {
    assert.ok(html.includes(`data-figma-node="${node}"`), `Motif ${node} tetap ada.`);
  }
  assert.ok(html.indexOf('Supported by') > html.indexOf('TikTok SMK Telkom Purwokerto'));
  const png = await readFile(new URL('../src/assets/footer/competition-supporters.png', import.meta.url));
  assert.equal(png.readUInt32BE(16), 1920);
  assert.equal(png.readUInt32BE(20), 1080);
  const svg = await readFile(new URL('../src/assets/footer/figma-footer-fill.svg', import.meta.url), 'utf8');
  assert.ok(svg.includes('fill="#CECECE" fill-opacity="0.3"'), 'Fill native Figma tetap asli.');
  const mask = await readFile(new URL('../src/assets/footer/figma-footer-mask.png', import.meta.url));
  assert.ok(mask.length > 0, 'Mask native Figma tersedia.');
  console.log('Footer: 5 logo bernama aksesibel, URL terverifikasi, serta 9 motif dan fill native Figma terjaga.');
} finally {
  await server.close();
}
