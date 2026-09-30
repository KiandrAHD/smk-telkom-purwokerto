import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
const source = JSON.parse(await read('../../docs/figma-accent-orientation.json'));
const section = await read('../src/components/SectionAccents.jsx');

for (const { id, matrix } of source.sections) {
  const line = section.split('\n').find((value) => value.includes("['" + id + "',"));
  const rendered = line?.match(/\[transform:matrix\(([^)]+)\)\]/);
  assert.ok(rendered, id + ' belum memakai matriks asli Figma.');
  assert.deepEqual(rendered[1].split(',').map(Number), [...matrix, 0, 0], id + ' arah berbeda dari Figma.');
}

const footer = await read('../src/components/Footer.jsx');
assert.ok(!footer.includes('-scale-x-100'), 'Footer tidak boleh mencerminkan bentuk asli.');
const css = await read('../src/index.css');
for (const [selector, native] of [
  ['.footer-accent', source.footer.upright],
  ['.footer-accent-turned', source.footer.turned],
]) {
  const rule = css.slice(css.indexOf(selector + ' {')).split('}')[0];
  const rendered = rule.match(/transform: matrix\(([^)]+)\)/);
  assert.ok(rendered, selector + ' belum memakai matriks asli.');
  assert.deepEqual(rendered[1].split(',').map(Number), [...native.matrix, 0, 0]);
}

for (const path of ['../src/pages/GuruPage.jsx', '../src/components/GuruPreviewSection.jsx']) {
  const page = await read(path);
  assert.ok(page.includes('guru-accent-horizontal-top'), path + ' belum memakai bingkai atas Figma.');
}
const preview = await read('../src/components/GuruPreviewSection.jsx');
const watermark = preview.split('\n').find((line) => line.includes('data-figma-node="24:759"'));
const watermarkMatrix = watermark?.match(/\[transform:matrix\(([^)]+)\)\]/);
assert.ok(watermarkMatrix, 'Watermark Beranda belum mengacu ke 24:759.');
assert.deepEqual(watermarkMatrix[1].split(',').map(Number), [...source.teacherPreviewWatermark.matrix, 0, 0]);
const top = await sharp(fileURLToPath(new URL('../src/assets/tentang/figma-guru-horizontal-top.png', import.meta.url))).metadata();
assert.equal(top.width, source.teacherTop.width);
assert.equal(top.height, source.teacherTop.height);
console.log('Lulus: 38 matriks section, orientasi footer, bingkai atas, dan watermark Beranda sesuai sumber Figma.');
