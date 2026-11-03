import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../src/', import.meta.url);
const oldBrandAssets = /(?:quick-robot|quick-spark|quick-dot|quick-access-bot|quick-access-sparkles|stela-bot|stela-mascot)\.(?:svg|png|webp)/;
async function audit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = new URL(entry.name + (entry.isDirectory() ? '/' : ''), directory);
    if (entry.isDirectory()) await audit(path);
    else if (/\.(jsx?|tsx?|css)$/.test(entry.name)) {
      assert.doesNotMatch(await readFile(path, 'utf8'), oldBrandAssets, `Legacy brand asset referenced in ${path.pathname}`);
    }
  }
}
await audit(root);
for (const path of ['pages/FasilitasPage.jsx', 'components/HeroQuickAccess.jsx']) {
  const source = await readFile(new URL(path, root), 'utf8');
  for (const brand of ['nexa', 'nexttel']) assert.ok(source.includes(`/assets/branding/${brand}-mark.png`), `${path} must use the current ${brand} mark`);
}
for (const brand of ['nexa', 'nexttel']) assert.ok((await readFile(new URL(`../public/assets/branding/${brand}-mark.png`, import.meta.url))).length > 0);
console.log('PASS brand icons: facilities/shared quick access use current NEXA/NexTel marks; no legacy icon references in frontend source.');
