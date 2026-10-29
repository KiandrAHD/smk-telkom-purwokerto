import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const dist = path.resolve('dist');
const routes = JSON.parse(await readFile(path.join(dist, 'seo-routes.json'), 'utf8'));
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
assert.equal(new Set(routes).size, routes.length);
assert.ok(!routes.some(route => /^\/(dashboard|login|auth|ppdb)(\/|$)/.test(route) || route.startsWith('/spmb/')));
for (const route of routes) {
  const html = await readFile(path.join(dist, route.slice(1), 'index.html'), 'utf8');
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: H1`);
  let previousLevel = 0;
  for (const heading of html.matchAll(/<h([1-6])\b/g)) {
    const level = Number(heading[1]);
    assert.ok(level <= previousLevel + 1, `${route}: skipped heading level`);
    previousLevel = level;
  }
  assert.equal((head.match(/<title>/g) || []).length, 1, `${route}: title`);
  for (const name of ['description', 'robots', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
    assert.equal((head.match(new RegExp(`name="${name}"`, 'g')) || []).length, 1, `${route}: ${name}`);
  }
  for (const property of ['og:title', 'og:description', 'og:image', 'og:url']) {
    assert.equal((head.match(new RegExp(`property="${property}"`, 'g')) || []).length, 1, `${route}: ${property}`);
  }
  assert.ok(head.includes('content="index, follow"'), `${route}: indexable`);
  const canonicals = [...head.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  assert.equal(canonicals.length, 1, `${route}: single canonical`);
  const canonical = canonicals[0][1];
  assert.equal(new URL(canonical).pathname, route, `${route}: canonical path`);
  assert.ok(head.includes(`property="og:url" content="${canonical}"`));
  assert.ok(sitemap.includes(`<loc>${canonical}</loc>`), `${route}: sitemap`);
  assert.ok(robots.includes(`${new URL(canonical).origin}/sitemap.xml`));
  const schemas = [...head.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  assert.equal(schemas.length, 1, `${route}: single JSON-LD graph`);
  const schema = JSON.parse(schemas[0][1]);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(new Set(schema['@graph'].map(node => node['@id'])).size, schema['@graph'].length);
  assert.deepEqual(schema['@graph'].map(node => node['@type']), ['School', 'WebSite', 'WebPage', ...(route === '/' ? [] : ['BreadcrumbList'])]);
  assert.equal(schema['@graph'][2].url, canonical);
  assert.ok(!html.includes('/src/assets/'), `${route}: production assets`);
  for (const attribute of html.matchAll(/(?:src|srcSet|href)="([^"]+)"/g)) {
    for (const asset of new Set(attribute[1].match(/\/assets\/[^"\s,<>]+/g))) await access(path.join(dist, asset));
  }
  for (const image of html.matchAll(/<img\b[^>]*>/g)) assert.ok(/\balt="/.test(image[0]), `${route}: missing image alt`);
  assert.equal((html.match(/<main\b/g) || []).length, 1, `${route}: main landmark`);
}
// Shared hero styles must exist before JavaScript, including carousel visibility.
const manifest = JSON.parse(await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));
const heroCss = Object.entries(manifest).filter(([key]) => key.startsWith('_PageHeroCarousel-')).flatMap(([, entry]) => entry.css || []);
assert.ok(heroCss.length, 'Shared hero CSS emitted');
for (const route of ['/', '/profil-sekolah', '/berita', '/prestasi']) {
  const html = await readFile(path.join(dist, route.slice(1), 'index.html'), 'utf8');
  for (const css of heroCss) assert.ok(html.includes(`href="/${css}"`), `${route}: initial hero CSS`);
}
for (const route of ['/pengumuman/populer', '/pengumuman/semua', '/pengumuman/timeline', '/pengumuman/informasi-penting', '/berita/trending', '/berita/agenda', '/prestasi/galeri']) {
  const html = await readFile(path.join(dist, route.slice(1), 'index.html'), 'utf8');
  assert.ok(!/Memuat (berita|pengumuman|prestasi)/.test(html), `${route}: collection must not be a loading-only prerender`);
}
const homepage = await readFile(path.join(dist, 'index.html'), 'utf8');
const homepageText = homepage.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
for (const text of ['Tentang SMK Telkom Purwokerto', 'Rekayasa Perangkat Lunak', 'Pengembangan Game', 'Teknik Komputer', 'Teknik Jaringan', 'DI Panjaitan']) assert.ok(homepageText.includes(text), `Homepage content: ${text}`);
const fallback = await readFile(path.join(dist, 'app.html'), 'utf8');
assert.ok(fallback.includes('content="noindex, follow"'));
assert.ok(!fallback.includes('rel="canonical"'));
const image = await sharp(path.join(dist, 'og-school.jpg')).metadata();
assert.equal(image.width, 1200);
assert.equal(image.height, 630);
console.log(`PASS SEO: ${routes.length} production HTML pages; unique metadata/schema, H1, landmarks, alt, emitted assets, sitemap, robots, fallback and OG image.`);
