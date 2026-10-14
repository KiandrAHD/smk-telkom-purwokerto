import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { pageHeroSlides } = await server.ssrLoadModule('/src/data/pageHeroSlides.js');
  const { landingHeroSlides } = await server.ssrLoadModule('/src/data/landingHeroSlides.js');
  const { default: english } = await server.ssrLoadModule('/src/data/translations.js');
  const { navLinks } = await server.ssrLoadModule('/src/data/dummyData.js');
  const destinations = navLinks.flatMap(link => link.children || [link]).map(link => link.href).sort();
  const heroDestinations = entries => entries.map(entry => entry.id === 'beranda' ? '/' : entry.content.primaryCta.href).sort();
  assert.deepEqual(heroDestinations(landingHeroSlides), destinations, 'Beranda only shows navbar pages, including every submenu');
  for (const [page, entries] of Object.entries(pageHeroSlides)) {
    const opening = landingHeroSlides.find(entry => entry.id === page);
    assert.ok(opening, `Opening page ${page} belongs to navbar`);
    assert.deepEqual(heroDestinations([opening, ...entries]), destinations, `${page}: only navbar pages, without duplicates or facility details`);
  }
  const codes = new Set(['RPL', 'PG', 'TKJ', 'TJAT', 'OSIS', 'BKK', 'SMK Telkom']);
  const missing = [];
  for (const entry of [...Object.values(pageHeroSlides).flat(), ...landingHeroSlides]) {
    assert.ok(entry.id && entry.name && entry.content.primaryCta.href);
    assert.ok(entry.content.primaryCta.href.startsWith('/'), 'Existing local routes only');
    for (const text of [entry.name, entry.content.title, entry.content.titleAccent, entry.content.description, entry.content.primaryCta.label, entry.media?.alt]) {
      if (text && !codes.has(text) && !english[text]) missing.push(text);
    }
  }
  assert.deepEqual([...new Set(missing)], [], 'Every slide string has an English translation');
  console.log('PASS per-page slide configuration, existing route links and complete ID/EN mapping.');
} finally { await server.close(); }
