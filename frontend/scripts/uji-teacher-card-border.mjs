import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';
import { createServer } from 'vite';

// Rasterize the original SVGs to catch opaque export backgrounds, not just DOM geometry.
for (const corner of ['top-left', 'top-right', 'bottom-left', 'bottom-right']) {
  const svg = await readFile(new URL(`../src/assets/tentang/teacher-border/${corner}.svg`, import.meta.url));
  assert.equal((svg.toString().match(/<rect /g) || []).length, 14);
  for (const color of ['#AB0A1B', '#CD091D', '#878787', '#BBBBBB']) assert.ok(svg.includes(color));
  const { data, info } = await sharp(svg).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let transparent = 0;
  for (let y = 22; y < info.height - 22; y++) for (let x = 22; x < info.width - 22; x++) {
    assert.equal(data[(y * info.width + x) * 4 + 3], 0, `${corner}: interior must not cover photo or label`);
    transparent++;
  }
  assert.ok(transparent > 4000);
}
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: TeacherCard } = await server.ssrLoadModule('/src/components/TeacherCard.jsx');
  const { profilGuruData } = await server.ssrLoadModule('/src/data/profilGuruData.js');
  for (const teacher of profilGuruData) {
    const html = renderToStaticMarkup(h(TeacherCard, { teacher }));
    assert.equal((html.match(/class="teacher-card-corner /g) || []).length, 4);
    assert.ok(html.includes('data-teacher-border="309:1687"'));
    assert.ok(html.includes(teacher.nama.replaceAll('&', '&amp;')));
    assert.ok(html.includes('aria-hidden="true"'));
  }
  for (const path of ['pages/GuruPage.jsx', 'components/tentang/TentangKepalaSekolahSection.jsx']) {
    const source = await readFile(new URL(`../src/${path}`, import.meta.url), 'utf8');
    assert.match(source, /<TeacherCard /);
    assert.doesNotMatch(source, /guru-accent-|<TeacherPhoto /);
  }
  const css = await readFile(new URL('../src/index.css', import.meta.url), 'utf8');
  assert.doesNotMatch(css, /guru-accent-|guru-border-(horizontal|vertical|top)/);
  console.log(`PASS teacher borders: ${profilGuruData.length} profiles, shared grid/carousel card, four original transparent SVG corners, no legacy border rules.`);
} finally { await server.close(); }
