import assert from 'node:assert/strict';
import { drawImageCrop, createCroppedFile } from '../src/utils/imageCrop.js';

let drawn;
const canvas = { getContext: () => ({ drawImage: (...args) => { drawn = args; } }) };
const image = { naturalWidth: 4000, naturalHeight: 2000 };
const crop = { unit: '%', x: 10, y: 20, width: 50, height: 60 };
drawImageCrop(image, crop, canvas);
assert.deepEqual(drawn.slice(1), [400, 400, 2000, 1200, 0, 0, 1600, 960]);
drawImageCrop({ naturalWidth: 100, naturalHeight: 100 }, crop, canvas);
assert.equal(canvas.width, 50, 'Gambar kecil tidak diperbesar');
assert.equal(canvas.height, 60);
for (const invalid of [{ ...crop, width: 0 }, { ...crop, x: 90 }, { ...crop, y: NaN }, { ...crop, unit: 'px' }]) {
  assert.throws(() => drawImageCrop(image, invalid, canvas), /valid/);
}
globalThis.document = { createElement: () => canvas };
canvas.toBlob = (callback) => callback(new Blob(['test'], { type: 'image/webp' }));
const result = await createCroppedFile(image, crop, 'gambar.jpg');
assert.equal(result.name, 'gambar-crop.webp');
assert.equal(result.type, 'image/webp');
canvas.toBlob = (callback) => callback(null);
await assert.rejects(createCroppedFile(image, crop, 'gambar.jpg'), /gagal/);
delete globalThis.document;
console.log('Crop: koordinat, batas seleksi, ukuran, berkas, dan kegagalan encoder lolos.');
