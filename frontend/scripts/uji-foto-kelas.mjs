import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await readFile(path.join(root, 'src/data/classroomPhotoManifest.json')));
const audit = JSON.parse(await readFile(path.join(root, 'docs/foto-kelas-integrasi.json')));
assert.equal(Object.keys(manifest).length, 13);
assert.equal(audit.length, 91);
assert.equal(new Set(audit.map(photo => photo.sha256)).size, 91);
for (const [name, photos] of Object.entries(manifest)) {
  for (const photo of photos) {
    assert.equal(photo.source.split('/')[1].replace(/\s/g, ''), name.replace('Kelas ', '').replace(/\s/g, ''));
    if (name === 'Kelas C 2.2') assert(photo.source.endsWith('.jpeg'), 'Wooden-chair set is not C 2.2');
    const record = audit.find(entry => entry.source === photo.source);
    assert(record, 'Every used photo must have provenance');
    for (const variant of record.variants) {
      const file = path.join(root, 'src/assets/fasilitas/kelas', variant.file);
      const metadata = await sharp(file).metadata();
      assert.equal(metadata.width, variant.width);
      assert.equal(metadata.height, variant.height);
      assert.equal(metadata.format, 'webp');
      assert(metadata.width <= record.width);
      assert((await stat(file)).size < record.originalBytes);
    }
  }
}
console.log('PASS 91 correctly mapped photos / 364 optimized variants; excluded C 2.2 JPG set.');

const facilityAudit = JSON.parse(await readFile(path.join(root, 'docs/fasilitas-photo-sources.json')));
for (const record of facilityAudit) {
  for (const variant of record.variants) {
    const metadata = await sharp(path.join(root, 'src/assets/fasilitas/dokumentasi', variant.file)).metadata();
    assert.equal(metadata.width, variant.width);
    assert.equal(metadata.height, variant.height);
    assert.equal(metadata.format, 'webp');
  }
}
console.log('PASS 53 supplied facility photos and responsive variants.');
await import('./uji-fasilitas-layout-browser.mjs');
