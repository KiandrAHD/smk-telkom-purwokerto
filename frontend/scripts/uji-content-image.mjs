import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });

try {
  const { normalizeImage, toBeritaItem, toPengumumanItem, toPrestasiItem, toBkkItem } = await server.ssrLoadModule('/src/utils/publicContent.js');
  for (const transform of [toBeritaItem, toPengumumanItem, toPrestasiItem]) {
    assert.equal(transform({}).image, '', 'Foto kosong tidak boleh diganti dengan foto kegiatan lain.');
    assert.equal(transform({ gambar_url: 'https://example.com/photo.jpg' }).image, 'https://example.com/photo.jpg');
  }
  assert.equal(toBkkItem({ perusahaan: 'Perusahaan lain' }).logo, '', 'Logo kosong tidak boleh memakai merek Telkom.');
  assert.equal(normalizeImage('   '), '');
  const achievement = toPrestasiItem({ judul: 'Prestasi uji', slug: 'prestasi-uji', deskripsi: 'Ringkasan.\n\nDetail kegiatan.', gambar_url: 'https://placehold.co/1200x675/png' });
  assert.equal(achievement.lead, 'Ringkasan.');
  assert.deepEqual(achievement.body, ['Detail kegiatan.'], 'Ringkasan tidak boleh diulang pada isi detail.');
  for (const transform of [toBeritaItem, toPengumumanItem]) {
    for (const ringkasan of ['', 'Ringkasan.']) {
      const item = transform({ konten: 'Ringkasan.\n\nDetail kegiatan.', ringkasan });
      assert.equal(item.lead, 'Ringkasan.');
      assert.deepEqual(item.body, ['Detail kegiatan.']);
    }
    const separate = transform({ ringkasan: 'Pengantar.', konten: 'Isi lengkap.' });
    assert.equal(separate.lead, 'Pengantar.');
    assert.deepEqual(separate.body, ['Isi lengkap.']);
  }
  const { default: AchievementCard } = await server.ssrLoadModule('/src/components/AchievementCard.jsx');
  const card = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(AchievementCard, achievement)));
  assert.ok(card.includes('href="/prestasi/prestasi-uji"'), 'Kartu memakai slug data yang sama dengan halaman detail.');
  assert.ok(card.includes('https://placehold.co/1200x675/png'), 'Placeholder yang diminta tetap dipertahankan.');

  const { default: ContentImage } = await server.ssrLoadModule('/src/components/ContentImage.jsx');
  const empty = renderToStaticMarkup(createElement(ContentImage, { src: '', alt: 'Dokumentasi', className: 'aspect-[16/9] w-full' }));
  assert.ok(empty.includes('Foto belum tersedia'));
  assert.ok(!empty.includes('<img'));
  const present = renderToStaticMarkup(createElement(ContentImage, { src: '/photo.jpg', alt: 'Dokumentasi' }));
  assert.ok(present.includes('<img'));
  assert.ok(present.includes('src="/photo.jpg"'));
  const { default: PengumumanCard } = await server.ssrLoadModule('/src/components/pengumuman/PengumumanCard.jsx');
  const announcementMarkup = (gambar_url) => renderToStaticMarkup(createElement(MemoryRouter, null,
    createElement(PengumumanCard, { item: toPengumumanItem({ judul: 'Poster SPMB', slug: 'poster-spmb', gambar_url }) })));
  assert.ok(announcementMarkup('/poster-spmb.png').includes('src="/poster-spmb.png"'), 'Kartu pengumuman harus menampilkan foto dari data yang sama.');
  assert.ok(announcementMarkup('').includes('Foto belum tersedia'), 'Pengumuman tanpa foto tetap memakai fallback yang jujur.');
  assert.ok(announcementMarkup('/poster-spmb.png').includes('href="/pengumuman/poster-spmb"'));
  console.log('Foto dan logo kosong tidak memakai gambar pengganti; foto valid tetap dirender.');
} finally {
  await server.close();
}
