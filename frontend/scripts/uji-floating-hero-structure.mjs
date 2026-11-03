import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { parse } from '@babel/parser';

// Check JSX ancestry rather than text order: floating cards must belong to the
// hero, outside the carousel so slide clipping cannot hide them.
const files = [
  'components/tentang/TentangHeroSection.jsx',
  'components/jurusan/JurusanHeroSection.jsx',
  'components/prestasi/PrestasiHeroSection.jsx',
  'components/bkk/BkkHeroSection.jsx',
  'components/pengumuman/PengumumanHeroSection.jsx',
  'components/berita/BeritaHeroSection.jsx',
  'components/HeroSection.jsx',
  'pages/FasilitasPage.jsx',
];
let count = 0;
for (const file of files) {
  const text = await readFile(new URL(`../src/${file}`, import.meta.url), 'utf8');
  const ast = parse(text, { sourceType: 'module', plugins: ['jsx'] });
  let found = 0;
  const visit = (node, ancestors = []) => {
    const opening = node.type === 'JSXElement' ? node.openingElement : null;
    if (opening) {
      const tag = opening.name.name;
      const classes = opening.attributes.find(p => p.name?.name === 'className')?.value?.value || '';
      if (['HeroStatsBar', 'HeroQuickAccess', 'TentangStatsSection'].includes(tag) || /\bhero-floating\b/.test(classes)) {
        assert(ancestors.some(a => a.tag === 'section' && /\bschool-hero\b/.test(a.classes)), `${file}: floating card must be inside hero section`);
        assert(!ancestors.some(a => a.tag === 'PageHeroCarousel'), `${file}: floating card must not be clipped by carousel`);
        found++;
      }
      ancestors = [...ancestors, { tag, classes }];
    }
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        for (const child of value) if (child?.type) visit(child, ancestors);
      } else if (value?.type) visit(value, ancestors);
    }
  };
  visit(ast);
  assert.equal(found, 1, `${file}: exactly one floating card group`);
  count += found;
}
const page = await readFile(new URL('../src/pages/TentangPage.jsx', import.meta.url), 'utf8');
assert.doesNotMatch(page, /TentangStatsSection/, 'Profile stats must not render below the About section.');
const styles = await readFile(new URL('../src/styles/hero.css', import.meta.url), 'utf8');
assert.doesNotMatch(styles, /hero-stats-section|school-hero--profile\s*\{\s*padding-bottom:\s*0/, 'Remove obsolete standalone stats spacing.');
console.log(`Floating hero: ${count} page placements pass; profile stats remain attached to hero.`);
