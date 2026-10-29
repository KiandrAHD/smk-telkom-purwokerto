// Read-only production evidence. Run: node scripts/audit-seo-http.mjs [origin]
import { parse } from 'parse5';

// Extract text with an HTML parser, not regex-based pseudo-sanitization.
// Evidence remains untrusted text and is only emitted as JSON, never HTML.
const textContent = node => {
  if (['script', 'style', 'template'].includes(node.tagName)) return '';
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes || []).map(textContent).join(' ');
};
const plainText = html => textContent(parse(html)).replace(/\s+/g, ' ').trim();
const origin = process.argv[2] || 'https://smk-telkom-purwokerto.vercel.app';
const read = async (pathname, userAgent) => {
  const response = await fetch(new URL(pathname, origin), { headers: userAgent ? { 'user-agent': userAgent } : {} });
  const html = await response.text();
  const body = plainText(html);
  let schema;
  try { schema = JSON.parse(html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1] || '{}'); } catch { schema = 'INVALID JSON'; }
  const evidence = {
    pathname, userAgent: userAgent || 'default', status: response.status, finalUrl: response.url,
    contentType: response.headers.get('content-type'), xRobotsTag: response.headers.get('x-robots-tag'),
    htmlCharacters: html.length, textWords: body.split(/\s+/).length,
    title: html.match(/<title>([\s\S]*?)<\/title>/)?.[1],
    h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(match => plainText(match[1])),
    canonical: html.match(/<link rel="canonical" href="([^"]+)"/)?.[1],
    robots: html.match(/<meta name="robots" content="([^"]+)"/)?.[1],
    ogImage: html.match(/<meta property="og:image" content="([^"]+)"/)?.[1],
    schema, loading: body.includes('Memuat'),
    contentLinks: [...new Set([...html.matchAll(/href="(\/(?:berita|prestasi|pengumuman)\/[^"#?]+)"/g)].map(match => match[1]))],
    excerpt: body.slice(-1700),
  };
  console.log(JSON.stringify(evidence));
  return { html, evidence };
};
const sitemap = await read('/sitemap.xml');
await read('/robots.txt');
for (const pathname of ['/', '/profil-sekolah', '/jurusan', '/berita', '/pengumuman', '/prestasi', '/berita/trending', '/prestasi/galeri', '/login', '/halaman-tidak-ada-audit']) await read(pathname);
await read('/', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
await read('/berita/');
const detail = [...sitemap.html.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname).find(pathname => pathname.startsWith('/berita/') && !['/berita/trending', '/berita/agenda'].includes(pathname) && !pathname.startsWith('/berita/agenda/'));
if (detail) await read(detail);
const home = await fetch(origin).then(response => response.text());
const resources = new Set([...home.matchAll(/(?:src|href)="([^" ]+)"/g)].map(match => match[1]).filter(url => url.startsWith('/assets/')));
resources.add('/og-school.jpg');
for (const resource of resources) {
  const response = await fetch(new URL(resource, origin), { method: 'HEAD' });
  console.log(JSON.stringify({ resource, status: response.status, type: response.headers.get('content-type') }));
}
