import { useParams, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import DetailLayout from '../components/DetailLayout';
import SegeraHadirPage from './SegeraHadirPage';
import {
  agendaDetail,
  galeriDetail,
  guruDetail,
  panduanDetail,
  pklDetailLengkap,
  projectDetail,
  roadmapDetail,
} from '../data/dummyData';

// Tujuh jenis halaman detail pelengkap (agenda, galeri, panduan, PKL, roadmap,
// projek, guru) memakai kerangka yang sama persis: cari item berdasarkan slug,
// lalu serahkan ke DetailLayout. Membuat tujuh berkas yang hanya berbeda pada
// nama array-nya cuma menggandakan kode, jadi jenisnya dioper lewat prop dari
// definisi route.
//
// Halaman detail kategori utama (Jurusan, Prestasi, Berita, Pengumuman) tetap
// punya berkasnya sendiri karena masing-masing sudah punya isi tambahan yang
// berbeda-beda.
const KOLEKSI = {
  agenda: { data: agendaDetail, backTo: '/berita', backLabel: 'Berita' },
  galeri: { data: galeriDetail, backTo: '/galeri', backLabel: 'Galeri' },
  panduan: { data: panduanDetail, backTo: '/bkk/panduan', backLabel: 'Panduan Karier' },
  pkl: { data: pklDetailLengkap, backTo: '/bkk', backLabel: 'BKK' },
  roadmap: { data: roadmapDetail, backTo: '/bkk', backLabel: 'BKK' },
  project: { data: projectDetail, backTo: '/jurusan', backLabel: 'Jurusan' },
  guru: { data: guruDetail, backTo: '/profil-sekolah/guru', backLabel: 'Profil Guru' },
};

const DetailPelengkapPage = ({ jenis, data, translations }) => {
  const { t: translate, language } = useLanguage();
  const t = (text, variables) => translate(language === 'en' ? translations?.[text] ?? text : text, variables);
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const koleksi = KOLEKSI[jenis];
  const item = (data || koleksi?.data)?.find((entri) => entri.slug === slug);

  if (!item) return <SegeraHadirPage />;

  const displayItem = {
    ...item,
    title: t(item.title),
    kategori: t(item.kategori),
    subtitle: t(item.subtitle),
    date: t(item.date),
    imageAlt: jenis === 'guru' ? t('Foto {name}', { name: item.title }) : t(item.imageAlt),
    imageNote: t(item.imageNote),
    lead: t(item.lead),
    body: item.body.map((paragraph) => t(paragraph)),
    facts: item.facts?.map((fact) => ({ ...fact, label: t(fact.label), value: t(fact.value) })),
    video: item.video && { ...item.video, title: t(item.video.title), desc: t(item.video.desc) },
  };
  const kembaliKeBerita = jenis === 'galeri' && searchParams.get('from') === 'berita';
  const kembaliKeProfilSekolah = jenis === 'guru' && searchParams.get('from') === 'profil-sekolah';
  const backTo = kembaliKeProfilSekolah ? '/profil-sekolah' : kembaliKeBerita ? '/berita' : koleksi.backTo;
  const backLabel = kembaliKeProfilSekolah ? 'Profil Sekolah' : kembaliKeBerita ? 'Berita' : koleksi.backLabel;
  return <DetailLayout item={displayItem} backTo={backTo} backLabel={t(backLabel)} />;
};

export default DetailPelengkapPage;
