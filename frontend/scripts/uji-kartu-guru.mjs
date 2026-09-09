import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/components/tentang/TentangKepalaSekolahSection.jsx', import.meta.url), 'utf8');
const teacherImage = source.match(/src=\{guru\.image\}[\s\S]*?\/>/)?.[0] ?? '';

assert.match(teacherImage, /object-cover/);
assert.match(teacherImage, /object-top/);
assert.doesNotMatch(teacherImage, /object-contain/);
console.log('Kartu guru memakai crop foto seragam.');
