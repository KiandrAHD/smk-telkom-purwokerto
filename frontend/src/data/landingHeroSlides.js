import { ctaMasukPpdb, heroData, jurusanHero, landingHero, prestasiHero } from './dummyData';
import facilities640 from '../assets/fasilitas/hero-640.webp';
import facilities960 from '../assets/fasilitas/hero-960.webp';
import facilities from '../assets/fasilitas/hero-1144.webp';
import facilitiesLogo from '../assets/fasilitas/hero-logo.png';
import departments from '../assets/drive/jurusan-hero-students.jpeg';
import achievements640 from '../assets/banners/prestasi-640.webp';
import achievements960 from '../assets/banners/prestasi-960.webp';
import profileEnglish from '../assets/tentang/profil-hero-en.jpeg';

// Each entry uses existing school copy, artwork, and routes; the opening slide stays unchanged.
export const landingHeroSlides = [
  { id: 'beranda', name: 'Beranda', content: landingHero },
  {
    id: 'fasilitas', name: 'Fasilitas Sekolah',
    content: {
      title: 'Fasilitas Modern', titleAccent: 'Berstandar Industri',
      description: 'Jelajahi ruang kelas, laboratorium, dan perpustakaan SMK Telkom Purwokerto.',
      primaryCta: { label: 'Lihat Fasilitas', href: '/fasilitas' }, secondaryCta: ctaMasukPpdb,
    },
    media: { src: facilities, srcSet: `${facilities640} 640w, ${facilities960} 960w, ${facilities} 1144w`, width: 1144, height: 679, logo: facilitiesLogo, composition: 'facilities', alt: 'Kolase ruang kelas dan laboratorium SMK Telkom Purwokerto' },
  },
  {
    id: 'jurusan', name: 'Jurusan',
    content: { ...jurusanHero, primaryCta: { label: 'Lihat Jurusan', href: '/jurusan' }, secondaryCta: ctaMasukPpdb },
    media: { src: departments, width: 2300, height: 1080, composition: 'departments', alt: 'Siswa SMK Telkom Purwokerto' },
  },
  {
    id: 'prestasi', name: 'Prestasi',
    content: { ...prestasiHero, title: 'Prestasi', titleAccent: 'Membanggakan', primaryCta: { label: prestasiHero.ctaText, href: '/prestasi' }, secondaryCta: ctaMasukPpdb },
    media: { src: prestasiHero.image, srcSet: `${achievements640} 640w, ${achievements960} 960w, ${prestasiHero.image} 1106w`, width: 1106, height: 656, composition: 'achievements', alt: prestasiHero.imageAlt },
  },
  {
    id: 'profil', name: 'Profil Sekolah',
    content: { title: 'Profil Sekolah', titleAccent: 'SMK Telkom Purwokerto', description: heroData.description, primaryCta: { label: 'Lihat Profil Sekolah', href: '/profil-sekolah' }, secondaryCta: ctaMasukPpdb },
    media: { src: heroData.image, srcEn: profileEnglish, width: 1600, height: 751, composition: 'school', alt: 'Gedung SMK Telkom Purwokerto' },
  },
];
