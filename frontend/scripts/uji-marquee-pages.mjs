import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = path => readFile(new URL(`../src/${path}`, import.meta.url), 'utf8');
const profile = await read('pages/TentangPage.jsx');
assert.match(profile, /<MainLayout showOpeningMarquee=\{false\}>/);
let previous = -1;
for (const tag of ['<TentangHeroSection', '<RibbonDivider', '<TentangAboutSection', '<TentangStatsSection', '<WaveMarquee', '<TentangVisiMisiSection']) {
  const index = profile.indexOf(tag);
  assert.ok(index > previous, `Profile section order: ${tag}`);
  previous = index;
}
assert.equal((profile.match(/<WaveMarquee/g) || []).length, 1);
assert.equal((profile.match(/<RibbonDivider/g) || []).length, 1);
const extracurricular = await read('pages/EkstrakurikulerPage.jsx');
assert.match(extracurricular, /<MainLayout>/);
assert.doesNotMatch(extracurricular, /ribbon-divider|<RibbonDivider|<WaveMarquee/);
const news = await read('pages/BeritaPage.jsx');
assert.match(news, /<MainLayout>\s*<BeritaHeroSection/);
const layout = await read('layouts/MainLayout.jsx');
assert.match(layout, /showMarquees && showOpeningMarquee && <WaveMarquee/);
console.log('Marquee pages: profile ribbon/about/stats/wave order, one shared extracurricular wave without ribbon, and news opening wave pass.');
