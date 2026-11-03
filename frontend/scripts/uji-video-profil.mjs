import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { default: VideoEmbed } = await server.ssrLoadModule('/src/components/VideoEmbed.jsx');
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { videoProfilSekolah } = await server.ssrLoadModule('/src/data/dummyData.js');
  assert.equal(videoProfilSekolah.videoSrc, '/videos/profil-sekolah-720p.mp4');
  for (const language of ['id', 'en']) {
    const markup = renderToStaticMarkup(h(LanguageContext.Provider, {
      value: { language, t: text => text },
    }, h(VideoEmbed, videoProfilSekolah)));
    assert.match(markup, /<button/);
    assert.doesNotMatch(markup, /<video|<iframe|<source|profil-sekolah-720p\.mp4/,
      'Before a click, no player or video source may be loaded.');
  }
  const source = await readFile(new URL('../src/components/VideoEmbed.jsx', import.meta.url), 'utf8');
  assert.match(source, /diputar \? videoSrc \? \(/);
  assert.match(source, /<video\s+src=\{videoSrc\}\s+controls\s+autoPlay\s+playsInline\s+preload="none"/);
  assert.match(source, /bg-black object-contain/, 'Keep the complete video visible, without cropping.');
  for (const path of ['AboutSection.jsx', 'DetailLayout.jsx', 'prestasi/PrestasiDukunganSection.jsx']) {
    assert.match(await readFile(new URL(`../src/components/${path}`, import.meta.url), 'utf8'), /videoSrc=\{/);
  }
  assert.match(await readFile(new URL('../src/components/tentang/TentangAboutSection.jsx', import.meta.url), 'utf8'), /\.\.\.videoProfilSekolah/);
  console.log('Video profil: native source wiring and unloaded facade pass in ID/EN.');
} finally {
  await server.close();
}
