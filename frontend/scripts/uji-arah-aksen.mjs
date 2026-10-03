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
  [".footer-accent[data-figma-node='90:508']", source.footer.upright],
  [".footer-accent[data-figma-node='90:514']", source.footer.turned],
]) {
  const rule = css.slice(css.indexOf(selector + ' {')).split('}')[0];
  const rendered = rule.match(/transform: matrix\(([^)]+)\)/);
  assert.ok(rendered, selector + ' belum memakai matriks asli.');
  assert.deepEqual(rendered[1].split(',').map(Number).slice(0, 4), native.matrix);
}

for (const path of ['../src/pages/GuruPage.jsx']) {
  const page = await read(path);
  assert.ok(page.includes('guru-accent-horizontal-top'), path + ' belum memakai bingkai atas Figma.');
}
const top = await sharp(fileURLToPath(new URL('../src/assets/tentang/guru-border-top.png', import.meta.url))).metadata();
assert.equal(top.width, source.teacherTop.width);
assert.equal(top.height, source.teacherTop.height);
console.log('Lulus: 38 matriks section, orientasi footer, dan bingkai guru sesuai sumber Figma.');
