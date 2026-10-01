import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });

try {
  const { videoProfilSekolah, jurusanDetail } = await server.ssrLoadModule('/src/data/dummyData.js');
  const { default: AboutSection } = await server.ssrLoadModule('/src/components/tentang/TentangAboutSection.jsx');
  const { default: GaleriFoto } = await server.ssrLoadModule('/src/components/GaleriFoto.jsx');

  // Removing the duplicate section must preserve the primary video and shared gallery.
  const about = renderToStaticMarkup(createElement(AboutSection));
  assert.ok(about.includes(`Putar video: ${videoProfilSekolah.title}`));
  assert.ok(about.includes(videoProfilSekolah.poster));
  assert.ok(!about.includes('<iframe'), 'Video must retain its facade until playback is requested.');

  const items = jurusanDetail.find(({ slug }) => slug === 'rpl').galeri;
  const gallery = renderToStaticMarkup(createElement(GaleriFoto, { items, title: 'Fasilitas Sekolah' }));
  assert.equal((gallery.match(/aria-label="Perbesar foto:/g) ?? []).length, items.length);
  for (const { image } of items) assert.ok(gallery.includes(image));
  assert.ok(gallery.includes('ruang-kelas-1.jpg'), 'Shared classroom photo must remain available.');
  console.log('Video utama dan galeri fasilitas shared tetap tersedia setelah section duplikat dihapus.');
} finally {
  await server.close();
}
