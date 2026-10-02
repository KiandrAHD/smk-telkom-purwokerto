import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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

  const { default: DaftarPengumuman } = await server.ssrLoadModule('/src/components/pengumuman/PengumumanDaftarSection.jsx');
  const daftarItems = Array.from({ length: 12 }, (_, i) => ({ slug: `daftar-uji-${i}`, title: `Pengumuman ${i}`, desc: 'Isi pengumuman', iso: '2026-10-02' }));
  const preview = render(DaftarPengumuman, { items: daftarItems });
  assert.equal((preview.match(/<article/g) || []).length, 5, 'Daftar utama dibatasi lima pengumuman.');
  assert.ok(preview.includes('href="/pengumuman/semua"') && !preview.includes('Pagination pengumuman'));
  const fullList = render(DaftarPengumuman, { items: daftarItems, tampilkanLihatSemua: false });
  assert.equal((fullList.match(/<article/g) || []).length, 5, 'Daftar lengkap juga dibatasi lima pengumuman per halaman.');
  assert.ok(fullList.includes('Halaman 1 dari 3') && fullList.includes('Pagination pengumuman'));
  assert.ok(!fullList.includes('href="/pengumuman/semua"'));
  for (const length of [1, 5]) {
    const onePage = render(DaftarPengumuman, { items: daftarItems.slice(0, length), tampilkanLihatSemua: false });
    assert.ok(onePage.includes('Halaman 1 dari 1'));
    assert.equal((onePage.match(/disabled=""/g) || []).length, 2, 'Kedua tombol nonaktif jika hanya ada satu halaman.');
  }
  assert.ok(!render(DaftarPengumuman, { tampilkanLihatSemua: false }).includes('Pagination pengumuman'), 'Data kosong tidak menampilkan pagination.');

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

  const { sortPengumumanTimeline, getPengumumanCounts, getContentSource, toPengumumanItem, getUniqueProjects, getPengumumanHariIni } = await server.ssrLoadModule('/src/utils/publicContent.js');
  assert.deepEqual(getUniqueProjects([
    { id: '1', title: 'ASISTANI', author: 'Tim A' },
    { id: '1', title: 'Judul diubah', author: 'Tim A' },
    { id: '2', title: '  asistani  ', author: 'tim a' },
    { id: '3', title: 'ASISTANI', author: 'Tim B' },
    { slug: 'senimart', title: 'Senimart' },
    { slug: 'senimart', title: 'Salinan Senimart' },
  ]).map(item => item.title), ['ASISTANI', 'ASISTANI', 'Senimart']);
  assert.deepEqual(getUniqueProjects([]), []);
  const daily = [
    { slug: 'hari-ini', iso: '2026-10-01T17:00:00Z', status: 'published', title: 'Pengumuman hari ini' },
    { slug: 'kemarin', iso: '2026-10-01T16:59:59Z', status: 'published', title: 'Pengumuman kemarin' },
    { slug: 'draft', iso: '2026-10-02', status: 'draft', title: 'Draf rahasia' },
    { slug: 'besok', iso: '2026-10-02T17:00:00Z', status: 'published', title: 'Besok' },
  ];
  assert.deepEqual(getPengumumanHariIni(daily, new Date('2026-10-02T08:00:00Z')).map(item => item.slug), ['hari-ini']);
  assert.equal(getPengumumanHariIni([{ iso: '2026-10-02', status: 'published' }], new Date('2026-10-02T08:00:00Z')).length, 1, 'Tanggal tanpa jam tetap dihitung sebagai tanggal WIB yang sama.');
  assert.equal(getPengumumanHariIni([{ iso: 'tanggal rusak', status: 'published' }], new Date('2026-10-02T08:00:00Z')).length, 0);
  assert.deepEqual(getPengumumanCounts(daily.filter(item => item.status === 'published'), new Date('2026-10-02T08:00:00Z')), [1, 1, 3, 3], 'Ringkasan dan daftar hari ini menggunakan batas WIB yang sama.');
  const { default: InfoHariIni } = await server.ssrLoadModule('/src/components/pengumuman/PengumumanPpdbSection.jsx');
  const dailyMarkup = render(InfoHariIni, { items: daily, now: new Date('2026-10-02T08:00:00Z') });
  assert.ok(dailyMarkup.includes('Pengumuman hari ini') && dailyMarkup.includes('href="/pengumuman/hari-ini"'));
  assert.ok(!dailyMarkup.includes('Draf rahasia') && !dailyMarkup.includes('Pengumuman kemarin'));
  assert.ok(render(InfoHariIni, { items: [], now: new Date('2026-10-02') }).includes('Belum ada pengumuman yang diterbitkan hari ini.'));
  assert.ok(render(InfoHariIni, { loading: true }).includes('Memuat pengumuman'));
  assert.ok(render(InfoHariIni, { error: 'Pengumuman gagal dimuat.' }).includes('Pengumuman gagal dimuat.'));
  const dated = [
    { slug: 'baru', title: 'Pengumuman terbaru', iso: '2026-10-02', desc: 'Isi terbaru' },
    { slug: 'tanpa-tanggal', title: 'Tanpa tanggal', iso: '', desc: 'Isi tanpa tanggal' },
    { slug: 'lama', title: 'Pengumuman terdahulu', iso: '2026-09-28', desc: 'Isi terdahulu' },
    { slug: 'besok', title: 'Pengumuman besok', iso: '2026-10-03', desc: 'Isi besok' },
  ];
  assert.deepEqual(sortPengumumanTimeline(dated).map((item) => item.slug), ['lama', 'baru', 'besok', 'tanpa-tanggal']);
  assert.equal(dated[0].slug, 'baru', 'Timeline tidak boleh mengubah urutan data di halaman induk.');
  assert.deepEqual(getPengumumanCounts(dated, new Date('2026-10-02T08:00:00Z')), [1, 1, 3, 2]);
  assert.deepEqual(getPengumumanCounts([], new Date('2026-10-02T08:00:00Z')), [0, 0, 0, 0]);
  assert.deepEqual(getPengumumanCounts([{ iso: '2026-12-31T12:00:00+07:00' }, { iso: '2027-01-01T12:00:00+07:00' }], new Date('2026-12-31T00:00:00+07:00')), [1, 1, 2, 1]);
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
  const { default: Showcase } = await server.ssrLoadModule('/src/components/jurusan/JurusanShowcaseSection.jsx');
  const showcase = render(Showcase, {});
  assert.equal((showcase.match(/href="\/jurusan\/project\//g) || []).length, 4, 'Empat proyek tetap dapat dibuka tanpa indikator.');
  assert.ok(!showcase.includes('Ke slide project'), 'Showcase Jurusan tidak menampilkan indikator pil.');
  const { default: Carousel } = await server.ssrLoadModule('/src/components/PrestasiCarousel.jsx');
  const carouselProps = { items: [{ id: 'uji' }], renderCard: () => createElement('p', null, 'Kartu uji') };
  assert.ok(render(Carousel, carouselProps).includes('Ke slide prestasi'), 'Indikator carousel lainnya tetap tersedia.');
  assert.ok(!render(Carousel, { ...carouselProps, showIndicators: false }).includes('Ke slide prestasi'));
  const { default: DetailLayout } = await server.ssrLoadModule('/src/components/DetailLayout.jsx');
  const detail = render(DetailLayout, { item: projectDetail[0], backTo: '/jurusan', backLabel: 'Jurusan' });
  assert.ok(!detail.includes('Lihat sumber'), 'Detail proyek pada screenshot juga tidak menampilkan tombol sumber.');
  for (const backTo of ['/prestasi', '/pengumuman']) {
    assert.ok(!render(DetailLayout, { item: projectDetail[0], backTo, backLabel: 'Kembali' }).includes('Lihat sumber'));
  }
  assert.ok(render(DetailLayout, { item: projectDetail[0], backTo: '/berita', backLabel: 'Berita' }).includes('Lihat sumber'), 'Sumber berita di luar lingkup tetap tersedia.');
  for (const path of ['prestasi/PrestasiHeroSection', 'pengumuman/PengumumanHeroSection']) {
    const { default: Hero } = await server.ssrLoadModule(`/src/components/${path}.jsx`);
    assert.ok(!render(Hero, {}).includes('Lihat sumber'));
  }

  const { guruDetail } = await server.ssrLoadModule('/src/data/dummyData.js');
  const { default: DetailPelengkapPage } = await server.ssrLoadModule('/src/pages/DetailPelengkapPage.jsx');
  for (const guru of guruDetail) {
    assert.ok(!/Informasi tersebut merupakan riwayat|Dokumen tersebut tidak mencantumkan|tetapi pembagian mapel/.test(guru.lead));
    for (const [query, target, label] of [
      ['?from=profil-sekolah', '/profil-sekolah', 'Profil Sekolah'],
      ['', '/profil-sekolah/guru', 'Profil Guru'],
      ['?from=https://example.com', '/profil-sekolah/guru', 'Profil Guru'],
    ]) {
      const markup = renderToStaticMarkup(createElement(MemoryRouter, { initialEntries: [`/profil-sekolah/guru/${guru.slug}${query}`] },
        createElement(Routes, null, createElement(Route, { path: '/profil-sekolah/guru/:slug', element: createElement(DetailPelengkapPage, { jenis: 'guru' }) }))));
      assert.ok(markup.includes(`href="${target}"`) && markup.includes(`Kembali ke ${label}`), `${guru.title}: tombol kembali harus mengikuti asal yang dikenal.`);
    }
  }
  const { default: GuruSection } = await server.ssrLoadModule('/src/components/tentang/TentangKepalaSekolahSection.jsx');
  assert.equal((render(GuruSection, {}).match(/\?from=profil-sekolah/g) || []).length, 4, 'Semua kartu guru pada Profil Sekolah membawa penanda asal.');

  console.log('Lulus: pagination pengumuman (5 item), navigasi guru, empat proyek tanpa indikator, deduplikasi, informasi hari ini, tombol sumber, maksimal tiga prestasi, dan timeline.');
} finally {
  await server.close();
}
