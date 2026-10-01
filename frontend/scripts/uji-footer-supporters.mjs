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
  assert.deepEqual([...html.matchAll(/data-figma-node="([^"]+)"/g)].map((match) => match[1]),
    ['90:536', '90:542', '90:539', '90:508', '90:511', '90:514', '90:517', '90:520', '90:523'],
    'The edge and bottom groups retain the native Figma layer order, including the off-canvas motif.');
  assert.ok(html.includes('footer-accent-canvas'), 'The bottom composition has a separate clipping canvas.');
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
  const side = css.slice(css.indexOf('.footer-accent-side {')).split('}')[0];
  assert.ok(side.includes('overflow: visible;'), 'The decorative side canvas must not crop motifs before the existing footer body boundary.');
  for (const selector of ['.footer-accent-side', '.footer-accent-canvas']) {
    const rule = css.slice(css.indexOf(selector + ' {')).split('}')[0];
    assert.ok(rule.includes('height: 314px;'), `${selector} clips at the red bar in frame 106:90 (4343 - 4029).`);
  }
  const band = css.slice(css.indexOf('.footer-accent-band {')).split('}')[0];
  assert.ok(band.includes('height: calc(93 * 100cqw / 1847);'), 'The visible bottom band ends at the native cutoff (314 - 221).');
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
