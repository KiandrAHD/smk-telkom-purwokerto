import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [page, intro, accents, result, css, layout] = await Promise.all([
  'src/pages/NextTelPage.jsx', 'src/components/nexttel/NextTelIntro.jsx',
  'src/components/nexttel/NextTelAccents.jsx', 'src/components/nexttel/NextTelResult.jsx',
  'src/styles/nexttel.css', 'src/layouts/MainLayout.jsx',
].map(read));
assert.match(page, /import '\.\.\/styles\/nexttel\.css'/);
assert.match(page, /showSupportSections=\{false\} showMarquees=\{false\}/);
assert.match(layout, /showMarquees = true/);
assert.match(layout, /showMarquees && <WaveMarquee/);
assert.match(layout, /showMarquees && <InnovationReveal/);
assert.match(css, /width: 100%; min-height: 480px/); // Prevent aspect-ratio from expanding tablet cards.
assert.match(css, /@media \(max-width: 767px\)/);
assert.match(css, /prefers-reduced-motion: reduce/);
assert.match(css, /font-display: swap/);
assert.match(intro, /onClick=\{onStart\}/);
assert.match(result, /onClick=\{onRetry\}/);
assert.match(result, /onClick=\{onRestart\}/);
const assets = new Set([
  ...[...accents.matchAll(/asset: '([^']+)'/g)].map((match) => match[1]),
  ...[...`${intro}\n${result}\n${css}`.matchAll(/\/assets\/nexttel\/([\w.-]+)/g)].map((match) => match[1]),
]);
assert.equal(assets.size, 18);
for (const asset of assets) {
  const path = new URL(`../public/assets/nexttel/${asset}`, import.meta.url);
  assert.ok((await stat(path)).size > 0, `Missing asset: ${fileURLToPath(path)}`);
  if (asset.endsWith('.svg')) assert.match(await readFile(path, 'utf8'), /<svg[^>]+viewBox=/);
}
assert.doesNotMatch(`${intro}\n${accents}\n${result}\n${css}`, /https:\/\/www\.figma\.com\/api/);
console.log(`NextTel layout: ${assets.size} local Figma assets, isolated layout, responsive sizing, motion and action contracts passed.`);
