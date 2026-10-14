import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { pageHeroSlides } = await server.ssrLoadModule('/src/data/pageHeroSlides.js');
  const { landingHeroSlides } = await server.ssrLoadModule('/src/data/landingHeroSlides.js');
  const { default: english } = await server.ssrLoadModule('/src/data/translations.js');
  const { fasilitasViews } = await server.ssrLoadModule('/src/data/fasilitasPageData.js');
  const codes = new Set(['RPL', 'PG', 'TKJ', 'TJAT', 'OSIS']);
  const missing = [];
  for (const entry of [...Object.values(pageHeroSlides).flat(), ...landingHeroSlides]) {
    assert.ok(entry.id && entry.name && entry.content.primaryCta.href);
    assert.ok(entry.content.primaryCta.href.startsWith('/'), 'Existing local routes only');
    if (entry.id === 'lab-komputer' || entry.id === 'perpustakaan') {
      const target = new URL(entry.content.primaryCta.href, 'https://example.test');
      const groups = fasilitasViews[target.searchParams.get('kategori') || 'Semua'];
      assert.ok(groups.some(group => target.hash === `#fasilitas-${group.id}`), 'Facility CTA selects the category that owns its anchor');
    }
    for (const text of [entry.name, entry.content.title, entry.content.titleAccent, entry.content.description, entry.content.primaryCta.label, entry.media?.alt]) {
      if (text && !codes.has(text) && !english[text]) missing.push(text);
    }
  }
  assert.deepEqual([...new Set(missing)], [], 'Every slide string has an English translation');
  console.log('PASS per-page slide configuration, existing route links and complete ID/EN mapping.');
} finally { await server.close(); }
