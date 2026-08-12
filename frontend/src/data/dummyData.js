
import heroPanel from '../assets/landing/hero-panel.jpg';
import aboutVideo from '../assets/landing/about-video.png';
import jurusanRpl from '../assets/landing/jurusan-rpl.jpg';
import jurusanPg from '../assets/landing/jurusan-pg.jpg';
import jurusanTkj from '../assets/landing/jurusan-tkj.jpg';
import jurusanTjat from '../assets/landing/jurusan-tjat.jpg';
import prestasi1 from '../assets/landing/prestasi-1.jpg';
import prestasi2 from '../assets/landing/prestasi-2.jpg';
import prestasi3 from '../assets/landing/prestasi-3.jpg';
import prestasi4 from '../assets/landing/prestasi-4.jpg';
import mapImg from '../assets/landing/map.jpg';

import heroJurusan from '../assets/jurusan/hero-jurusan.jpg';

import logoTelkomColor from '../assets/bkk/logo-telkom.png';
import logoHuaweiColor from '../assets/bkk/logo-huawei.png';
import logoAgate from '../assets/bkk/logo-agate.png';
import logoDicodingColor from '../assets/bkk/logo-dicoding.png';
import stelaMascot from '../assets/bkk/stela-mascot.png';
import showcaseRpl from '../assets/jurusan/showcase-rpl.jpg';
import showcasePg from '../assets/jurusan/showcase-pg.jpg';
import showcaseTkj from '../assets/jurusan/showcase-tkj.jpg';
import showcaseTjat from '../assets/jurusan/showcase-tjat.jpg';

import profilHero from '../assets/tentang/profil-hero.jpg';
import profilKepsek from '../assets/tentang/profil-kepsek.png';
import guru1 from '../assets/tentang/guru-1.png';
import guru2 from '../assets/tentang/guru-2.png';
import guru3 from '../assets/tentang/guru-3.png';
import guru4 from '../assets/tentang/guru-4.png';

import logoTelkom from '../assets/landing/logo-telkom.png';
import logoHuawei from '../assets/landing/logo-huawei.png';
import logoAstra from '../assets/landing/logo-astra.png';
import logoMicrosoft from '../assets/landing/logo-microsoft.png';
import logoCisco from '../assets/landing/logo-cisco.png';
import logoAws from '../assets/landing/logo-aws.png';
import logoDicoding from '../assets/landing/logo-dicoding.png';

/* =========================================================
   LANDING PAGE (Beranda)
   ========================================================= */

// ── Navigasi ──
export const navLinks = [
  { label: 'Tentang', href: '/tentang', isRoute: true },
  { label: 'Jurusan', href: '/jurusan', isRoute: true },
  { label: 'Prestasi', href: '/prestasi', isRoute: true },
  { label: 'BKK', href: '/bkk', isRoute: true },
  { label: 'Berita', href: '/berita', isRoute: true },
  { label: 'Pengumuman', href: '#pengumuman' },
];

// ── Hero Beranda ──
export const landingHero = {
  breadcrumb: [
    { label: 'Beranda', href: '/' },
    { label: 'Profil Sekolah', href: '/tentang' },
  ],
  hashtag: '#DigitalSmartSchool',
  title: 'Bangun Masa Depanmu',
  titleAccent: 'Bersama Teknologi',
  description:
    'SMK Telkom Purwokerto mencetak generasi digital yang siap bersaing di dunia industri melalui pembelajaran berbasis teknologi, kreativitas, dan karakter',
  primaryCta: { label: 'Masuk PPDB', href: '#ppdb' },
  secondaryCta: { label: 'Lihat Jurusan', href: '#jurusan' },
  // Panel merah + foto + watermark "TELKOM" sudah menyatu jadi satu aset dari Figma.
  image: heroPanel,
};

// ── Kartu akses cepat di bawah hero ──
export const quickLinks = [
  {
    icon: 'userPlus',
    title: 'PPDB',
    desc: 'Informasi pendaftaran siswa baru tahun ajaran 2026/2027',
    linkLabel: 'Daftar Sekarang',
    href: '#ppdb',
  },
  {
    icon: 'monitor',
    title: 'Jurusan',
    desc: 'Pilihan jurusan sesuai minat dan bakatmu',
    linkLabel: 'Lihat Jurusan',
    href: '#jurusan',
  },
  {
    icon: 'briefcase',
    title: 'BKK',
    desc: 'Info lowongan kerja, PKL dan career center',
    linkLabel: 'Kunjungi BKK',
    href: '#bkk',
  },
  {
    icon: 'bot',
    title: 'STELA AI',
    desc: 'Tanya aja tentang SMK Telkom Purwokerto',
    linkLabel: 'Tanya STELA',
    href: '#stela',
  },
];

// ── Section Tentang (Beranda) ──
export const landingAbout = {
  title: 'Tentang SMK Telkom Purwokerto',
  description:
    'Kami adalah sekolah vokasi teknologi informasi dan komunikasi yang berfokus pada pengembangan kompetensi, karakter, dan inovasi untuk menghasilkan lulusan yang siap kerja dan siap berwirausaha',
  image: aboutVideo,
  badges: [
    { title: 'Akreditasi A', desc: 'BAN – SMK' },
    { title: 'Fasilitas Modern', desc: 'Berstandar Industri' },
    { title: 'Guru Kompeten', desc: 'Sertifikasi Industri' },
    { title: 'Kurikulum Industri', desc: 'Berbasis Project' },
  ],
  ctaText: 'Pelajari Selengkapnya',
};

// ── Pilihan Jurusan ──
export const jurusanData = {
  eyebrow: 'Pilihan Jurusan',
  title: 'Empat Jurusan, Banyak Peluang',
  ctaText: 'Lihat Semua Jurusan',
  items: [
    {
      icon: 'code',
      name: 'Rekayasa Perangkat Lunak (RPL)',
      desc: 'Menguasai pengembangan aplikasi, web, mobile, dan sistem informasi berbasis teknologi terkini.',
      image: jurusanRpl,
      href: '#jurusan',
    },
    {
      icon: 'gamepad',
      name: 'Pengembangan Game (PG)',
      desc: 'Belajar design game, pemrograman, dan produksi game hingga menjadi game developer profesional.',
      image: jurusanPg,
      href: '#jurusan',
    },
    {
      icon: 'network',
      name: 'Teknik Komputer dan Jaringan (TKJ)',
      desc: 'Mempelajari instalasi, konfigurasi, dan manajemen jaringan komputer dan server secara profesional.',
      image: jurusanTkj,
      href: '#jurusan',
    },
    {
      icon: 'tower',
      name: 'Teknik Jaringan Akses Telekomunikasi (TJAT)',
      desc: 'Menguasai teknologi jaringan akses telekomunikasi dan infrastruktur jaringan modern.',
      image: jurusanTjat,
      href: '#jurusan',
    },
  ],
};

// ── Mitra Industri ──
export const mitraIndustri = [
  { name: 'Telkom Indonesia', logo: logoTelkom, size: 'h-8 lg:h-10' },
  { name: 'Huawei', logo: logoHuawei, size: 'h-5 lg:h-7' },
  { name: 'Astra', logo: logoAstra, size: 'h-5 lg:h-7' },
  { name: 'Microsoft', logo: logoMicrosoft, size: 'h-5 lg:h-7' },
  { name: 'Cisco', logo: logoCisco, size: 'h-6 lg:h-8' },
  { name: 'AWS', logo: logoAws, size: 'h-6 lg:h-8' },
  { name: 'Dicoding', logo: logoDicoding, size: 'h-5 lg:h-7' },
];

// ── Prestasi ──
export const prestasiData = {
  title: 'Prestasi Membanggakan',
  subtitle: 'Bukti nyata dari semangat dan kerja\nkeras siswa kami',
  items: [
    { title: 'Juara 1\nLKS Nasional 2024', category: 'Web Technologies', image: prestasi1 },
    { title: 'Gold Medal\nIDSEEC 2024', category: 'Network Security', image: prestasi2 },
    { title: 'Juara 2\nGemastik 2024', category: 'Game Development', image: prestasi3 },
    { title: 'Juara 1\nIoT Challenge 2024', category: 'Smart Agriculture', image: prestasi4 },
  ],
};

// ── STELA AI ──
export const stelaData = {
  title: 'Tanyakan apa saja\nke STELA',
  description:
    'STELA (Stematel Learning Asistant) siap menjawab pertanyaanmu tentang jurusan, fasilitas, prestasi, PPDB, dan informasi lainnya seputar SMK Telkom Purwokerto',
  ctaText: 'Tanya STELA Sekarang',
  chats: [
    {
      from: 'user',
      text: 'Apa Jurusan yang cocok untuk saya yang suka ngoding dan membuat aplikasi?',
    },
    {
      from: 'bot',
      text: 'Kalau kamu suka ngoding dan membuat aplikasi, saya rekomendasikan jurusan Rekayasa Perangkat Lunak (RPL). Di jurusan ini kamu akan belajar pemrograman, pengembangan web, mobile, dan teknologi terbaru lainnya',
    },
  ],
};

// ── Banner CTA bawah ──
export const ctaBanner = {
  title: 'Sudah Menemukan Jurusan yang Tepat?',
  description: 'Daftarkan dirimu sekarang dan mulai langkah pertama menuju masa depanmu!',
  ctaText: 'Daftar PPDB Sekarang',
  href: '#ppdb',
};

/* =========================================================
   HALAMAN TENTANG
   ========================================================= */

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
  // Panel merah + foto gedung + pill hashtag + 3 poin keunggulan menyatu jadi satu aset Figma.
  image: profilHero,
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
  { value: '98%', label: 'Lulusan Industri', icon: 'briefcase' },
];

// ── About Description Section ──
export const aboutDescription = {
  title: 'Tentang\nSMK Telkom Purwokerto',
  text: 'SMK Telkom Purwokerto merupakan sekolah vokasi di bawah naungan Yayasan Pendidikan Telkom yang berfokus pada bidang teknologi informasi, jaringan, dan telekomunikasi. Kami berkomitmen untuk menghadirkan pendidikan berkualitas yang relevan dengan dunia industri dan perkembangan teknologi.',
  ctaText: 'Pelajari Selengkapnya',
};

// ── Visi & Misi ──
export const visiMisi = {
  visi: 'Menjadi sekolah vokasi berbasis teknologi yang unggul secara akademik, berkarakter, dan berdaya saing global.',
  misi: 'Menyelenggarakan pendidikan vokasi bermutu, mengembangkan potensi peserta didik, serta menjalin kerja sama strategis dengan dunia industri.',
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
    year: '2026',
    title: 'AI & Future Ready',
    desc: 'Berfokus pada AI, IoT, dan teknologi masa depan untuk generasi inovator.',
  },
];

// ── Kepala Sekolah ──
export const kepalaSekolah = {
  name: 'Aria Puji Santoso, S.Kom., M.M.',
  title: 'Kepala SMK Telkom Purwokerto',
  image: profilKepsek,
  quote:
    'Kami berkomitmen untuk mencetak generasi yang tidak hanya cerdas secara akademik, tetapi juga berkarakter kuat, berkompeten, dan siap bersaing di era digital global.',
  quoteFull:
    'Kami berkomitmen untuk mencetak generasi yang tidak hanya cerdas secara akademik, tetapi juga berkarakter kuat, berkompeten, dan siap bersaing di era digital global. Melalui kurikulum berbasis industri, pendampingan intensif, dan budaya belajar yang kolaboratif, kami menyiapkan setiap siswa agar mampu berinovasi, beradaptasi dengan perkembangan teknologi, serta memberi manfaat nyata bagi masyarakat.',
  ctaText: 'Sambutan Lengkap',
};

// ── Guru & Tenaga Pendidik ──
// CATATAN: di Figma keempat kartu ini memakai teks placeholder hasil salin dari section
// Prestasi ("Juara 1 / LKS Nasional 2024"), bukan nama guru. Ditiru apa adanya sesuai desain —
// tinggal ganti title/subtitle/category kalau data guru aslinya sudah ada.
export const guruData = [
  { title: 'Juara 1', subtitle: 'LKS Nasional 2024', category: 'Web Technologies', image: guru1 },
  { title: 'Juara 1', subtitle: 'LKS Nasional 2024', category: 'Network Security', image: guru2 },
  { title: 'Juara 1', subtitle: 'LKS Nasional 2024', category: 'Game Development', image: guru3 },
  { title: 'Juara 1', subtitle: 'LKS Nasional 2024', category: 'Smart Agriculture', image: guru4 },
  { title: 'Juara 2', subtitle: 'Gemastik 2024', category: 'Software Development', image: guru2 },
  { title: 'Gold Medal', subtitle: 'IDSEEC 2024', category: 'Cyber Security', image: guru4 },
  { title: 'Juara 1', subtitle: 'IoT Challenge 2024', category: 'Internet of Things', image: guru1 },
  { title: 'Juara 3', subtitle: 'LKS Provinsi 2024', category: 'Cloud Computing', image: guru3 },
];

// ── Footer Data (shared semua halaman) ──
export const footerData = {
  tagline:
    'Mencetak generasi digital yang kompeten, berkarakter, dan siap bersaing di era teknologi',
  menu: [
    { label: 'Tentang', href: '/tentang' },
    { label: 'Jurusan', href: '/#jurusan' },
    { label: 'Prestasi', href: '/#prestasi' },
    { label: 'BKK', href: '/#bkk' },
    { label: 'Berita', href: '/#berita' },
    { label: 'Pengumuman', href: '/#pengumuman' },
  ],
  informasi: [
    { label: 'Berita', href: '/#berita' },
    { label: 'Pengumuman', href: '/#pengumuman' },
    { label: 'PPDB', href: '/#ppdb' },
    { label: 'Galeri', href: '#' },
  ],
  kontak: {
    address: 'Jl.D I Panjaitan No.128 Purwokerto',
    phone: '(0281) 632138',
    email: 'info@smktelkom-pwt.sch.id',
  },
  socials: [
    { name: 'Instagram', icon: 'instagram', href: '#' },
    { name: 'YouTube', icon: 'youtube', href: '#' },
    { name: 'Facebook', icon: 'facebook', href: '#' },
    { name: 'TikTok', icon: 'tiktok', href: '#' },
  ],
  map: mapImg,
};

/* =========================================================
   HALAMAN JURUSAN
   ========================================================= */

export const jurusanHero = {
  badge: '#FindYourFuture',
  title: 'Temukan Jurusan',
  titleAccent: 'Pilihanmu',
  description:
    'Pilih jurusan yang sesuai dengan minat dan bakatmu. Bangun masa depanmu bersama teknologi.',
  ctaText: 'Explore Jurusan',
  image: heroJurusan,
};

export const jurusanStats = [
  { value: '4', label: 'Jurusan Unggulan' },
  { value: '120+', label: 'Mitra Industri' },
  { value: '98%', label: 'Lulusan Bekerja' },
  { value: '350+', label: 'Projek Siswa' },
];

// Tag dipakai ulang dari jurusanData (beranda) supaya deskripsi tidak kembar.
export const jurusanTags = ['AI', 'WEB', 'Mobile', 'Cloud'];

export const jurusanQuiz = {
  title: 'Belum Tahu Memilih Jurusan?',
  description:
    'Jawab 5 pertanyaan singkat dan biarkan STELA memberikan rekomendasi jurusan yang paling sesuai untukmu.',
  ctaText: 'Mulai Sekarang',
  resetText: 'Ulangi',
  resultLabel: 'Rekomendasi STELA',
  resultNote: 'Cocok dengan minatmu!',
  // Tiap opsi menambah skor ke satu jurusan; skor tertinggi jadi rekomendasi.
  options: [
    { text: 'Aku suka memecahkan masalah', scores: { RPL: 2, TKJ: 1 } },
    { text: 'Aku tertarik dengan teknologi dan komputer', scores: { TKJ: 2, TJAT: 1 } },
    { text: 'Aku ingin bekerja dibidang IT', scores: { RPL: 1, PG: 1, TKJ: 1, TJAT: 1 } },
  ],
  results: {
    RPL: { name: 'Rekayasa Perangkat Lunak (RPL)', cta: 'Lihat Detail RPL' },
    PG: { name: 'Pengembangan Game (PG)', cta: 'Lihat Detail PG' },
    TKJ: { name: 'Teknik Komputer dan Jaringan (TKJ)', cta: 'Lihat Detail TKJ' },
    TJAT: { name: 'Teknik Jaringan Akses Telekomunikasi (TJAT)', cta: 'Lihat Detail TJAT' },
  },
};

export const jurusanCompare = {
  title: 'Perbandingan',
  titleAccent: 'Jurusan',
  ctaText: 'Lihat Detail Semua Jurusan',
  columns: ['RPL', 'PG', 'TKJ', 'TJAT'],
  rows: [
    {
      aspek: 'Fokus Utama',
      type: 'text',
      values: [
        'Pengembangan aplikasi dan sistem',
        'Pengembangan dan produksi game',
        'Jaringan komputer dan server',
        'Jaringan akses telekomunikasi',
      ],
    },
    { aspek: 'Keterampilan', type: 'stars', values: [5, 4.5, 4, 2] },
    { aspek: 'Prospek Kerja', type: 'text', values: ['Sangat Luas', 'Luas', 'Luas', 'Luas'] },
    {
      aspek: 'Tingkat Kesulitan',
      type: 'badge',
      values: ['Menengah', 'Menengah', 'Menengah', 'Tinggi'],
    },
  ],
};

export const projectShowcase = {
  title: 'Project',
  titleAccent: 'Showcase',
  titleTail: 'Siswa',
  items: [
    { tag: 'RPL', tagClass: 'bg-primary', title: 'Sistem Informasi\nPerpustakaan', image: showcaseRpl },
    { tag: 'PG', tagClass: 'bg-purple-600', title: 'Game 2D\nAdventure', image: showcasePg },
    { tag: 'TKJ', tagClass: 'bg-blue-600', title: 'Server Monitoring\nSystem', image: showcaseTkj },
    { tag: 'TJAT', tagClass: 'bg-orange-500', title: 'Jaringan Fiber Optic\nSimulation', image: showcaseTjat },
  ],
};

export const jurusanFaq = {
  title: 'FAQ Tentang',
  titleAccent: 'Jurusan',
  ctaText: 'Lihat Semua FAQ',
  items: [
    {
      q: 'Apakah semua jurusan belajar coding?',
      a: 'Semua jurusan mendapat dasar pemrograman, tetapi porsinya berbeda. RPL dan PG paling banyak coding, sedangkan TKJ dan TJAT lebih banyak konfigurasi jaringan dan perangkat.',
    },
    {
      q: 'Apakah ada kesempatan magang?',
      a: 'Ada. Seluruh siswa menjalani Praktik Kerja Lapangan di mitra industri kami, dan penempatannya disesuaikan dengan jurusan masing-masing.',
    },
    {
      q: 'Apakah bisa lanjut ke jenjang lebih tinggi?',
      a: 'Bisa. Lulusan kami banyak yang melanjutkan ke perguruan tinggi, termasuk Telkom University, di samping yang langsung bekerja atau berwirausaha.',
    },
  ],
};

/* =========================================================
   HALAMAN PRESTASI
   ========================================================= */

export const prestasiHero = {
  badge: 'Prestasi Membanggakan',
  title: 'Setiap Prestasi',
  titleAccent: 'Adalah Bukti Nyata\nSemangat Berkarya',
  description:
    'Siswa SMK Telkom Purwokerto terus berinovasi, berkompetisi, dan mengharumkan nama sekolah di tingkat nasional hingga internasional.',
  ctaText: 'Lihat Prestasi',
  image: heroJurusan,
};

export const prestasiStats = [
  { value: '150+', label: 'Total Prestasi' },
  { value: '50+', label: 'Tingkat Nasional' },
  { value: '15+', label: 'Tingkat Internasional' },
  { value: '100+', label: 'Juara 1' },
];

export const prestasiUnggulan = {
  title: 'Preatasi Unggulan',
  ctaText: 'Baca Cerita Lengkap',
  items: [
    {
      level: 'Tingkat Nasional',
      title: 'Juara 1 LKS Nasional Bidang Web Technologies',
      desc: 'Tim SMK Telkom Purwokerto berhasil meraih Juara 1 dalam ajang Lomba Kompetensi Siswa (LKS) Nasional 2024 di bidang Web Technologies.',
    },
    {
      level: 'Internasional',
      title: 'Silver Medal – Huawei ITC Competition 2024',
      desc: 'Delegasi sekolah meraih Silver Medal pada Huawei ICT Competition 2024 setelah bersaing dengan peserta dari berbagai negara.',
    },
    {
      level: 'Nasional',
      title: 'Juara 2 Gemastik Game Development 2024',
      desc: 'Karya game orisinal siswa membawa pulang Juara 2 kategori Game Development pada ajang Gemastik 2024.',
    },
    {
      level: 'Nasional',
      title: 'Juara 1 IoT Challenge Telkom 2024',
      desc: 'Purwarupa smart agriculture berbasis IoT rancangan siswa dinobatkan sebagai juara pertama IoT Challenge Telkom 2024.',
    },
  ],
};

export const galeriPrestasi = {
  title: 'Galeri Pretasi',
  ctaText: 'Lihat Semua Prestasi',
  filters: ['Semua', 'Nasional', 'Interasional', 'LKS', 'Robotik', 'Programming', 'UI/UX', 'AI', 'Game'],
  items: [
    {
      level: 'Nasional',
      title: 'Juara 1 LKS Nasional 2024 Web Technologies',
      date: '20 Agustus 2024',
      year: 2024,
      tags: ['Nasional', 'LKS', 'Programming'],
      image: jurusanRpl,
    },
    {
      level: 'Interasional',
      title: 'Silver Medal Huawei ICT Competition 2024',
      date: '12 Juni 2024',
      year: 2024,
      tags: ['Interasional', 'Programming'],
      image: jurusanRpl,
    },
    {
      level: 'Nasional',
      title: 'Juara 2 Gemastik 2024 Game Development',
      date: '30 September 2024',
      year: 2024,
      tags: ['Nasional', 'Game'],
      image: jurusanRpl,
    },
    {
      level: 'Nasional',
      title: 'Juara 1 IoT Challenge Telkom 2024',
      date: '1 Oktober 2024',
      year: 2024,
      tags: ['Nasional', 'AI'],
      image: jurusanRpl,
    },
    {
      level: 'Interasional',
      title: 'Bronze Medal – Word Skills Asia 2024',
      date: '25 November 2024',
      year: 2024,
      tags: ['Interasional', 'Robotik', 'UI/UX'],
      image: jurusanRpl,
    },
  ],
};

export const perjalananPrestasi = {
  title: 'Perjalanan Prestasi',
  years: [
    { year: '2021', count: '12', label: 'Prestasi' },
    { year: '2022', count: '18', label: 'Prestasi' },
    { year: '2023', count: '25', label: 'Prestasi' },
    { year: '2024', count: '35', label: 'Prestasi' },
    { year: '2025', count: '40+', label: 'Prestasi' },
  ],
  defaultYear: '2024',
};

export const hallOfFame = {
  title: 'Hall of Fame',
  items: [
    {
      name: 'Muhammad Iqbal',
      achievement: 'Juara 1 LKS Nasional 2023 Web Technologies',
      role: 'Software Engineer',
      company: 'Tokopedia',
    },
    {
      name: 'Aisyah Nur Fadillah',
      achievement: 'Medal Emas WorldSkills Asia 2022',
      role: 'UI/UX Designer',
      company: 'Traveloka',
    },
    {
      name: 'Rizky Pratama',
      achievement: 'Juara 1 IoT Challenge Telkom 2023',
      role: 'IoT Engineer',
      company: 'Telkom Indonesia',
    },
    {
      name: 'Dewi Anggraini',
      achievement: 'Silver Medal Huawei ICT Competition 2023',
      role: 'Network Engineer',
      company: 'Huawei',
    },
    {
      name: 'Bagas Nugroho',
      achievement: 'Juara 2 Gemastik Game Development 2022',
      role: 'Game Developer',
      company: 'Agate',
    },
    {
      name: 'Salsabila Putri',
      achievement: 'Bronze Medal WorldSkills Asia 2023',
      role: 'Cloud Engineer',
      company: 'AWS',
    },
  ],
};

export const videoHighlight = {
  sectionTitle: 'Didukung  & Diakui Oleh',
  title: 'Video Highlight',
  videoTitle: 'Highlight Prestasi SMK Telkom Purwokerto\nTahun 2024',
  videoDesc: 'Perjalanan, kerja keras, dan moment terbaik siswa SMK Telkom Purwokerto',
};

/* =========================================================
   HALAMAN BKK
   ========================================================= */

// Di Figma hero BKK memakai teks yang sama persis dengan halaman Prestasi;
// hanya angka statistiknya yang berbeda.
export const bkkHero = { ...prestasiHero };

export const bkkStats = [
  { value: '250+', label: 'Lowongan Aktif' },
  { value: '120+', label: 'Mitra Industri' },
  { value: '95%', label: 'Penyiapan Alumni' },
  { value: '500+', label: 'Alumni bekerja' },
];

export const bkkSearch = {
  title: 'Temukan',
  titleAccent: 'Peluang',
  titleTail: 'Terbaik',
  ctaText: 'Cari Lowongan',
  placeholders: {
    keyword: 'Cari Posisi,Perusahaan, Atau Skill',
    lokasi: 'Lokasi',
    kategori: 'Kategori',
    tipe: 'Tipe Pekerjaan',
  },
  lokasiOptions: ['Purwokerto', 'Jakarta', 'Yogyakarta', 'Remote'],
  kategoriOptions: ['Programming', 'Networking', 'Game', 'AI'],
  tipeOptions: ['Full Time', 'Intership', 'Remote'],
  chips: [
    'Semua',
    'Nasional',
    'Interasional',
    'LKS',
    'Robotik',
    'Programming',
    'UI/UX',
    'AI',
    'Game',
    'Networking',
  ],
};

export const lowonganPopuler = {
  title: 'Lowongan Populer',
  ctaText: 'Lamar Sekarang',
  items: [
    {
      logo: logoTelkomColor,
      role: 'Software Enginer',
      company: 'PT Telkom Indonesia',
      location: 'Purwokerto, Jawa Tengah',
      badges: ['Full Time', 'Onsite'],
      salary: 'Rp 9 - 15 Juta',
      tags: ['Nasional', 'Programming'],
    },
    {
      logo: logoHuaweiColor,
      role: 'Network Enginer',
      company: 'Huawei Indonesia',
      location: 'Jakarta, Indonesia',
      badges: ['Full Time', 'Hybird'],
      salary: 'Rp 9 - 16 Juta',
      tags: ['Interasional', 'Networking'],
    },
    {
      logo: logoAgate,
      role: 'Game Developer',
      company: 'Agate Studio',
      location: 'Yogyakarta, Indonesia',
      badges: ['Intership', 'Onsite'],
      salary: 'Rp2 - 4 Juta',
      tags: ['Nasional', 'Game'],
    },
    {
      logo: logoDicodingColor,
      role: 'AI Research Intern',
      company: 'Dicoding Indonesia',
      location: 'Remote',
      badges: ['Internaship', 'Remote'],
      salary: 'Rp 2 - 3 Juta',
      tags: ['Nasional', 'AI'],
    },
  ],
};

export const pklData = {
  ctaText: 'Lamar Sekarang',
  items: [
    {
      logo: logoTelkomColor,
      role: 'PKL IT Support',
      company: 'PT Telkom Indonesia',
      location: 'Purwokerto, Jawa Tengah',
      kuota: 'Kuota 8 Siswa',
      kota: 'Purwokerto',
    },
    {
      logo: logoAgate,
      role: 'PKL Game Dev',
      company: 'PT Telkom Indonesia',
      location: 'Purwokerto, Jawa Tengah',
      kuota: 'Kuota 6 Siswa',
      kota: 'Yogyakarta',
    },
    {
      logo: logoHuaweiColor,
      role: 'PKL Software Engineer',
      company: 'PT Telkom Indonesia',
      location: 'Purwokerto, Jawa Tengah',
      kuota: 'Kuota 6 Siswa',
      kota: 'Jakarta',
    },
  ],
  stela: {
    title: 'Tanyakan Informasi Magang/PKL\nYang kamu butuhkan ke STELA',
    ctaText: 'Tanya STELA',
    mascot: stelaMascot,
  },
};

export const jalurKarier = {
  title: 'Jalur Karier',
  ctaText: 'Lihat Roadmap Lengkap',
  tabs: ['RPL', 'PG', 'TKJ', 'TJAT'],
  steps: {
    RPL: [
      { title: 'Belajar', desc: 'Kuasai skill dan teori dasar' },
      { title: 'Proyek', desc: 'Bangun Portofolio tebraikmu' },
      { title: 'PKL/Magang', desc: 'Dapatkan pengalaman nyata di industri' },
      { title: 'Junior', desc: 'Mulai Karier Sebagai Developer Junior' },
      { title: 'Profesional', desc: 'Tingkatkan Skill Dan Jadi Ahli' },
      { title: 'Expert', desc: 'Jadi Pemimpin dan ciptakan inovasi' },
    ],
    PG: [
      { title: 'Belajar', desc: 'Kuasai dasar desain dan pemrograman game' },
      { title: 'Proyek', desc: 'Rilis game pertamamu' },
      { title: 'PKL/Magang', desc: 'Magang di studio game ternama' },
      { title: 'Junior', desc: 'Mulai sebagai Junior Game Developer' },
      { title: 'Profesional', desc: 'Pimpin produksi sebuah game' },
      { title: 'Expert', desc: 'Jadi Game Director atau bangun studio' },
    ],
    TKJ: [
      { title: 'Belajar', desc: 'Kuasai dasar jaringan dan server' },
      { title: 'Proyek', desc: 'Bangun lab jaringan sendiri' },
      { title: 'PKL/Magang', desc: 'Magang di penyedia layanan jaringan' },
      { title: 'Junior', desc: 'Mulai sebagai Junior Network Engineer' },
      { title: 'Profesional', desc: 'Kelola infrastruktur skala besar' },
      { title: 'Expert', desc: 'Jadi Network Architect bersertifikasi' },
    ],
    TJAT: [
      { title: 'Belajar', desc: 'Kuasai dasar telekomunikasi dan fiber optic' },
      { title: 'Proyek', desc: 'Rancang simulasi jaringan akses' },
      { title: 'PKL/Magang', desc: 'Magang di operator telekomunikasi' },
      { title: 'Junior', desc: 'Mulai sebagai Junior Access Engineer' },
      { title: 'Profesional', desc: 'Tangani proyek jaringan akses nasional' },
      { title: 'Expert', desc: 'Jadi ahli perencanaan jaringan akses' },
    ],
  },
};

export const kisahAlumni = {
  title: 'Kisah Sukses Alumni',
  items: [
    {
      name: 'Rizky Pratama',
      meta: 'Alumni RPL 2020',
      role: 'Software Engineer di Tokopedia',
      quote:
        'Ilmu yang saya dapatkan di SMK Telkom Purokwerto sangat bermanfaat dalam karier saya saat ini',
    },
    {
      name: 'Dewi Anggraini',
      meta: 'Alumni TJAT 2019',
      role: 'Network Engineer di Telkom Indonesia',
      quote:
        'Pembelajaran praktik dan bimbingan guru membuat saya siap menghadapi dunia kerja',
    },
    {
      name: 'Aldo Permana',
      meta: 'Alumni PG 2021',
      role: 'Game Developer di Agate Studio',
      quote: 'Sekolah ini bukan hanya mengajarkan teori, tapi juga kreativitas tanpa batas',
    },
  ],
  resources: [
    'Download Template CV Profesional',
    'Panduan interview kerja',
    'Latihan soal dan tips',
    'Panduan pengembangan karier',
  ],
};

/* =========================================================
   HALAMAN BERITA
   ========================================================= */

export const beritaHero = {
  badge: 'Stay Connected with Stematel',
  title: 'Berita &\nKegiatan',
  titleAccent: 'Terbaru',
  description:
    'Ikuti semua informasi terkini tentang prestasi, kegiatan, event, dan inovasi di SMK Telkom Purwokerto',
  ctaText: 'Jelajahi Berita',
  image: heroJurusan,
};

export const breakingNews = {
  label: 'Breking News',
  linkText: 'Lihat Prestasi',
  items: [
    {
      text: 'SMK Telkom Purwokerto Raih Juara 1 LKS Nasional 2025 Bidang Web Technologies!',
      date: '20 Mei 2025',
    },
    {
      text: 'Lab AI Center resmi dibuka dan langsung dipakai untuk pembelajaran siswa',
      date: '17 Mei 2025',
    },
    {
      text: 'Tim Robotika membawa pulang Juara 1 KRI Nasional 2025',
      date: '11 Mei 2025',
    },
  ],
};

export const beritaSorot = {
  ctaText: 'Baca Cerita Lengkap',
  trendingTitle: 'Trending News',
  trendingCta: 'Lihat Semua Trending',
  items: [
    {
      kategori: 'Prestasi',
      date: '20 Mei 2025',
      title: 'Juara 1 LKS Nasional 2025 Bidang Web Technologies',
      desc: 'Tim RPL SMK Telkom Purwokerto berhasil meraih Juara 1 dalam ajang Lomba Kompetensi Siswa (LKS) Nasional 2025 yang diselenggarakan di Jakarta.',
    },
    {
      kategori: 'Kegiatan',
      date: '18 Mei 2025',
      title: 'Workshop AI untuk Siswa Bersama Telkom Indonesia',
      desc: 'Telkom Indonesia menghadirkan praktisi AI untuk membimbing siswa membangun model pembelajaran mesin sederhana selama dua hari penuh.',
    },
    {
      kategori: 'Sekolah',
      date: '15 Mei 2025',
      title: 'Kunjungan Industri ke Huawei Indonesia',
      desc: 'Siswa kelas XI meninjau langsung pusat riset dan laboratorium jaringan Huawei Indonesia sebagai bagian dari pembelajaran berbasis industri.',
    },
    {
      kategori: 'Prestasi',
      date: '10 Mei 2025',
      title: '2 Medali Perak di Ajang World Skills Asia 2025',
      desc: 'Dua siswa membawa pulang medali perak pada kategori Web Technologies dan Network Systems di ajang World Skills Asia 2025.',
    },
  ],
};

export const kategoriBerita = {
  title: 'Kategori Berita',
  searchPlaceholder: 'Cari berita...',
  ctaText: 'Muat Lebih Banyak Berita',
  perPage: 4,
  sortOptions: [
    { value: 'terbaru', label: 'Terbaru' },
    { value: 'terlama', label: 'Terlama' },
  ],
  chips: [
    'Semua',
    'Prestasi',
    'Sekolah',
    'PPDB',
    'BKK',
    'Jurusan',
    'Teknologi',
    'Lomba',
    'Workshop',
    'Seminar',
  ],
  items: [
    {
      kategori: 'Prestasi',
      title: 'Tim Robotika Raih Juara 1 KRI Nasional 2025',
      date: '11 Mei 2025',
      iso: '2025-05-11',
      author: 'Admin',
      excerpt:
        'Prestasi membanggakan kembali diraih oleh siswa SMK Telkom Purwokerto di ajang...',
      image: prestasi2,
    },
    {
      kategori: 'Teknologi',
      title: 'Lab AI Center Resmi Dibuka Untuk Siswa',
      date: '17 Mei 2025',
      iso: '2025-05-17',
      author: 'Admin',
      excerpt:
        'Fasilitas baru berbasis AI dan Machine Learning resmi digunakan untuk pembelajaran...',
      image: jurusanRpl,
    },
    {
      kategori: 'Sekolah',
      title: 'MoU dengan PT Telkom Indonesia',
      date: '15 Mei 2025',
      iso: '2025-05-15',
      author: 'Admin',
      excerpt:
        'Kerja sama strategis untuk peningkatan kompetensi siswa dalam bidang teknologi...',
      image: jurusanTkj,
    },
    {
      kategori: 'Kegiatan',
      title: 'Outing Class ke Borobudur dan Yogyakarta',
      date: '13 Mei 2025',
      iso: '2025-05-13',
      author: 'Admin',
      excerpt:
        'Kegiatan outing class siswa kelas XI ke Borobudur dan Malioboro berjalan seru...',
      image: prestasi1,
    },
    {
      kategori: 'Workshop',
      title: 'Workshop UI/UX Bersama Praktisi Industri',
      date: '09 Mei 2025',
      iso: '2025-05-09',
      author: 'Admin',
      excerpt:
        'Siswa jurusan RPL belajar merancang antarmuka langsung dari desainer produk...',
      image: jurusanPg,
    },
    {
      kategori: 'Lomba',
      title: 'Seleksi Internal Menuju Gemastik 2025',
      date: '06 Mei 2025',
      iso: '2025-05-06',
      author: 'Admin',
      excerpt:
        'Puluhan tim bersaing di seleksi internal untuk mewakili sekolah di Gemastik...',
      image: prestasi3,
    },
    {
      kategori: 'PPDB',
      title: 'PPDB Gelombang 2 Resmi Dibuka',
      date: '02 Mei 2025',
      iso: '2025-05-02',
      author: 'Admin',
      excerpt:
        'Pendaftaran siswa baru gelombang kedua dibuka dengan kuota terbatas untuk...',
      image: jurusanTjat,
    },
    {
      kategori: 'BKK',
      title: 'Campus Hiring Bersama Mitra Industri',
      date: '28 April 2025',
      iso: '2025-04-28',
      author: 'Admin',
      excerpt:
        'Bursa Kerja Khusus menghadirkan enam perusahaan untuk merekrut alumni...',
      image: prestasi4,
    },
  ],
};

// CATATAN: di Figma judul kolom event dan kolom newsletter dua-duanya tertulis
// "Kategori Berita" (hasil salin dari section di atasnya). Ditiru sesuai desain.
export const agendaEvent = {
  title: 'Kategori Berita',
  linkText: 'Lihat Semua',
  ctaText: 'Lihat Semua Event',
  items: [
    {
      day: '24',
      month: 'Mei',
      title: 'Semianar Cyber Security bersama Telkom',
      venue: 'Aula SMK Telkom Purwokerto',
      tag: 'Event',
    },
    {
      day: '28',
      month: 'Mei',
      title: 'Pelatihan UI/UX Design Untuk Siswa',
      venue: 'Lab Multimedia',
      tag: 'Workshop',
    },
    {
      day: '02',
      month: 'Jun',
      title: 'Campus Hiring Day Telkom Grup',
      venue: 'Aula SMK Telkom Purwokerto',
      tag: 'Career',
    },
  ],
};

export const galeriKegiatan = {
  title: 'Galeri Kegiatan',
  linkText: 'Lihat Semua',
  // ponytail: keempat foto ini pengganti — aset asli belum bisa diunduh dari Figma
  // (batas panggilan MCP paket Starter). Ganti kalau sudah tersedia.
  items: [
    { alt: 'Tim siswa berprestasi', image: prestasi1 },
    { alt: 'Siswa di ruang kelas', image: jurusanRpl },
    { alt: 'Praktik jaringan siswa', image: jurusanTkj },
    { alt: 'Siswa mengerjakan proyek', image: prestasi2 },
  ],
};

export const newsletterBerita = {
  title: 'Kategori Berita',
  heading: 'Dapatkan Berita Terbaru',
  description:
    'Berlangganan newsletter kami untuk mendapatkan update berita dan informasi terbaru.',
  placeholder: 'Masukan email kamu',
  ctaText: 'Berlangganan',
  note: 'Kami tidak akan membagikan email kamu ke pihak lain.',
  successText: 'Terima kasih! Email kamu sudah terdaftar.',
};
