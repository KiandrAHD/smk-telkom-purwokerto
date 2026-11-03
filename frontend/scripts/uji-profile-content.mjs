import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { aboutDescription, visiMisi, nilaiStematel, timelineData } = await server.ssrLoadModule('/src/data/dummyData.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  for (const text of [aboutDescription.title, aboutDescription.text, aboutDescription.ctaText, visiMisi.visi, visiMisi.misi, ...nilaiStematel.map(v => v.desc), ...timelineData.flatMap(v => [v.title, v.desc])]) {
    if (['Digital Smart School', 'AI & Future Ready'].includes(text)) continue;
    assert.notEqual(translate(text, 'en'), text, `Missing English translation: ${text}`);
  }
  assert.deepEqual(nilaiStematel.map(v => v.title), ['Innovation', 'Character', 'Technology', 'Collaboration']);
  assert.deepEqual(timelineData.map(v => v.year), ['2012', '2016', '2020', '2023', '2026']);
  const page = await readFile(new URL('../src/pages/TentangPage.jsx', import.meta.url), 'utf8');
  const order = ['TentangHeroSection', 'RibbonDivider', 'TentangAboutSection', 'TentangVisiMisiSection', 'TentangTimelineSection', 'WaveMarquee', 'TentangKepalaSekolahSection', 'FacilitiesSection'];
  const positions = order.map(name => page.indexOf(`<${name}`));
  assert(positions.every((value, index) => value >= 0 && (!index || value > positions[index - 1])), 'Figma section order.');
  assert.equal((page.match(/<FacilitiesSection/g) || []).length, 1);
  console.log('PASS profile section order, exact values/years and English content coverage.');
} finally {
  await server.close();
}
