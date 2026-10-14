import { jurusanData, heroData, prestasiHero, videoHighlight, bkkHero, jalurKarier, beritaHero, pengumumanHero, ekstrakurikulerData } from './dummyData';
import { fasilitasData } from './fasilitasData';
import campus from '../assets/fasilitas/campus/campus-map.webp';
import profileEnglish from '../assets/tentang/profil-hero-en.jpeg';

const slide = (id, title, accent, description, href, label, media) => ({
  id, name: title,
  content: { title, titleAccent: accent, description, primaryCta: { href, label } }, media,
});
const photo = (src, alt) => ({ src, alt, photo: true, composition: 'photo' });
const facility = id => {
  const item = fasilitasData.find(entry => entry.id === id);
  return slide(id, item.name, '', item.preview, `/fasilitas?kategori=${encodeURIComponent(item.category)}#fasilitas-${id === 'perpustakaan' ? 'perpustakaan' : 'lab'}`, 'Lihat Fasilitas', photo(item.image, item.name));
};
const calendar = slide('kalender', 'Kalender', 'Kegiatan Sekolah', 'Temukan jadwal kegiatan, lomba, dan acara terbaru di SMK Telkom Purwokerto.', '/kalender', 'Lihat Event', { src: beritaHero.image, composition: 'news', width: 1106, height: 656, alt: beritaHero.imageAlt });
const announcements = slide('pengumuman', pengumumanHero.heading, pengumumanHero.headingAccent, pengumumanHero.description, '/pengumuman', 'Pengumuman', { src: pengumumanHero.image, composition: 'announcement', width: 1600, height: 751, alt: 'Pengumuman sekolah' });
const profile = slide('profil', heroData.heading, heroData.headingAccent, heroData.description, '/profil-sekolah', 'Lihat Profil Sekolah', { src: heroData.image, srcEn: profileEnglish, composition: 'school', width: 1600, height: 751, alt: 'Gedung SMK Telkom Purwokerto' });

// Context-specific additions. The opening panel stays in its page, including its live controls.
export const pageHeroSlides = {
  jurusan: jurusanData.items.map(item => ({ ...slide(item.slug, 'Jurusan', item.slug.toUpperCase(), item.desc, `/jurusan/${item.slug}`, 'Selengkapnya', photo(item.image, item.name)), name: item.name })),
  fasilitas: [facility('lab-komputer'), facility('perpustakaan')],
  profil: [slide('tour', 'School Tour', 'Menjelajahi Stematel', 'Jelajahi ruang kelas, laboratorium, dan perpustakaan SMK Telkom Purwokerto.', '/fasilitas#school-tour', 'Jelajahi Sekarang', photo(campus, 'Peta sekolah'))],
  prestasi: [slide('video', 'Video Highlight', 'Karya Siswa', videoHighlight.videoDesc, '/prestasi#prestasi-video-title', 'Lihat Video', photo(videoHighlight.video.poster, videoHighlight.videoTitle))],
  bkk: [slide('karier', jalurKarier.title, '', bkkHero.description, '/bkk#jalur-karier', jalurKarier.ctaText, photo(jurusanData.items[0].image, jurusanData.items[0].name))],
  berita: [calendar, slide('prestasi', 'Prestasi', 'Membanggakan', prestasiHero.description, '/prestasi', 'Lihat Prestasi', { src: prestasiHero.image, width: 1106, height: 656, composition: 'achievements', alt: prestasiHero.imageAlt })],
  pengumuman: [calendar],
  guru: [profile],
  ekstrakurikuler: [slide('osis', ekstrakurikulerData.items[0].title, '', ekstrakurikulerData.items[0].description, '/ekstrakurikuler#daftar-ekstrakurikuler', 'Lihat Kegiatan', photo(ekstrakurikulerData.items[0].image, ekstrakurikulerData.items[0].title))],
  kalender: [announcements],
  spmb: [slide('jurusan', 'Pilihan Jurusan', 'Empat Jurusan, Banyak Peluang', 'Pilih jurusan yang sesuai dengan minat dan bakatmu. Bangun masa depanmu bersama teknologi.', '/jurusan', 'Lihat Jurusan', photo(jurusanData.items[1].image, jurusanData.items[1].name))],
};
