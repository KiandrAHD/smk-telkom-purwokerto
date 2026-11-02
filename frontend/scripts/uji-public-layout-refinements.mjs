import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
const layout = read('layouts/MainLayout.jsx');
const landing = read('pages/LandingPage.jsx');
const facilities = read('pages/FasilitasPage.jsx');
const styles = read('styles/fasilitas.css');
const hero = read('styles/hero.css');

assert.equal((layout.match(/<WaveMarquee\s*\/>/g) || []).length, 1);
assert.equal((layout.match(/<InnovationReveal\s*\/>/g) || []).length, 1);
assert.ok(layout.indexOf('{opening}') < layout.indexOf('<WaveMarquee />'));
assert.ok(layout.indexOf('{content}') < layout.indexOf('<InnovationReveal />'));
assert.doesNotMatch(landing, /<WaveMarquee|<InnovationReveal/);
assert.match(facilities, /<MainLayout>\s*<section/);
assert.doesNotMatch(facilities, /filterWidths|rotate-180/);
assert.match(styles, /repeat\(7, minmax\(0, 1fr\)\)/);
assert.match(styles, /100% auto repeat-y/);
assert.match(styles, /scaleX\(-1\)/);
assert.match(hero, /\.hero-panel--departments \.hero-image\s*\{\s*mask-image: linear-gradient/);
console.log('Public layout refinements: shared sections, hero fade, filters and continuous mirrored chains passed.');
