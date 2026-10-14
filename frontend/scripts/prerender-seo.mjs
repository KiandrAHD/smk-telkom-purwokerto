import { createElement as h } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { PassThrough } from 'node:stream';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import sharp from 'sharp';

const root = process.cwd();
const dist = path.join(root, 'dist');
const server = await createServer({ appType: 'custom', logLevel: 'error', server: { middlewareMode: true } });
const escape = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const plain = html => html.replace(/<[^>]*>/g, '').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').trim();
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx');
  const { default: LanguageProvider } = await server.ssrLoadModule('/src/context/LanguageProvider.jsx');
  const { PAGE_META, SITE_URL, OG_IMAGE, pageMetadata } = await server.ssrLoadModule('/src/utils/seo.js');
  const data = await server.ssrLoadModule('/src/data/dummyData.js');
  const { profilGuruDetail } = await server.ssrLoadModule('/src/data/profilGuruData.js');
  const { default: DetailLayout } = await server.ssrLoadModule('/src/components/DetailLayout.jsx');
  const publicContent = {};
  const { toBeritaItem, toPengumumanItem, toPrestasiItem } = await server.ssrLoadModule('/src/utils/publicContent.js');
  for (const [type, service, method, map] of [
    ['berita', 'beritaService', 'getPublishedBerita', toBeritaItem],
    ['pengumuman', 'pengumumanService', 'getPublishedPengumuman', toPengumumanItem],
    ['prestasi', 'prestasiService', 'getPrestasi', toPrestasiItem],
  ]) {
    const module = await server.ssrLoadModule(`/src/services/${service}.js`);
    // Only existing public read APIs participate; a failed fetch must never publish dummy records.
    try { publicContent[type] = (await module[method]()).map(map); }
    catch { console.warn(`SEO: ${type} unavailable; dynamic pages remain client-rendered and are excluded from this sitemap snapshot.`); }
  }
  const pages = {};
  for (const name of ['Landing', 'Berita', 'Pengumuman', 'Prestasi']) pages[name] = (await server.ssrLoadModule(`/src/pages/${name}Page.jsx`)).default;
  const detailContent = {};
  for (const [type, name] of [['berita', 'Berita'], ['pengumuman', 'Pengumuman'], ['prestasi', 'Prestasi']]) detailContent[type] = (await server.ssrLoadModule(`/src/components/${type}/${name}DetailKonten.jsx`)).default;
  const manifest = JSON.parse(await readFile(path.join(dist, '.vite/manifest.json'), 'utf8'));
  const template = (await readFile(path.join(dist, 'index.html'), 'utf8'))
    .replace(/\s*<meta (?:name="(?:description|robots|twitter:[^"]+)"|property="og:[^"]+")[^>]*>/g, '')
    .replace(/\s*<link rel="canonical"[^>]*>/g, '')
    .replace(/\s*<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g, '')
    .replace(/\s*<link rel="stylesheet" data-seo-style[^>]*>/g, '')
    .replace(/<div id="root">[\s\S]*<\/div>/, '<div id="root"></div>')
    .replace(/\s*<title>[\s\S]*?<\/title>/, '');
  const render = pathname => new Promise((resolve, reject) => {
    let html = '';
    const output = new PassThrough();
    output.on('data', chunk => { html += chunk; });
    output.on('end', () => resolve(html));
    output.on('error', reject);
    let content = h(App);
    if (pathname === '/') content = h(pages.Landing, { initialPrestasi: publicContent.prestasi });
    for (const [type, name] of [['berita', 'Berita'], ['pengumuman', 'Pengumuman'], ['prestasi', 'Prestasi']]) {
      if (pathname === `/${type}`) content = h(pages[name], { initialItems: publicContent[type] });
      const item = publicContent[type]?.find(entry => pathname === `/${type}/${entry.slug}`);
      if (item) content = h(DetailLayout, { item, backTo: `/${type}`, backLabel: name }, h(detailContent[type], { item, relatedItems: publicContent[type].filter(entry => entry.slug !== item.slug).slice(0, 3) }));
    }
    const stream = renderToPipeableStream(h(MemoryRouter, { initialEntries: [pathname] }, h(LanguageProvider, null, content)), {
      onAllReady() { stream.pipe(output); }, onError: reject,
    });
  });
  const staticDetails = [
    ['/jurusan', data.jurusanDetail], ['/profil-sekolah/guru', profilGuruDetail],
    ['/galeri', data.galeriDetail], ['/berita/agenda', data.agendaDetail],
    ['/bkk/panduan', data.panduanDetail], ['/bkk/pkl', data.pklDetailLengkap],
    ['/bkk/roadmap', data.roadmapDetail], ['/jurusan/project', data.projectDetail],
  ];
  const routes = [...new Set([
    ...Object.keys(PAGE_META).filter(route => !['/login', '/dashboard'].includes(route)),
    ...staticDetails.flatMap(([base, entries]) => entries.map(item => `${base}/${item.slug}`)),
    ...Object.entries(publicContent).flatMap(([type, entries]) => entries.map(item => `/${type}/${item.slug}`)),
  ])];
  const school = { description: PAGE_META['/'][1], address: data.footerData.kontak.address, telephone: data.footerData.kontak.phone, email: data.footerData.kontak.email, sameAs: data.footerData.socials.map(item => item.href) };
  const stylesFor = route => {
    const css = new Set();
    const seen = new Set();
    const collect = key => {
      if (seen.has(key)) return;
      seen.add(key);
      const entry = manifest[key];
      entry?.css?.forEach(file => css.add(file));
      entry?.imports?.forEach(collect);
    };
    collect('index.html');
    // Shared divider styles and route-specific layouts must also work before lazy JavaScript loads.
    Object.keys(manifest).filter(key => key.startsWith('_RibbonDivider-')).forEach(collect);
    if (route === '/') collect('src/components/FacilitiesSection.jsx');
    if (route === '/fasilitas') collect('src/pages/FasilitasPage.jsx');
    if (/^\/jurusan\/[^/]+$/.test(route)) collect('src/pages/JurusanDetailPage.jsx');
    if (route === '/kalender') collect('src/pages/KalenderPage.jsx');
    if (route === '/spmb') collect('src/pages/SpmbPage.jsx');
    return [...css].filter(file => !template.includes(`href="/${file}"`)).map(file => `<link rel="stylesheet" data-seo-style href="/${file}" />`).join('');
  };
  const head = metadata => `<title>${escape(metadata.title)}</title>
    <meta name="description" content="${escape(metadata.description)}" />
    <meta name="robots" content="${metadata.indexable ? 'index, follow' : 'noindex, follow'}" />
    ${metadata.indexable ? `<link rel="canonical" href="${metadata.url}" />` : ''}
    <meta property="og:title" content="${escape(metadata.title)}" />
    <meta property="og:description" content="${escape(metadata.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${metadata.url}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(metadata.title)}" />
    <meta name="twitter:description" content="${escape(metadata.description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <script type="application/ld+json" data-school-schema>${JSON.stringify(metadata.jsonLd).replace(/</g, '\\u003c')}</script>`;
  for (const route of routes) {
    if (route.includes('..') || route.includes('\\') || new URL(route, SITE_URL).pathname !== route) throw new Error(`Invalid public route: ${route}`);
    let html = await render(route);
    if ((html.match(/<h1\b/g) || []).length !== 1) throw new Error(`${route}: expected exactly one H1`);
    if (html.includes('id="error-title"')) throw new Error(`${route}: rendered an error page`);
    const title = PAGE_META[route]?.[0] || `${plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1])} | SMK Telkom Purwokerto`;
    const description = PAGE_META[route]?.[1] || plain(html.match(/<h1\b[\s\S]*?<\/h1>[\s\S]*?<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1] || title);
    const breadcrumbs = route === '/' ? undefined : [{ name: 'Beranda', path: '/' }, { name: title.split(' | ')[0], path: route }];
    const metadata = pageMetadata({ pathname: route, title, description, school, breadcrumbs });
    // SSR uses source asset URLs; map them to the exact files emitted by the client build.
    html = html.replace(/\/src\/assets\/[^"\s<>]+/g, url => {
      const asset = manifest[url.slice(1).split('?')[0]];
      if (!asset) throw new Error(`Missing production asset: ${url}`);
      return `/${asset.file}`;
    });
    const directory = route === '/' ? dist : path.join(dist, route.slice(1));
    await mkdir(directory, { recursive: true });
    await writeFile(path.join(directory, 'index.html'), template.replace('</head>', `${head(metadata)}${stylesFor(route)}</head>`).replace('<div id="root"></div>', `<div id="root">${html}</div>`));
  }
  // Unknown URLs and account screens start non-indexable; validated public detail data updates metadata in the browser.
  await writeFile(path.join(dist, 'app.html'), template.replace('</head>', `${head(pageMetadata({ pathname: '/', title: 'SMK Telkom Purwokerto', description: 'Website SMK Telkom Purwokerto.', indexable: false }))}</head>`));
  await sharp(path.join(root, 'src/assets/tentang/profil-hero.jpg')).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 88 }).toFile(path.join(dist, 'og-school.jpg'));
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(route => `<url><loc>${SITE_URL}${route}</loc></url>`).join('')}</urlset>\n`);
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  await writeFile(path.join(dist, 'seo-routes.json'), JSON.stringify(routes));
  console.log(`SEO: prerendered ${routes.length} public routes, generated sitemap, robots and school OG image.`);
} finally {
  await server.close();
}
