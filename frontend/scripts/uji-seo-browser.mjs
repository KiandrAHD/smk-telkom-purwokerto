/* global document, window, history, PopStateEvent */
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const dist = path.resolve('dist');
// Match the deployed filesystem-first routing, with app.html as the SPA fallback.
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    let file = path.resolve(dist, `.${pathname}`);
    if (!file.startsWith(`${dist}${path.sep}`) && file !== dist) { response.writeHead(400).end(); return; }
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); }
    catch { file = path.join(dist, 'app.html'); }
    const content = await readFile(file);
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml' };
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }).end(content);
  } catch { response.writeHead(500).end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => errors.push(error.message));
  const routes = JSON.parse(await readFile(path.join(dist, 'seo-routes.json'), 'utf8'));
  const examples = ['/', '/fasilitas', '/profil-sekolah', '/jurusan', '/jurusan/rpl', '/prestasi', '/berita', '/pengumuman', '/kalender', '/spmb', '/jurusan/faq', routes.find(route => route.startsWith('/profil-sekolah/guru/')), routes.find(route => route.startsWith('/berita/') && !['/berita/trending', '/berita/agenda'].includes(route) && !route.startsWith('/berita/agenda/'))];
  const ready = async () => {
    await page.waitForFunction(() => Object.keys(document.getElementById('root')).some(key => key.startsWith('__reactContainer')));
    await page.locator('main h1').first().waitFor();
  };
  const verify = async route => {
    await page.waitForFunction(pathname => document.querySelector('link[rel="canonical"]')?.href.endsWith(pathname) && document.querySelector('meta[property="og:title"]')?.content === document.title && !document.querySelector('meta[name="robots"]')?.content.includes('noindex'), route);
    const state = await page.evaluate(() => ({
      h1: document.querySelectorAll('h1').length,
      canonical: document.querySelectorAll('link[rel="canonical"]').length,
      robots: document.querySelectorAll('meta[name="robots"]').length,
      schemas: document.querySelectorAll('script[type="application/ld+json"]').length,
      url: document.querySelector('meta[property="og:url"]')?.content,
      canonicalUrl: document.querySelector('link[rel="canonical"]')?.href,
      schema: JSON.parse(document.querySelector('script[data-school-schema]').textContent),
    }));
    assert.equal(state.h1, 1, `${route}: runtime H1`);
    assert.equal(state.canonical, 1);
    assert.equal(state.robots, 1);
    assert.equal(state.schemas, 1);
    assert.equal(state.url, state.canonicalUrl);
    const isNews = /^\/berita\/[^/]+\/?$/.test(route) && !['/berita/trending', '/berita/agenda'].includes(route);
    assert.equal(state.schema['@graph'].some(node => node['@type'] === 'Article'), isNews, `${route}: Article only on news details`);
    assert.equal(await page.locator('meta[property="og:type"]').getAttribute('content'), isNews ? 'article' : 'website');
    assert.equal(state.schema['@graph'].find(node => node['@type'] === 'WebPage').url, state.canonicalUrl);
    assert.ok(state.schema['@graph'].find(node => node['@type'] === 'School').telephone, `${route}: retain school contacts`);
    const trail = await page.locator('main nav[aria-label="Jejak navigasi"], main nav[aria-label="Breadcrumb"]').first().evaluateAll(nodes => nodes[0] ? [...nodes[0].querySelectorAll('a, [aria-current="page"]')].map(node => ({ name: node.textContent.trim(), path: node.tagName === 'A' ? new URL(node.href).pathname : window.location.pathname })) : []);
    if (trail.length >= 2) {
      const breadcrumb = state.schema['@graph'].find(node => node['@type'] === 'BreadcrumbList');
      assert.ok(breadcrumb, `${route}: runtime breadcrumb`);
      assert.deepEqual(breadcrumb.itemListElement.map(item => ({ name: item.name, path: new URL(item.item).pathname })), trail);
    }
  };
  for (const route of examples.filter(Boolean)) { await page.goto(`${base}${route}`); await ready(); await verify(route); }
  // Exercise client navigation rather than reload alone, including a query-string duplicate.
  const navigate = async route => {
    await page.evaluate(route => { history.pushState({}, '', route); window.dispatchEvent(new PopStateEvent('popstate')); }, route);
    await ready();
  };
  for (const route of [routes.find(route => route.startsWith('/berita/agenda/')), routes.find(route => route.startsWith('/galeri/'))].filter(Boolean)) {
    await page.goto(`${base}${route}?from=berita`); await ready(); await verify(route);
  }
  await navigate('/fasilitas?utm_source=seo-qa'); await verify('/fasilitas');
  await navigate('/random-page');
  await page.locator('#error-title').waitFor();
  await page.waitForFunction(() => document.querySelector('meta[name="robots"]')?.content.includes('noindex') && !document.querySelector('link[rel="canonical"]'));
  await navigate('/jurusan'); await verify('/jurusan');
  await page.goto(`${base}/login`);
  await ready();
  assert.equal(await page.locator('link[rel="canonical"]').count(), 0);
  assert.ok((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'));
  await page.goto(base); await ready(); await verify('/');
  const language = page.getByRole('button', { name: /EN|English|Bahasa Inggris/ }).first();
  if (await language.count()) {
    await language.click();
    await page.waitForFunction(() => document.documentElement.lang === 'en');
    await verify('/');
  }
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}: overflow`);
  }
  const noJs = await browser.newPage({ javaScriptEnabled: false });
  await noJs.goto(base);
  await noJs.getByRole('heading', { name: /Tentang SMK Telkom Purwokerto/ }).scrollIntoViewIfNeeded();
  assert.equal(await noJs.locator('#tentang .reveal').first().evaluate(node => window.getComputedStyle(node).opacity), '1');
  assert.equal(await noJs.locator('h1').count(), 1);
  assert.deepEqual(errors, [], 'Browser runtime errors');
  console.log(`PASS browser SEO: ${examples.filter(Boolean).length} public pages, client navigation, query canonical, 404 recovery, login noindex, language, 3 viewport widths, no-JavaScript content, no runtime errors.`);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
