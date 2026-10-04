import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// Only create derivatives of these explicitly listed assets. Never overwrite
// originals, crop the artwork, or enlarge an input.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const jobs = {
  hero: { input: 'src/assets/drive/header-jurusan.webp', widths: [640, 960, 1440] },
  poster: { input: 'src/assets/tentang/profil-hero.jpg', widths: [640, 960, 1440] },
  partners: { input: 'src/assets/landing/partners-bg.png', widths: [960, 1440, 1847], lossless: true },
  stela: { input: 'src/assets/landing/stela-card-en.png', widths: [720, 960, 1440, 1920, 2172], lossless: true, outputName: 'stela-card-en' },
};
const requested = process.argv.slice(2);
assert.ok(requested.length, 'Choose an asset: node scripts/buat-gambar-responsif.mjs hero');
assert.ok(requested.every((name) => Object.hasOwn(jobs, name)), 'Unknown asset; no files were changed');
await mkdir(resolve(root, 'src/assets/responsive'), { recursive: true });
for (const name of requested) {
  const job = jobs[name];
  const input = resolve(root, job.input);
  const original = await readFile(input);
  const hash = createHash('sha256').update(original).digest('hex');
  for (const width of job.widths) {
    const output = resolve(root, `src/assets/responsive/${job.outputName ?? name}-${width}.webp`);
    await sharp(original).resize({ width, withoutEnlargement: true }).webp({ quality: 90, effort: 6, lossless: job.lossless ?? false }).toFile(output);
    const meta = await sharp(output).metadata();
    console.log(`${name}: ${meta.width}x${meta.height}, ${(await stat(output)).size} bytes`);
  }
  assert.equal(createHash('sha256').update(await readFile(input)).digest('hex'), hash, 'Original image changed');
}
