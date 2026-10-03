import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Reveal from '../components/Reveal';
import HalamanHeader from '../components/HalamanHeader';
import PublicDataState from '../components/PublicDataState';
import CTASection from '../components/CTASection';

import PengumumanPopulerCard from '../components/pengumuman/PengumumanPopulerCard';
import PengumumanDaftarSection from '../components/pengumuman/PengumumanDaftarSection';
import PengumumanTimelineSection from '../components/pengumuman/PengumumanTimelineSection';
import PengumumanPpdbSection from '../components/pengumuman/PengumumanPpdbSection';
import BeritaSorotSection from '../components/berita/BeritaSorotSection';
import BeritaAgendaSection from '../components/berita/BeritaAgendaSection';
import PrestasiGaleriSection from '../components/prestasi/PrestasiGaleriSection';

import { getPublishedPengumuman } from '../services/pengumumanService';
import { getPublishedBerita } from '../services/beritaService';
import { getPrestasi } from '../services/prestasiService';
import { toPengumumanItem, toBeritaItem, toPrestasiItem } from '../utils/publicContent';

// Halaman "Lihat Semua" untuk tujuh tombol yang sebelumnya buntu.
//
// Bug-nya: tombol seperti "Lihat Semua" pada Pengumuman Populer menuju
// /pengumuman/populer, padahal rute itu tidak pernah didaftarkan. Yang cocok
// justru /pengumuman/:slug, sehingga "populer" diperlakukan sebagai slug
// artikel, dicari di database, tidak ketemu -- dan layar tampak kosong.
// Persis itu yang terlihat di video.
//
// Ketujuhnya cuma butuh kerangka yang sama: kepala halaman, lalu section yang
// SUDAH ada di halaman induknya. Membuat tujuh berkas yang hanya berbeda nama
// komponennya cuma menggandakan kode, jadi jenisnya dioper lewat prop dari
// definisi route -- pola yang sama dengan DetailPelengkapPage.
const AMBIL = {
  pengumuman: { fn: getPublishedPengumuman, map: toPengumumanItem, label: 'pengumuman' },
  berita: { fn: getPublishedBerita, map: toBeritaItem, label: 'berita' },
  prestasi: { fn: getPrestasi, map: toPrestasiItem, label: 'prestasi' },
};

const KOLEKSI = {
  'pengumuman-populer': {
    eyebrow: 'Pengumuman',
    title: 'Pengumuman Terbaru',
    deskripsi: 'Pengumuman resmi sekolah yang terbaru, diurutkan berdasarkan tanggal.',
    Section: PengumumanPopulerCard,
    sumber: 'pengumuman',
    kembali: { to: '/pengumuman', label: 'Pengumuman' },
  },
  'pengumuman-semua': {
    eyebrow: 'Pengumuman',
    title: 'Semua Pengumuman',
    deskripsi: 'Seluruh pengumuman resmi sekolah, dari yang terbaru sampai yang terlama.',
    Section: PengumumanDaftarSection,
    sumber: 'pengumuman',
    kembali: { to: '/pengumuman', label: 'Pengumuman' },
  },
  'pengumuman-timeline': {
    eyebrow: 'Pengumuman',
    title: 'Timeline Pengumuman',
    deskripsi: 'Seluruh pengumuman yang sudah diterbitkan, disusun berdasarkan tanggal pengumuman.',
    Section: PengumumanTimelineSection,
    sumber: 'pengumuman',
    kembali: { to: '/pengumuman', label: 'Pengumuman' },
  },
  'pengumuman-informasi-penting': {
    eyebrow: 'Pengumuman',
    title: 'Informasi Penting',
    deskripsi: 'Hal-hal yang perlu segera diketahui calon siswa, siswa, dan orang tua.',
    Section: PengumumanPpdbSection,
    sumber: 'pengumuman',
    kembali: { to: '/pengumuman', label: 'Pengumuman' },
  },
  'berita-trending': {
    eyebrow: 'Berita',
    title: 'Berita Trending',
    deskripsi: 'Berita sekolah yang paling banyak dibaca belakangan ini.',
    Section: BeritaSorotSection,
    sumber: 'berita',
    kembali: { to: '/berita', label: 'Berita' },
  },
  'berita-agenda': {
    eyebrow: 'Berita',
    title: 'Kategori Berita',
    deskripsi: 'Kategori dan dokumentasi dari berita sekolah yang sudah diterbitkan.',
    Section: BeritaAgendaSection,
    sumber: 'berita',
    kembali: { to: '/berita', label: 'Berita' },
  },
  'prestasi-galeri': {
    eyebrow: 'Prestasi',
    title: 'Galeri Prestasi',
    deskripsi: 'Dokumentasi penghargaan dan kejuaraan yang diraih siswa SMK Telkom Purwokerto.',
    Section: PrestasiGaleriSection,
    sumber: 'prestasi',
    kembali: { to: '/prestasi', label: 'Prestasi' },
  },
};

const KoleksiPage = ({ jenis }) => {
  const { t } = useLanguage();

  const koleksi = KOLEKSI[jenis];
  const ambil = koleksi?.sumber ? AMBIL[koleksi.sumber] : null;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(Boolean(ambil));
  const [error, setError] = useState('');
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    if (!ambil) return undefined;
    let active = true;
    ambil
      .fn()
      .then((rows) => active && setItems(rows.map(ambil.map)))
      .catch(() => active && setError(`Data ${ambil.label} belum dapat dimuat. Silakan coba lagi nanti.`))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // ambil berasal dari registry statis dan tidak pernah berubah selama
    // komponen terpasang; jenis-lah yang menentukannya.
  }, [ambil, requestVersion]);

  if (!koleksi) return null;

  const { Section } = koleksi;

  return (
    <MainLayout>
      <HalamanHeader
        eyebrow={koleksi.eyebrow}
        title={koleksi.title}
        deskripsi={koleksi.deskripsi}
        aksi={
          <Link
            to={koleksi.kembali.to}
            className="inline-flex items-center gap-2 rounded-full border border-dark-200 bg-white px-5 py-2.5 text-xs font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('Kembali ke {label}', { label: t(koleksi.kembali.label) })}
          </Link>
        }
      />

      {ambil && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PublicDataState
            loading={loading}
            error={error}
            empty={!loading && !error && items.length === 0}
            onRetry={() => { setLoading(true); setError(''); setRequestVersion((value) => value + 1); }}
            label={ambil.label}
          />
        </div>
      )}

      {/* tampilkanLihatSemua dimatikan: di halaman ini, tombol "Lihat Semua"
          milik section menunjuk ke halaman yang sedang dibuka -- diklik, tidak
          ke mana-mana. Tombol kembali sudah tersedia di kepala halaman. */}
      <Reveal>
        {ambil ? (
          <Section items={items} loading={loading} error={error} tampilkanLihatSemua={false} />
        ) : (
          <Section tampilkanLihatSemua={false} />
        )}
      </Reveal>
      <Reveal>
        <CTASection />
      </Reveal>
    </MainLayout>
  );
};

export default KoleksiPage;
