// Read-only HTTP inventory; no indexing submissions, authenticated requests or browser metrics.
// node scripts/audit-seo-inventory.mjs [origin] [output.json] [local-dist-directory]
import { parse } from 'parse5';
import { writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
const origin = new URL(process.argv[2] || 'https://smk-telkom-purwokerto.vercel.app').origin;
const output = process.argv[3];
const localDirectory = process.argv[4];
const text = node => node.nodeName === '#text' ? node.value : ['script', 'style', 'template'].includes(node.tagName) ? '' : (node.childNodes || []).map(text).join(' ');
const normalize = value => value.replace(/\s+/g, ' ').trim();
const walk = (node, visit) => { visit(node); (node.childNodes || []).forEach(child => walk(child, visit)); };
const fetchText = async url => {
  if (localDirectory) {
    const pathname = new URL(url).pathname;
    if (pathname.includes('..') || pathname.includes('\\')) throw new Error('Invalid local route');
    const relative = pathname === '/' ? 'index.html' : pathname.endsWith('.xml') || pathname.endsWith('.txt') ? pathname.slice(1) : `${pathname.slice(1)}/index.html`;
    const root = path.resolve(localDirectory);
    const file = path.resolve(root, relative);
    if (!file.startsWith(`${root}${path.sep}`)) throw new Error('Local route escapes build directory');
    return { response: { status: 200, url, headers: new Headers() }, html: await readFile(file, 'utf8') };
  }
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  return { response, html: await response.text() };
};
const sitemap = await fetchText(`${origin}/sitemap.xml`);
const robots = await fetchText(`${origin}/robots.txt`);
const urls = [...new Set([...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replace(/&amp;/g, '&')))];
if (!urls.length) throw new Error('No sitemap URLs found; inventory cannot infer public route coverage.');
const pages = [];
let cursor = 0;
await Promise.all(Array.from({ length: 6 }, async () => {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    if (new URL(url).origin !== origin) throw new Error(`Cross-origin sitemap URL requires explicit audit: ${url}`);
    try {
      const { response, html } = await fetchText(url);
      const document = parse(html);
      const page = { url, status: response.status, finalUrl: response.url, xRobotsTag: response.headers.get('x-robots-tag'), lang: '', title: '', description: '', canonical: [], robots: [], headings: [], links: [], images: { total: 0, missingAlt: 0 }, schemas: [], schemaErrors: [], textWords: 0 };
      walk(document, node => {
        const attrs = Object.fromEntries((node.attrs || []).map(attr => [attr.name, attr.value]));
        if (node.tagName === 'html') page.lang = attrs.lang || '';
        if (node.tagName === 'title') page.title = normalize(text(node));
        if (node.tagName === 'meta' && attrs.name === 'description') page.description = attrs.content;
        if (node.tagName === 'meta' && attrs.name === 'robots') page.robots.push(attrs.content);
        if (node.tagName === 'meta' && attrs.property === 'og:image') page.ogImage = attrs.content;
        if (node.tagName === 'link' && attrs.rel === 'canonical') page.canonical.push(attrs.href);
        if (/^h[1-6]$/.test(node.tagName)) page.headings.push({ level: Number(node.tagName[1]), text: normalize(text(node)) });
        if (node.tagName === 'a' && attrs.href) {
          const link = new URL(attrs.href, response.url);
          if (link.origin === origin && /^https?:$/.test(link.protocol)) page.links.push(`${link.pathname}${link.search}`);
        }
        if (node.tagName === 'img') { page.images.total++; if (!Object.hasOwn(attrs, 'alt')) page.images.missingAlt++; }
        if (node.tagName === 'script' && attrs.type === 'application/ld+json') {
          try { page.schemas.push(JSON.parse((node.childNodes || []).map(child => child.value || '').join(''))); }
          catch (error) { page.schemaErrors.push(error.message); }
        }
        if (node.tagName === 'body') page.textWords = normalize(text(node)).split(/\s+/).length;
      });
      page.links = [...new Set(page.links)];
      pages.push(page);
    } catch (error) { pages.push({ url, error: error.message }); }
  }
}));
pages.sort((a, b) => a.url.localeCompare(b.url));
const known = new Set(pages.map(page => new URL(page.url).pathname));
const unlistedInternalLinks = [...new Set(pages.flatMap(page => page.links || []))].filter(link => !known.has(new URL(link, origin).pathname));
const duplicates = field => {
  const groups = new Map();
  for (const page of pages) if (page[field]) groups.set(page[field], [...(groups.get(page[field]) || []), page.url]);
  return [...groups].filter(([, entries]) => entries.length > 1).map(([value, entries]) => ({ value, urls: entries }));
};
const result = { measuredAt: new Date().toISOString(), method: localDirectory ? 'Local built HTML files; status 200 is simulated, not HTTP verification' : 'HTTP HTML only; no browser execution or field performance measurement', origin, sitemapStatus: sitemap.response.status, robotsStatus: robots.response.status, robots: robots.html, pages, duplicateTitles: duplicates('title'), duplicateDescriptions: duplicates('description'), unlistedInternalLinks };
if (output) await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ pages: pages.length, errors: pages.filter(page => page.error || page.status !== 200).length, duplicateTitles: result.duplicateTitles, duplicateDescriptions: result.duplicateDescriptions, unlistedInternalLinks }, null, 2));
