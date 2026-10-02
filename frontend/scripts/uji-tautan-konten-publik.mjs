import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
const render = (Component, props) => renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Component, props)));

try {
  const { default: PengumumanPopulerCard } = await server.ssrLoadModule('/src/components/pengumuman/PengumumanPopulerCard.jsx');
  const items = Array.from({ length: 6 }, (_, i) => ({ slug: `pengumuman-uji-${i}`, title: `Pengumuman uji ${i}`, date: 'Tanggal uji' }));
  const sidebar = render(PengumumanPopulerCard, { items });
  assert.ok(sidebar.includes('Pengumuman Terbaru'));
  assert.equal((sidebar.match(/href="\/pengumuman\/pengumuman-uji-/g) || []).length, 5);
  assert.ok(!sidebar.includes('Dilihat'));
  assert.ok(!sidebar.includes('ppdb-gelombang-1-dibuka'));
  assert.ok(sidebar.indexOf('pengumuman-uji-0') < sidebar.indexOf('pengumuman-uji-1'));
  const collection = render(PengumumanPopulerCard, { items, tampilkanLihatSemua: false });
  assert.equal((collection.match(/href="\/pengumuman\/pengumuman-uji-/g) || []).length, 6);
  assert.ok(!collection.includes('href="/pengumuman/populer"'));
  assert.ok(!render(PengumumanPopulerCard, {}).includes('ppdb-gelombang-1-dibuka'));

  const { default: BeritaHeroSection } = await server.ssrLoadModule('/src/components/berita/BeritaHeroSection.jsx');
  const berita = render(BeritaHeroSection, { items: [{ slug: 'berita-uji', text: 'Berita untuk pengujian', date: 'Tanggal uji' }] });
  assert.ok(berita.includes('href="/berita/berita-uji"'));
  assert.ok(berita.includes('Baca Berita'));
  assert.ok(!berita.includes('Lihat Prestasi'));

  const { default: Unggulan } = await server.ssrLoadModule('/src/components/prestasi/PrestasiUnggulanSection.jsx');
  const achievements = items.map((item) => ({ ...item, level: 'Nasional', desc: 'Ringkasan prestasi.' }));
  const unggulan = render(Unggulan, { items: achievements });
  assert.equal((unggulan.match(/<button/g) || []).length, 2, 'Prestasi unggulan maksimal tiga: satu utama dan dua pilihan.');
  assert.ok(!unggulan.includes('Pengumuman uji 3'));
  assert.equal(render(Unggulan, { items: [] }), '');

  const { sortPengumumanTimeline, getPengumumanCounts, getContentSource, toPengumumanItem } = await server.ssrLoadModule('/src/utils/publicContent.js');
  const dated = [
    { slug: 'baru', title: 'Pengumuman terbaru', iso: '2026-10-02', desc: 'Isi terbaru' },
    { slug: 'tanpa-tanggal', title: 'Tanpa tanggal', iso: '', desc: 'Isi tanpa tanggal' },
    { slug: 'lama', title: 'Pengumuman terdahulu', iso: '2026-09-28', desc: 'Isi terdahulu' },
    { slug: 'besok', title: 'Pengumuman besok', iso: '2026-10-03', desc: 'Isi besok' },
  ];
  assert.deepEqual(sortPengumumanTimeline(dated).map((item) => item.slug), ['lama', 'baru', 'besok', 'tanpa-tanggal']);
  assert.equal(dated[0].slug, 'baru', 'Timeline tidak boleh mengubah urutan data di halaman induk.');
  assert.deepEqual(getPengumumanCounts(dated, new Date(2026, 9, 2, 12)), [1, 1, 3, 2]);
  assert.deepEqual(getPengumumanCounts([], new Date(2026, 9, 2)), [0, 0, 0, 0]);
  assert.deepEqual(getPengumumanCounts([{ iso: '2026-12-31T12:00:00' }, { iso: '2027-01-01T12:00:00' }], new Date(2026, 11, 31)), [1, 1, 2, 1]);
  const { default: Timeline } = await server.ssrLoadModule('/src/components/pengumuman/PengumumanTimelineSection.jsx');
  const timeline = render(Timeline, { items: dated });
  assert.equal((timeline.match(/<article/g) || []).length, 4);
  assert.ok(timeline.indexOf('Pengumuman terdahulu') < timeline.indexOf('Pengumuman terbaru'));
  assert.ok(/datetime="2026-10-02"/i.test(timeline) && timeline.includes('Isi terbaru'));
  assert.ok(timeline.includes('href="/pengumuman/baru"'));
  assert.equal(render(Timeline, {}), '');

  const sourceUrl = 'https://smktelkom-pwt.sch.id/pengumuman/pengumuman-libur-dan-kbm/';
  assert.equal(getContentSource('Isi pengumuman. Sumber: ' + sourceUrl), sourceUrl);
  for (const invalid of ['', 'Sumber: javascript:alert(1)', 'Sumber: https://', 'Sumber: https://smktelkom-pwt.sch.id/wp-json/wp/v2/posts?categories=8']) assert.equal(getContentSource(invalid), '');
  assert.equal(toPengumumanItem({ judul: 'Uji', konten: 'Sumber: ' + sourceUrl }).sourceUrl, sourceUrl);
  const { officialContentAudit, projectShowcase, projectDetail } = await server.ssrLoadModule('/src/data/dummyData.js');
  for (const url of [officialContentAudit.prestasiSourceUrl, officialContentAudit.pengumumanSourceUrl]) {
    assert.equal(new URL(url).hostname, 'smktelkom-pwt.sch.id');
    assert.ok(!url.includes('wp-json'));
  }
  for (const item of projectShowcase.items) {
    assert.ok(item.description && item.author && item.sourceUrl, 'Proyek harus menyertakan deskripsi, pembuat, dan sumber.');
    assert.ok(projectDetail.some((detail) => detail.title === item.title && detail.sourceUrl === item.sourceUrl && detail.image === item.image), 'Kartu harus menuju detail dengan sumber yang sama.');
  }
  const { default: DetailLayout } = await server.ssrLoadModule('/src/components/DetailLayout.jsx');
  const detail = render(DetailLayout, { item: projectDetail[0], backTo: '/jurusan', backLabel: 'Jurusan' });
  assert.ok(detail.includes(`href="${projectDetail[0].sourceUrl}"`));
  assert.ok(detail.includes('Lihat sumber'));

  console.log('Lulus: tautan publik, maksimal tiga prestasi unggulan, timeline kronologis, hitungan kalender, sumber artikel, dan detail proyek sesuai.');
} finally {
  await server.close();
}
