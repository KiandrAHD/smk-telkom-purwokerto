import HeroCarousel from './HeroCarousel';
import { pageHeroSlides } from '../data/pageHeroSlides';

export default function PageHeroCarousel({ page, children, slides = pageHeroSlides[page] }) {
  const names = { jurusan: 'Jurusan', fasilitas: 'Fasilitas Sekolah', profil: 'Profil Sekolah', prestasi: 'Prestasi', bkk: 'BKK', berita: 'Berita', pengumuman: 'Pengumuman', guru: 'Profil Guru', ekstrakurikuler: 'Ekstrakurikuler', kalender: 'Kalender Kegiatan', spmb: 'SPMB' };
  return <HeroCarousel page={page} slides={[{ id: page, name: names[page] || page }, ...slides]} opening={children} />;
}
