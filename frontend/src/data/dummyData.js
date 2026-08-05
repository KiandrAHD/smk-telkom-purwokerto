import schoolBuildingImg from '../assets/tentang/school-building.png';
import kepalaSekolahImg from '../assets/tentang/kepala-sekolah.png';
import guruGroupImg from '../assets/tentang/guru-group.png';
import labKomputerImg from '../assets/tentang/lab-komputer.png';
import labJaringanImg from '../assets/tentang/lab-komputer.png';
import studioMultimediaImg from '../assets/tentang/studio-multimedia.png';
import perpustakaanImg from '../assets/tentang/perpustakaan.png';

// ── Hero Section ──
export const heroData = {
  breadcrumb: [
    { label: 'Beranda', href: '/' },
    { label: 'Profil Sekolah', href: '/tentang' },
  ],
  heading: 'Discover\nthe Place',
  headingAccent: 'Where Future\nInnovators Grow.',
  description:
    'SMK Telkom Purwokerto, sekolah vokasi berbasis teknologi yang mencetak generasi digital berkarakter, kompeten, dan siap bersaing di dunia industri global.',
  ctaText: 'Explore School',
  image: schoolBuildingImg,
  hashtag: '#DigitalSmartSchool',
  badges: [
    {
      title: 'Berinovasi',
      desc: 'Inovasi tanpa henti',
      color: 'bg-red-50 text-red-700',
    },
    {
      title: 'Berkolaborasi',
      desc: 'Kuat bersama industri',
      color: 'bg-red-50 text-red-700',
    },
    {
      title: 'Berkarya',
      desc: 'Membangun masa depan',
      color: 'bg-red-50 text-red-700',
    },
  ],
};

// ── Stats Section ──
export const aboutStats = [
  { value: '2.200+', label: 'Siswa Aktif', icon: 'users' },
  { value: '40+', label: 'Tenaga Pendidik', icon: 'graduationCap' },
  { value: '120+', label: 'Mitra Industri', icon: 'building' },
  { value: '98%', label: 'Lulusan Bekerja', icon: 'briefcase' },
];

// ── About Description Section ──
export const aboutDescription = {
  title: 'Tentang\nSMK Telkom Purwokerto',
  text: 'SMK Telkom Purwokerto merupakan sekolah vokasi di bawah naungan Yayasan Pendidikan Telkom yang berfokus pada bidang teknologi informasi, jaringan, dan telekomunikasi. Kami berkomitmen untuk menghasilkan pendidikan berkualitas yang relevan dengan dunia industri dan perkembangan teknologi.',
  ctaText: 'Selengkapnya',
  videoLabel: 'Play Video',
  videoSublabel: 'Profil Sekolah',
};

// ── Visi & Misi ──
export const visiMisi = {
  visi: 'Menjadi sekolah vokasi teknologi yang unggul secara akademik, berkarakter, dan berdaya saing global.',
  misi: 'Menyelenggarakan pendidikan vokasi bermutu, mengembangkan potensi didik, serta menjadikan kerja sama strategis dengan dunia industri.',
};

// ── Nilai-Nilai Stematel ──
export const nilaiStematel = [
  {
    icon: 'lightbulb',
    title: 'Innovation',
    desc: 'Selalu berinovasi, menghadapi dan menciptakan perubahan.',
  },
  {
    icon: 'shield',
    title: 'Character',
    desc: 'Berkarakter kuat, jujur, dan bertanggung jawab.',
  },
  {
    icon: 'cpu',
    title: 'Technology',
    desc: 'Menguasai teknologi dan siap menghadapi masa depan.',
  },
  {
    icon: 'handshake',
    title: 'Collaboration',
    desc: 'Berkolaborasi untuk menciptakan kebersamaan.',
  },
];

// ── Timeline ──
export const timelineData = [
  {
    year: '2012',
    title: 'Sekolah Berdiri',
    desc: 'SMK Telkom Purwokerto didirikan di Purwokerto.',
  },
  {
    year: '2016',
    title: 'Akreditasi A',
    desc: 'Terakreditasi A dengan standar mutu nasional.',
  },
  {
    year: '2020',
    title: 'Kerja Sama Industri',
    desc: 'Memperluas kolaborasi dan berbagai mitra industri terkemuka.',
  },
  {
    year: '2023',
    title: 'Digital Smart School',
    desc: 'Transformasi digital dalam pembelajaran dan manajemen sekolah.',
  },
  {
    year: '2025',
    title: 'AI & Future Ready',
    desc: 'Berfokus pada AI, IoT, dan teknologi masa depan untuk generasi mendatang.',
  },
];

// ── Kepala Sekolah ──
export const kepalaSekolah = {
  name: 'Agus Priyanto, S.T., M.M.',
  title: 'Kepala SMK Telkom Purwokerto',
  image: kepalaSekolahImg,
  quote:
    'Kami berkomitmen untuk mencetak generasi yang tidak hanya cerdas secara akademik, tetapi juga berkarakter kuat, berkompeten, dan siap bersaing di era digital global.',
  ctaText: 'Sambutan Lengkap',
};

// ── Guru & Tenaga Pendidik ──
export const guruData = [
  {
    name: 'Dwi Putra, S.Kom.',
    position: 'Kepala Program RPL',
    image: guruGroupImg,
    linkedin: '#',
    email: 'dwi@smktelkom.sch.id',
  },
  {
    name: 'Rina Yuliani, S.T.',
    position: 'Guru Produktif TJA',
    image: guruGroupImg,
    linkedin: '#',
    email: 'rina@smktelkom.sch.id',
  },
  {
    name: 'Andi Setiawan, S.Kom.',
    position: 'Guru TKJ',
    image: guruGroupImg,
    linkedin: '#',
    email: 'andi@smktelkom.sch.id',
  },
  {
    name: 'Putri Lestari, S.T.',
    position: 'Guru TJT',
    image: guruGroupImg,
    linkedin: '#',
    email: 'putri@smktelkom.sch.id',
  },
];

// ── Fasilitas ──
export const fasilitasData = [
  {
    name: 'Laboratorium Komputer',
    image: labKomputerImg,
  },
  {
    name: 'Laboratorium Jaringan',
    image: labJaringanImg,
  },
  {
    name: 'Studio Multimedia',
    image: studioMultimediaImg,
  },
  {
    name: 'Perpustakaan Digital',
    image: perpustakaanImg,
  },
  {
    name: 'Masjid Al-Ikhlas',
    image: schoolBuildingImg,
  },
  {
    name: 'Lapangan Olahraga',
    image: schoolBuildingImg,
  },
];

// ── Footer Data (shared) ──
export const footerData = {
  menu: [
    { label: 'Tentang', href: '/tentang' },
    { label: 'Jurusan', href: '/#jurusan' },
    { label: 'Prestasi', href: '/#prestasi' },
    { label: 'BKK', href: '/#bkk' },
  ],
  informasi: [
    { label: 'Berita', href: '#' },
    { label: 'Pengumuman', href: '#' },
    { label: 'PPDB', href: '#' },
    { label: 'Galeri', href: '#' },
  ],
  kontak: {
    address: 'Jl. DI Panjaitan No 128, Purwokerto',
    phone: '(0281) 641029',
    email: 'info@smktelkom-pwt.sch.id',
  },
};
