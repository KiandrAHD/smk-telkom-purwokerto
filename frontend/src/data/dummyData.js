
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

import pengumumanHeroImg from '../assets/pengumuman/pengumuman-hero.jpg';
import stelaBot from '../assets/pengumuman/stela-bot.png';
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
  { label: 'Tentang', href: '/tentang' },
  { label: 'Jurusan', href: '/jurusan' },
  { label: 'Prestasi', href: '/prestasi' },
  { label: 'BKK', href: '/bkk' },
  { label: 'Berita', href: '/berita' },
  { label: 'Pengumuman', href: '/pengumuman' },
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
  primaryCta: { label: 'Masuk PPDB', href: '/ppdb' },
  secondaryCta: { label: 'Lihat Jurusan', href: '/jurusan' },
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
    href: '/ppdb',
  },
  {
    icon: 'monitor',
    title: 'Jurusan',
    desc: 'Pilihan jurusan sesuai minat dan bakatmu',
    linkLabel: 'Lihat Jurusan',
    href: '/jurusan',
  },
  {
    icon: 'briefcase',
    title: 'BKK',
    desc: 'Info lowongan kerja, PKL dan career center',
    linkLabel: 'Kunjungi BKK',
    href: '/bkk',
  },
  {
    icon: 'bot',
    title: 'STELA AI',
    desc: 'Tanya aja tentang SMK Telkom Purwokerto',
    linkLabel: 'Tanya STELA',
    href: '/stela',
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
      slug: 'rpl',
    },
    {
      icon: 'gamepad',
      name: 'Pengembangan Game (PG)',
      desc: 'Belajar design game, pemrograman, dan produksi game hingga menjadi game developer profesional.',
      image: jurusanPg,
      slug: 'pg',
    },
    {
      icon: 'network',
      name: 'Teknik Komputer dan Jaringan (TKJ)',
      desc: 'Mempelajari instalasi, konfigurasi, dan manajemen jaringan komputer dan server secara profesional.',
      image: jurusanTkj,
      slug: 'tkj',
    },
    {
      icon: 'tower',
      name: 'Teknik Jaringan Akses Telekomunikasi (TJAT)',
      desc: 'Menguasai teknologi jaringan akses telekomunikasi dan infrastruktur jaringan modern.',
      image: jurusanTjat,
      slug: 'tjat',
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
    { title: 'Juara 1\nLKS Nasional 2024', category: 'Web Technologies', image: prestasi1, slug: 'lks-nasional-2024-web-technologies' },
    { title: 'Gold Medal\nIDSEEC 2024', category: 'Network Security', image: prestasi2, slug: 'idseec-2024-network-security' },
    { title: 'Juara 2\nGemastik 2024', category: 'Game Development', image: prestasi3, slug: 'gemastik-2024-game-development' },
    { title: 'Juara 1\nIoT Challenge 2024', category: 'Smart Agriculture', image: prestasi4, slug: 'iot-challenge-telkom-2024' },
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
  href: '/ppdb',
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
    { label: 'Jurusan', href: '/jurusan' },
    { label: 'Prestasi', href: '/prestasi' },
    { label: 'BKK', href: '/bkk' },
    { label: 'Berita', href: '/berita' },
    { label: 'Pengumuman', href: '/pengumuman' },
  ],
  informasi: [
    { label: 'Berita', href: '/berita' },
    { label: 'Pengumuman', href: '/pengumuman' },
    { label: 'PPDB', href: '/ppdb' },
    { label: 'Galeri', href: '/galeri' },
  ],
  kontak: {
    address: 'Jl.D I Panjaitan No.128 Purwokerto',
    phone: '(0281) 632138',
    email: 'info@smktelkom-pwt.sch.id',
  },
  // CATATAN: tautan sosial media di bawah masih tebakan dari pola nama sekolah
  // karena akun resminya tidak tercantum di desain. Ganti kalau handle-nya beda.
  socials: [
    { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/smktelkompurwokerto' },
    { name: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@smktelkompurwokerto' },
    { name: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/smktelkompurwokerto' },
    { name: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@smktelkompurwokerto' },
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
      slug: 'lks-nasional-2024-web-technologies',
      title: 'Juara 1 LKS Nasional Bidang Web Technologies',
      desc: 'Tim SMK Telkom Purwokerto berhasil meraih Juara 1 dalam ajang Lomba Kompetensi Siswa (LKS) Nasional 2024 di bidang Web Technologies.',
    },
    {
      level: 'Internasional',
      slug: 'huawei-ict-competition-2024',
      title: 'Silver Medal – Huawei ITC Competition 2024',
      desc: 'Delegasi sekolah meraih Silver Medal pada Huawei ICT Competition 2024 setelah bersaing dengan peserta dari berbagai negara.',
    },
    {
      level: 'Nasional',
      slug: 'gemastik-2024-game-development',
      title: 'Juara 2 Gemastik Game Development 2024',
      desc: 'Karya game orisinal siswa membawa pulang Juara 2 kategori Game Development pada ajang Gemastik 2024.',
    },
    {
      level: 'Nasional',
      slug: 'iot-challenge-telkom-2024',
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
      slug: 'lks-nasional-2024-web-technologies',
      title: 'Juara 1 LKS Nasional 2024 Web Technologies',
      date: '20 Agustus 2024',
      year: 2024,
      tags: ['Nasional', 'LKS', 'Programming'],
      image: jurusanRpl,
    },
    {
      level: 'Interasional',
      slug: 'huawei-ict-competition-2024',
      title: 'Silver Medal Huawei ICT Competition 2024',
      date: '12 Juni 2024',
      year: 2024,
      tags: ['Interasional', 'Programming'],
      image: jurusanRpl,
    },
    {
      level: 'Nasional',
      slug: 'gemastik-2024-game-development',
      title: 'Juara 2 Gemastik 2024 Game Development',
      date: '30 September 2024',
      year: 2024,
      tags: ['Nasional', 'Game'],
      image: jurusanRpl,
    },
    {
      level: 'Nasional',
      slug: 'iot-challenge-telkom-2024',
      title: 'Juara 1 IoT Challenge Telkom 2024',
      date: '1 Oktober 2024',
      year: 2024,
      tags: ['Nasional', 'AI'],
      image: jurusanRpl,
    },
    {
      level: 'Interasional',
      slug: 'world-skills-asia-2024',
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
   HALAMAN PENGUMUMAN
   ========================================================= */

// Hero-nya memakai teks yang sama persis dengan halaman Profil Sekolah di Figma —
// hanya ilustrasinya yang berganti jadi megafon.
export const pengumumanHero = { ...heroData, image: pengumumanHeroImg };

// CATATAN: salah ketik "dafar" ditiru apa adanya dari desain.
export const ppdbBanner = {
  title: 'PPDB 2027',
  titleAccent: 'Resmi Dibuka!',
  // Hanya chip tanggal mulai yang berikon kalender di desain.
  chips: [
    { label: '20 Mei 2026', icon: true },
    { label: 'Deadline 30 Juni 2026' },
  ],
  description:
    'Pendaftaran Peserta Didik Baru Tahun Ajaran 2027/2028 telah resmi dibuka, Segera dafar dan bergabung bersama kami',
  ctaText: '20 Mei 2026',
  href: '/ppdb',
};

export const infoPenting = {
  title: 'Informasi Penting Hari ini',
  linkText: 'Lihat Semua',
  items: [
    'PPDB Gelombang 2 Resmi Dibuka',
    'Workshop AI Untuk Siswa Besok',
    'Deadline LKS 3 Hari Lagi',
    'Libur Nasional Minggu Depan',
  ],
};

// Hanya kartu pertama yang punya ikon megafon di dalam lingkarannya; tiga sisanya
// lingkaran polos, sama seperti di Figma.
export const pengumumanStats = [
  { value: '45', label: 'Pengumuman', desc: 'Total Seluruh Pengumuman', icon: 'megaphone' },
  { value: '12', label: 'Event', desc: 'Event & Kegiatan Sekolah', icon: 'kalender' },
  { value: '5', label: 'Deadline', desc: 'Batas Waktu Kegiatan', icon: 'alarm' },
  { value: '8', label: 'Agenda Minggu Ini', desc: 'Agenda & Kegiatan', icon: 'agenda' },
];

export const pengumumanFilter = {
  chips: ['Semua', 'PPDB', 'Akademik', 'Lomba', 'Workshop', 'Libur', 'BKK', 'Sekolah', 'Guru', 'OSIS'],
  searchPlaceholder: 'Cari Pengumuman',
};

export const pengumumanTimeline = {
  linkText: 'Lihat Time Line Lengkap',
  items: [
    { label: 'Hari Ini', count: '3 Pengumuman' },
    { label: 'Besok', count: '4 Pengumuman' },
    { label: 'Minggu Ini', count: '8 Pengumuman' },
    { label: 'Bulan Ini', count: '15 Pengumuman' },
  ],
};

// Warna thumbnail diambil dari Figma: merah, hijau, biru, dan biru muda pada 20% alpha.
export const daftarPengumuman = {
  ctaText: 'Lihat Semua Pengumuman',
  detailText: 'Lihat Detail',
  items: [
    {
      id: 'peng-01',
      slug: 'ppdb-gelombang-2-resmi-dibuka',
      title: 'PPDB Gelombang 2 Resmi Dibuka!',
      desc: 'Pendaftaran Peserta Didik Baru Gelombang 2 telah Dibuka Segera Daftar dan bergabung bersama kami!',
      date: '20 Mei 2026',
      kategori: 'PPDB',
      tags: ['PPDB', 'Baru'],
      penting: true,
      icon: 'megaphone',
      iconColor: 'text-[#cd0b20]',
      thumb: 'bg-[#cd0b20]/20',
    },
    {
      id: 'peng-02',
      slug: 'ppdb-gelombang-2-resmi-dibuka',
      title: 'PPDB Gelombang 2 Resmi Dibuka!',
      desc: 'Pendaftaran Peserta Didik Baru Gelombang 2 telah Dibuka Segera Daftar dan bergabung bersama kami!',
      date: '20 Mei 2026',
      kategori: 'PPDB',
      tags: ['PPDB'],
      icon: 'kalender',
      iconColor: 'text-[#2f9408]',
      thumb: 'bg-[#42cd0b]/20',
    },
    {
      id: 'peng-03',
      slug: 'ppdb-gelombang-2-resmi-dibuka',
      title: 'PPDB Gelombang 2 Resmi Dibuka!',
      desc: 'Pendaftaran Peserta Didik Baru Gelombang 2 telah Dibuka Segera Daftar dan bergabung bersama kami!',
      date: '20 Mei 2026',
      kategori: 'PPDB',
      tags: ['PPDB'],
      icon: 'trofi',
      iconColor: 'text-[#0b11cd]',
      thumb: 'bg-[#0b11cd]/20',
    },
    {
      id: 'peng-04',
      slug: 'ppdb-gelombang-2-resmi-dibuka',
      title: 'PPDB Gelombang 2 Resmi Dibuka!',
      desc: 'Pendaftaran Peserta Didik Baru Gelombang 2 telah Dibuka Segera Daftar dan bergabung bersama kami!',
      date: '20 Mei 2026',
      kategori: 'PPDB',
      tags: ['PPDB', 'Baru'],
      icon: 'info',
      iconColor: 'text-[#0b9ccd]',
      thumb: 'bg-[#0b9ccd]/20',
    },
  ],
};

// CATATAN: "Kunjugan" dan "KelaS XII" ditiru apa adanya dari desain.
export const pengumumanPopuler = {
  title: 'Pengumuman Populer',
  linkText: 'Lihat Semua',
  items: [
    { slug: 'ppdb-gelombang-1-dibuka', title: 'PPDB Gelombang 1 Dibuka', date: '15 2026 Mei', views: '2.4k Dilihat', badge: 'bg-[#f5ced2] text-[#9b0011]' },
    { slug: 'jadwal-ujian-tengah-semester', title: 'Jadwal Ujian Tengah Semester', date: '15 2026 Mei', views: '2.4k Dilihat', badge: 'bg-[#d9f5ce] text-[#268500]' },
    { slug: 'workshop-ai-untuk-siswa', title: 'Workshop AI untuk Siswa', date: '15 2026 Mei', views: '2.4k Dilihat', badge: 'bg-[#cecff5] text-[#0b11cd]' },
    { slug: 'kunjungan-industri-ke-telkom', title: 'Kunjugan Industri ke Telkom', date: '15 2026 Mei', views: '2.4k Dilihat', badge: 'bg-[#ceebf5] text-[#0b9ccd]' },
    { slug: 'pengumuman-kelulusan-kelas-xii', title: 'Pengumuman Kelulusan KelaS XII', date: '15 2026 Mei', views: '2.4k Dilihat', badge: 'bg-[#f5f2ce] text-[#8f8c69]' },
  ],
};

export const butuhBantuan = {
  title: 'Butuh Bantuan?',
  description: 'Tanyakan Informasi Pengumuman Yang kamu butuhkan ke STELA',
  ctaText: 'Tanya STELA',
  mascot: stelaBot,
};

/* =========================================================
   ISI HALAMAN DETAIL
   Satu entri per subjek. Kartu ringkasan di berbagai section menunjuk ke sini
   lewat field `slug`, jadi dua kartu yang membahas hal yang sama membuka
   artikel yang sama — bukan teks generik.
   ========================================================= */

export const jurusanDetail = [
  {
    slug: 'rpl',
    kategori: 'Program Keahlian',
    title: 'Rekayasa Perangkat Lunak (RPL)',
    subtitle: 'Membangun aplikasi web dan mobile dari nol sampai siap dipakai pengguna',
    date: 'Masa studi 3 tahun',
    image: jurusanRpl,
    lead: 'RPL menyiapkan siswa menjadi pengembang perangkat lunak yang terbiasa bekerja dengan alur kerja industri: menerjemahkan kebutuhan pengguna, menulis kode, menguji, sampai merilis aplikasi.',
    body: [
      'Selama tiga tahun siswa belajar dasar pemrograman, struktur data, basis data relasional, sampai pengembangan aplikasi web dan mobile. Setiap materi diberikan lewat praktik langsung, bukan sekadar teori di papan tulis.',
      'Mulai kelas XI siswa dibagi ke dalam tim kecil untuk mengerjakan proyek nyata dengan alur kerja Git, code review, dan rilis bertahap. Pola ini sengaja meniru cara tim perangkat lunak bekerja di industri.',
      'Di kelas XII siswa menjalani Praktik Kerja Lapangan di mitra industri dan menutup masa studi dengan proyek akhir berupa aplikasi yang benar-benar dipakai, bukan purwarupa yang berhenti di presentasi.',
    ],
    facts: [
      { label: 'Fokus utama', value: 'Web, mobile, dan basis data' },
      { label: 'Bahasa yang dipelajari', value: 'JavaScript, PHP, Dart, SQL' },
      { label: 'Sertifikasi', value: 'Junior Web Developer BNSP' },
      { label: 'Prospek karier', value: 'Software Engineer, Web Developer, QA Engineer' },
    ],
  },
  {
    slug: 'pg',
    kategori: 'Program Keahlian',
    title: 'Pengembangan Game (PG)',
    subtitle: 'Merancang, memprogram, dan merilis game dari ide sampai bisa dimainkan',
    date: 'Masa studi 3 tahun',
    image: jurusanPg,
    lead: 'Pengembangan Game menggabungkan sisi teknis dan sisi kreatif: siswa belajar memprogram mekanik permainan sekaligus merancang pengalaman yang membuat orang betah memainkannya.',
    body: [
      'Tahun pertama diisi dasar pemrograman dan prinsip desain game: bagaimana aturan main dibentuk, bagaimana tingkat kesulitan disusun, dan bagaimana umpan balik ke pemain dirancang.',
      'Tahun kedua masuk ke produksi. Siswa bekerja dengan game engine, membuat aset 2D dan 3D, menyusun level, lalu menguji permainannya ke pemain sungguhan dan memperbaikinya berdasarkan temuan.',
      'Tahun ketiga difokuskan pada rilis. Siswa menyiapkan satu judul game utuh, lengkap dengan materi publikasi, dan mengikuti kompetisi tingkat nasional sebagai tolok ukur kualitas karyanya.',
    ],
    facts: [
      { label: 'Fokus utama', value: 'Game design, pemrograman, dan produksi aset' },
      { label: 'Alat yang dipakai', value: 'Unity, Blender, Aseprite' },
      { label: 'Sertifikasi', value: 'Game Programmer BNSP' },
      { label: 'Prospek karier', value: 'Game Developer, Technical Artist, Level Designer' },
    ],
  },
  {
    slug: 'tkj',
    kategori: 'Program Keahlian',
    title: 'Teknik Komputer dan Jaringan (TKJ)',
    subtitle: 'Membangun dan merawat jaringan komputer serta server yang dipakai banyak orang',
    date: 'Masa studi 3 tahun',
    image: jurusanTkj,
    lead: 'TKJ menyiapkan siswa untuk pekerjaan yang jarang terlihat tetapi menopang semuanya: memasang, mengonfigurasi, dan menjaga jaringan serta server tetap hidup.',
    body: [
      'Siswa memulai dari perakitan perangkat, sistem operasi, dan dasar jaringan. Semua praktik dilakukan di laboratorium dengan perangkat yang dipakai industri, bukan simulator saja.',
      'Materi berlanjut ke konfigurasi router dan switch, perancangan topologi, sampai administrasi server Linux. Siswa terbiasa membaca log dan menelusuri masalah sampai ke akar penyebabnya.',
      'Di tingkat akhir siswa mendalami keamanan jaringan dan komputasi awan, lalu menjalani PKL di mitra industri sebagai administrator jaringan pendamping.',
    ],
    facts: [
      { label: 'Fokus utama', value: 'Jaringan, server, dan keamanan' },
      { label: 'Perangkat yang dipakai', value: 'Cisco, MikroTik, server Linux' },
      { label: 'Sertifikasi', value: 'CCNA dan MTCNA' },
      { label: 'Prospek karier', value: 'Network Engineer, System Administrator, NOC Engineer' },
    ],
  },
  {
    slug: 'tjat',
    kategori: 'Program Keahlian',
    title: 'Teknik Jaringan Akses Telekomunikasi (TJAT)',
    subtitle: 'Menangani infrastruktur fiber optic dan jaringan akses telekomunikasi',
    date: 'Masa studi 3 tahun',
    image: jurusanTjat,
    lead: 'TJAT adalah jurusan yang paling dekat dengan infrastruktur telekomunikasi nyata: kabel fiber optic, perangkat akses, dan jaringan yang menghubungkan rumah serta kantor ke internet.',
    body: [
      'Siswa belajar dasar telekomunikasi, karakteristik media transmisi, dan cara kerja jaringan akses sebelum masuk ke praktik penyambungan fiber optic.',
      'Praktik inti mencakup splicing, pengukuran redaman dengan OTDR, dan penelusuran gangguan pada jalur fiber. Ketelitian di tahap ini menentukan kualitas layanan yang diterima pelanggan.',
      'Menjelang kelulusan siswa mengerjakan proyek simulasi jaringan akses menyeluruh dan menjalani PKL langsung di penyedia layanan telekomunikasi.',
    ],
    facts: [
      { label: 'Fokus utama', value: 'Fiber optic dan jaringan akses' },
      { label: 'Alat yang dipakai', value: 'Fusion splicer, OTDR, power meter' },
      { label: 'Sertifikasi', value: 'Teknisi Fiber Optic BNSP' },
      { label: 'Prospek karier', value: 'Fiber Optic Technician, Access Network Engineer, Field Engineer' },
    ],
  },
];

export const prestasiDetail = [
  {
    slug: 'lks-nasional-2024-web-technologies',
    kategori: 'Tingkat Nasional',
    title: 'Juara 1 LKS Nasional 2024 Bidang Web Technologies',
    subtitle: 'Lomba Kompetensi Siswa Nasional 2024',
    date: '20 Agustus 2024',
    image: prestasi1,
    lead: 'Tim RPL SMK Telkom Purwokerto meraih Juara 1 pada Lomba Kompetensi Siswa Nasional 2024 bidang Web Technologies setelah bersaing dengan perwakilan dari seluruh provinsi.',
    body: [
      'Peserta diminta membangun aplikasi web utuh dalam waktu terbatas: merancang basis data, menulis sisi server, dan menyelesaikan antarmuka yang responsif dalam satu rangkaian penilaian.',
      'Persiapan berjalan selama empat bulan dengan pendampingan guru produktif dan alumni yang kini bekerja sebagai software engineer. Latihan difokuskan pada kecepatan menulis kode yang tetap rapi dan mudah diperiksa.',
      'Kemenangan ini membuka jalur beasiswa bagi anggota tim dan menjadi acuan penyusunan kurikulum RPL pada tahun ajaran berikutnya.',
    ],
    facts: [
      { label: 'Bidang lomba', value: 'Web Technologies' },
      { label: 'Tingkat', value: 'Nasional' },
      { label: 'Penyelenggara', value: 'Kementerian Pendidikan' },
      { label: 'Hasil', value: 'Juara 1' },
    ],
  },
  {
    slug: 'idseec-2024-network-security',
    kategori: 'Tingkat Internasional',
    title: 'Gold Medal IDSEEC 2024 Bidang Network Security',
    subtitle: 'Indonesia Science and Engineering Expo Competition 2024',
    date: '5 Oktober 2024',
    image: prestasi2,
    lead: 'Siswa TKJ membawa pulang Gold Medal dari IDSEEC 2024 lewat purwarupa sistem deteksi gangguan jaringan yang bekerja tanpa perangkat keras tambahan.',
    body: [
      'Karya yang dilombakan berupa perangkat lunak pemantau lalu lintas jaringan yang menandai pola mencurigakan dan mengirim peringatan dini ke administrator.',
      'Juri menilai orisinalitas pendekatan dan kesiapan penerapannya di jaringan sekolah maupun kantor kecil yang tidak punya tim keamanan khusus.',
      'Setelah kompetisi, sistem ini dipasang di jaringan internal sekolah dan dirawat oleh siswa TKJ sebagai bagian dari pembelajaran keamanan jaringan.',
    ],
    facts: [
      { label: 'Bidang lomba', value: 'Network Security' },
      { label: 'Tingkat', value: 'Internasional' },
      { label: 'Penyelenggara', value: 'IDSEEC' },
      { label: 'Hasil', value: 'Gold Medal' },
    ],
  },
  {
    slug: 'huawei-ict-competition-2024',
    kategori: 'Tingkat Internasional',
    title: 'Silver Medal Huawei ICT Competition 2024',
    subtitle: 'Huawei ICT Competition 2024',
    date: '12 Juni 2024',
    image: prestasi2,
    lead: 'Delegasi sekolah meraih Silver Medal pada Huawei ICT Competition 2024 setelah melewati babak penyisihan bersama peserta dari berbagai negara.',
    body: [
      'Kompetisi menguji penguasaan jaringan, komputasi awan, dan keamanan melalui rangkaian soal praktik yang harus diselesaikan langsung pada perangkat.',
      'Tim menjalani pelatihan intensif di laboratorium jaringan sekolah, dengan materi tambahan dari kurikulum resmi Huawei yang diakses lewat kemitraan sekolah.',
      'Pencapaian ini memperkuat kerja sama sekolah dengan Huawei Indonesia, termasuk akses pelatihan dan sertifikasi bagi angkatan berikutnya.',
    ],
    facts: [
      { label: 'Bidang lomba', value: 'Network dan Cloud' },
      { label: 'Tingkat', value: 'Internasional' },
      { label: 'Penyelenggara', value: 'Huawei' },
      { label: 'Hasil', value: 'Silver Medal' },
    ],
  },
  {
    slug: 'gemastik-2024-game-development',
    kategori: 'Tingkat Nasional',
    title: 'Juara 2 Gemastik 2024 Kategori Game Development',
    subtitle: 'Gemastik 2024',
    date: '30 September 2024',
    image: prestasi3,
    lead: 'Karya game orisinal siswa Pengembangan Game membawa pulang Juara 2 kategori Game Development pada ajang Gemastik 2024.',
    body: [
      'Game yang dilombakan mengangkat cerita lokal dengan mekanik teka-teki sederhana, dirancang agar tetap bisa dimainkan pada perangkat berspesifikasi rendah.',
      'Penilaian mencakup kualitas teknis, orisinalitas ide, dan pengalaman bermain. Tim menguji permainannya ke puluhan pemain sebelum babak final untuk memperbaiki bagian yang membingungkan.',
      'Setelah kompetisi, game ini dirilis gratis dan dipakai sebagai bahan belajar bagi adik kelas yang baru masuk jurusan Pengembangan Game.',
    ],
    facts: [
      { label: 'Bidang lomba', value: 'Game Development' },
      { label: 'Tingkat', value: 'Nasional' },
      { label: 'Penyelenggara', value: 'Gemastik' },
      { label: 'Hasil', value: 'Juara 2' },
    ],
  },
  {
    slug: 'iot-challenge-telkom-2024',
    kategori: 'Tingkat Nasional',
    title: 'Juara 1 IoT Challenge Telkom 2024',
    subtitle: 'IoT Challenge Telkom 2024',
    date: '1 Oktober 2024',
    image: prestasi4,
    lead: 'Purwarupa smart agriculture berbasis IoT rancangan siswa dinobatkan sebagai juara pertama pada IoT Challenge Telkom 2024.',
    body: [
      'Alat yang dibuat memantau kelembapan tanah dan suhu, lalu menyalakan penyiraman secara otomatis ketika ambang batas terlampaui. Datanya dikirim ke aplikasi agar petani bisa memeriksanya dari jauh.',
      'Tim menguji alat langsung di lahan milik warga sekitar sekolah selama tiga minggu, dan memperbaiki rancangannya setelah menemukan sensor yang terganggu air hujan.',
      'Juri menilai kesiapan alat ini dipakai di lapangan, bukan hanya kerapian purwarupanya. Faktor itu yang membawa tim ke posisi pertama.',
    ],
    facts: [
      { label: 'Bidang lomba', value: 'Smart Agriculture' },
      { label: 'Tingkat', value: 'Nasional' },
      { label: 'Penyelenggara', value: 'Telkom Indonesia' },
      { label: 'Hasil', value: 'Juara 1' },
    ],
  },
  {
    slug: 'world-skills-asia-2024',
    kategori: 'Tingkat Internasional',
    title: 'Bronze Medal World Skills Asia 2024',
    subtitle: 'World Skills Asia 2024',
    date: '25 November 2024',
    image: prestasi1,
    lead: 'Siswa SMK Telkom Purwokerto meraih Bronze Medal pada World Skills Asia 2024, ajang keterampilan vokasi tingkat Asia.',
    body: [
      'Peserta dinilai pada rangkaian tugas praktik yang dikerjakan di bawah pengawasan juri internasional, dengan standar penilaian yang sama di seluruh negara peserta.',
      'Persiapan dilakukan bersama pelatih nasional selama enam bulan, mencakup latihan teknis sekaligus pembiasaan bekerja di bawah tekanan waktu.',
      'Medali ini menjadi capaian internasional pertama sekolah pada kategori tersebut dan membuka peluang pembinaan lanjutan untuk angkatan berikutnya.',
    ],
    facts: [
      { label: 'Bidang lomba', value: 'Keterampilan vokasi' },
      { label: 'Tingkat', value: 'Internasional' },
      { label: 'Penyelenggara', value: 'World Skills Asia' },
      { label: 'Hasil', value: 'Bronze Medal' },
    ],
  },
];

export const beritaDetail = [
  {
    slug: 'juara-1-lks-nasional-2025-web-technologies',
    kategori: 'Prestasi',
    title: 'Juara 1 LKS Nasional 2025 Bidang Web Technologies',
    subtitle: 'Tim RPL kembali membawa pulang gelar tertinggi',
    date: '20 Mei 2025',
    author: 'Admin',
    image: prestasi1,
    lead: 'Tim RPL SMK Telkom Purwokerto berhasil meraih Juara 1 dalam ajang Lomba Kompetensi Siswa Nasional 2025 yang diselenggarakan di Jakarta.',
    body: [
      'Babak final berlangsung tiga hari dengan tugas membangun aplikasi web lengkap, mulai dari rancangan basis data sampai antarmuka yang harus rapi di layar kecil maupun besar.',
      'Tim menyiapkan diri sejak awal tahun ajaran lewat latihan rutin dua kali seminggu dan simulasi lomba dengan batas waktu yang sama persis seperti aslinya.',
      'Gelar ini menjadi capaian kedua berturut-turut untuk sekolah pada bidang Web Technologies, setelah kemenangan serupa pada LKS Nasional 2024.',
    ],
  },
  {
    slug: 'workshop-ai-bersama-telkom-indonesia',
    kategori: 'Kegiatan',
    title: 'Workshop AI untuk Siswa Bersama Telkom Indonesia',
    subtitle: 'Dua hari membangun model pembelajaran mesin pertama',
    date: '18 Mei 2025',
    author: 'Admin',
    image: showcaseRpl,
    lead: 'Telkom Indonesia menghadirkan praktisi AI untuk membimbing siswa membangun model pembelajaran mesin sederhana selama dua hari penuh.',
    body: [
      'Hari pertama diisi pengenalan konsep dasar: bagaimana data dikumpulkan, dibersihkan, dan dibagi menjadi data latih serta data uji.',
      'Hari kedua siswa langsung melatih model klasifikasi gambar sederhana dan mengukur akurasinya. Sebagian tim melanjutkan dengan menghubungkan model itu ke antarmuka web buatan sendiri.',
      'Materi workshop diarsipkan dan kini dipakai sebagai bahan pengayaan di kelas RPL dan Pengembangan Game.',
    ],
  },
  {
    slug: 'kunjungan-industri-huawei-indonesia',
    kategori: 'Sekolah',
    title: 'Kunjungan Industri ke Huawei Indonesia',
    subtitle: 'Siswa kelas XI meninjau pusat riset dan laboratorium jaringan',
    date: '15 Mei 2025',
    author: 'Admin',
    image: jurusanTkj,
    lead: 'Siswa kelas XI meninjau langsung pusat riset dan laboratorium jaringan Huawei Indonesia sebagai bagian dari pembelajaran berbasis industri.',
    body: [
      'Rombongan dibagi ke dalam kelompok kecil agar setiap siswa bisa melihat perangkat dari dekat dan bertanya langsung ke teknisi yang bertugas.',
      'Sesi utama membahas arsitektur jaringan berskala besar dan bagaimana gangguan ditangani tanpa memutus layanan pelanggan.',
      'Kunjungan ditutup dengan pemaparan jalur karier di bidang jaringan, termasuk sertifikasi yang bisa mulai diambil sejak masa sekolah.',
    ],
  },
  {
    slug: 'dua-medali-perak-world-skills-asia-2025',
    kategori: 'Prestasi',
    title: '2 Medali Perak di Ajang World Skills Asia 2025',
    subtitle: 'Kategori Web Technologies dan Network Systems',
    date: '10 Mei 2025',
    author: 'Admin',
    image: prestasi2,
    lead: 'Dua siswa membawa pulang medali perak pada kategori Web Technologies dan Network Systems di ajang World Skills Asia 2025.',
    body: [
      'Keduanya bersaing dengan peserta dari belasan negara dalam rangkaian tugas praktik yang dinilai juri internasional dengan standar seragam.',
      'Pembinaan dilakukan bersama pelatih nasional selama enam bulan, dengan penekanan pada ketelitian dan pengelolaan waktu di bawah tekanan.',
      'Sekolah berencana memperluas program pembinaan ini agar lebih banyak siswa dapat menembus seleksi tingkat Asia pada tahun berikutnya.',
    ],
  },
  {
    slug: 'tim-robotika-juara-1-kri-nasional-2025',
    kategori: 'Prestasi',
    title: 'Tim Robotika Raih Juara 1 KRI Nasional 2025',
    subtitle: 'Kontes Robot Indonesia 2025',
    date: '11 Mei 2025',
    author: 'Admin',
    image: prestasi2,
    lead: 'Prestasi membanggakan kembali diraih siswa SMK Telkom Purwokerto lewat gelar juara pertama pada Kontes Robot Indonesia 2025.',
    body: [
      'Robot yang dilombakan dirancang dan dirakit sendiri oleh tim, termasuk sistem kendali dan algoritma navigasinya.',
      'Tantangan terbesar muncul saat babak penyisihan ketika sensor jarak sempat terganggu pantulan lantai arena. Tim menyesuaikan ambang batas pembacaan di sela pertandingan dan berhasil lolos.',
      'Kemenangan ini melengkapi rangkaian prestasi sekolah di bidang robotika dan menjadi bekal menuju kompetisi tingkat internasional.',
    ],
  },
  {
    slug: 'lab-ai-center-resmi-dibuka',
    kategori: 'Teknologi',
    title: 'Lab AI Center Resmi Dibuka Untuk Siswa',
    subtitle: 'Fasilitas baru untuk praktik kecerdasan buatan',
    date: '17 Mei 2025',
    author: 'Admin',
    image: showcaseTkj,
    lead: 'Lab AI Center resmi dibuka dan langsung dipakai untuk pembelajaran siswa pada hari yang sama.',
    body: [
      'Laboratorium ini dilengkapi komputer berkemampuan tinggi yang memungkinkan siswa melatih model tanpa harus menunggu berjam-jam.',
      'Ruangan dirancang untuk kerja kelompok: meja disusun melingkar agar diskusi dan peninjauan kode antar-siswa berjalan lebih mudah.',
      'Selain jam pelajaran, lab dibuka untuk kegiatan mandiri di luar jam sekolah dengan pendampingan guru pembimbing.',
    ],
  },
  {
    slug: 'mou-dengan-pt-telkom-indonesia',
    kategori: 'Sekolah',
    title: 'MoU dengan PT Telkom Indonesia',
    subtitle: 'Kerja sama pemagangan dan penyerapan lulusan',
    date: '15 Mei 2025',
    author: 'Admin',
    image: showcaseTjat,
    lead: 'Sekolah menandatangani nota kesepahaman dengan PT Telkom Indonesia untuk memperluas program pemagangan dan penyerapan lulusan.',
    body: [
      'Kesepakatan mencakup kuota Praktik Kerja Lapangan, pelatihan guru, dan penyelarasan materi ajar dengan kebutuhan di lapangan.',
      'Telkom juga membuka akses ke perangkat dan modul pelatihan yang sebelumnya hanya tersedia untuk karyawan internal.',
      'Angkatan pertama yang memanfaatkan skema ini dijadwalkan berangkat magang pada semester berikutnya.',
    ],
  },
  {
    slug: 'outing-class-borobudur-yogyakarta',
    kategori: 'Kegiatan',
    title: 'Outing Class ke Borobudur dan Yogyakarta',
    subtitle: 'Belajar sejarah dan budaya di luar kelas',
    date: '13 Mei 2025',
    author: 'Admin',
    image: aboutVideo,
    lead: 'Siswa mengikuti kegiatan belajar di luar kelas dengan tujuan Candi Borobudur dan sejumlah titik budaya di Yogyakarta.',
    body: [
      'Kegiatan dirancang bukan sekadar rekreasi: setiap kelompok membawa lembar pengamatan dan menyusun laporan singkat setelah kembali.',
      'Di Borobudur siswa mempelajari teknik konstruksi dan sistem drainase candi, yang kemudian dibahas ulang di kelas sebagai contoh rekayasa masa lalu.',
      'Rangkaian ditutup dengan kunjungan ke sentra kerajinan lokal untuk melihat bagaimana usaha kecil memanfaatkan teknologi digital dalam pemasaran.',
    ],
  },
  {
    slug: 'workshop-ui-ux-praktisi-industri',
    kategori: 'Workshop',
    title: 'Workshop UI/UX Bersama Praktisi Industri',
    subtitle: 'Dari riset pengguna sampai purwarupa yang bisa diuji',
    date: '09 Mei 2025',
    author: 'Admin',
    image: showcasePg,
    lead: 'Praktisi desain produk berbagi cara kerja sehari-hari mereka kepada siswa, mulai dari riset pengguna sampai pengujian purwarupa.',
    body: [
      'Peserta diminta mewawancarai calon pengguna lebih dulu sebelum menyentuh alat desain, agar rancangan berangkat dari masalah nyata.',
      'Sesi berikutnya membahas hierarki visual, keterbacaan, dan aksesibilitas dasar yang sering terlewat pada karya siswa.',
      'Workshop ditutup dengan uji purwarupa antar-kelompok, di mana setiap tim melihat langsung bagian rancangannya yang membingungkan pengguna.',
    ],
  },
  {
    slug: 'seleksi-internal-gemastik-2025',
    kategori: 'Lomba',
    title: 'Seleksi Internal Menuju Gemastik 2025',
    subtitle: 'Menjaring wakil sekolah untuk ajang nasional',
    date: '06 Mei 2025',
    author: 'Admin',
    image: showcaseRpl,
    lead: 'Sekolah menggelar seleksi internal untuk menentukan tim yang akan mewakili SMK Telkom Purwokerto pada Gemastik 2025.',
    body: [
      'Seleksi dibuka untuk semua jurusan dan dinilai oleh guru produktif bersama alumni yang pernah berlaga di ajang serupa.',
      'Setiap tim mempresentasikan gagasan dan purwarupa awal, lalu menjawab pertanyaan juri mengenai kelayakan teknis karyanya.',
      'Tim terpilih akan menjalani pembinaan intensif sampai babak penyisihan nasional digelar.',
    ],
  },
  {
    slug: 'ppdb-gelombang-2-resmi-dibuka-berita',
    kategori: 'PPDB',
    title: 'PPDB Gelombang 2 Resmi Dibuka',
    subtitle: 'Pendaftaran daring dibuka untuk semua program keahlian',
    date: '02 Mei 2025',
    author: 'Admin',
    image: pengumumanHeroImg,
    lead: 'Penerimaan Peserta Didik Baru gelombang kedua resmi dibuka untuk seluruh program keahlian yang tersedia di SMK Telkom Purwokerto.',
    body: [
      'Pendaftaran dilakukan secara daring dan calon siswa dapat memilih dua program keahlian sesuai urutan minat.',
      'Berkas yang perlu disiapkan meliputi rapor semester terakhir, kartu keluarga, dan pas foto terbaru.',
      'Kuota gelombang kedua lebih terbatas dibanding gelombang pertama, sehingga pendaftar disarankan tidak menunggu sampai hari terakhir.',
    ],
  },
  {
    slug: 'campus-hiring-mitra-industri',
    kategori: 'BKK',
    title: 'Campus Hiring Bersama Mitra Industri',
    subtitle: 'Rekrutmen langsung di lingkungan sekolah',
    date: '28 April 2025',
    author: 'Admin',
    image: showcaseTkj,
    lead: 'Bursa Kerja Khusus menggelar campus hiring yang mempertemukan siswa tingkat akhir dengan mitra industri secara langsung.',
    body: [
      'Beberapa perusahaan membuka sesi wawancara di hari yang sama, sehingga peserta bisa mengetahui hasil tahap awal tanpa menunggu lama.',
      'Sebelum acara, BKK mengadakan pendampingan penyusunan CV dan simulasi wawancara bagi seluruh peserta.',
      'Sejumlah siswa menerima tawaran pada hari itu juga, sementara sisanya melanjutkan ke tahap seleksi berikutnya di kantor masing-masing perusahaan.',
    ],
  },
];

export const pengumumanDetail = [
  {
    slug: 'ppdb-gelombang-2-resmi-dibuka',
    kategori: 'PPDB',
    title: 'PPDB Gelombang 2 Resmi Dibuka!',
    subtitle: 'Tahun Ajaran 2027/2028',
    date: '20 Mei 2026',
    image: pengumumanHeroImg,
    lead: 'Pendaftaran Peserta Didik Baru Gelombang 2 telah dibuka. Segera daftar dan bergabung bersama kami.',
    body: [
      'Pendaftaran gelombang kedua dibuka untuk seluruh program keahlian: RPL, Pengembangan Game, TKJ, dan TJAT. Calon siswa dapat memilih dua program sesuai urutan minat.',
      'Seluruh proses dilakukan daring melalui laman PPDB sekolah. Berkas yang perlu diunggah meliputi rapor semester terakhir, kartu keluarga, dan pas foto terbaru.',
      'Kuota gelombang kedua lebih terbatas dibanding gelombang pertama. Pendaftar disarankan menyiapkan berkas lebih awal agar tidak terganjal di hari terakhir.',
    ],
    facts: [
      { label: 'Mulai', value: '20 Mei 2026' },
      { label: 'Batas akhir', value: '30 Juni 2026' },
      { label: 'Jalur', value: 'Daring melalui laman PPDB' },
      { label: 'Kategori', value: 'PPDB' },
    ],
  },
  {
    slug: 'ppdb-gelombang-1-dibuka',
    kategori: 'PPDB',
    title: 'PPDB Gelombang 1 Dibuka',
    subtitle: 'Gelombang pertama dengan kuota terbanyak',
    date: '15 Mei 2026',
    image: pengumumanHeroImg,
    lead: 'Gelombang pertama Penerimaan Peserta Didik Baru dibuka dengan kuota terbanyak sepanjang masa pendaftaran.',
    body: [
      'Pendaftar gelombang pertama memperoleh kesempatan memilih program keahlian paling luas karena kuota belum terisi.',
      'Seleksi mempertimbangkan nilai rapor dan hasil tes minat yang dilakukan daring pada tanggal yang ditentukan panitia.',
      'Pengumuman hasil disampaikan lewat laman PPDB dan surel yang didaftarkan saat pendaftaran.',
    ],
    facts: [
      { label: 'Mulai', value: '15 Mei 2026' },
      { label: 'Kuota', value: 'Terbanyak dari seluruh gelombang' },
      { label: 'Seleksi', value: 'Nilai rapor dan tes minat' },
      { label: 'Kategori', value: 'PPDB' },
    ],
  },
  {
    slug: 'jadwal-ujian-tengah-semester',
    kategori: 'Akademik',
    title: 'Jadwal Ujian Tengah Semester',
    subtitle: 'Berlaku untuk seluruh tingkat',
    date: '15 Mei 2026',
    image: aboutVideo,
    lead: 'Jadwal Ujian Tengah Semester untuk seluruh tingkat telah diterbitkan dan dapat diunduh melalui portal siswa.',
    body: [
      'Ujian berlangsung selama satu pekan dengan dua sesi setiap harinya. Siswa wajib hadir lima belas menit sebelum sesi dimulai.',
      'Mata pelajaran produktif diujikan dalam bentuk praktik di laboratorium sesuai jurusan masing-masing.',
      'Siswa yang berhalangan hadir karena alasan yang dapat dipertanggungjawabkan dapat mengajukan ujian susulan melalui wali kelas.',
    ],
    facts: [
      { label: 'Durasi', value: 'Satu pekan' },
      { label: 'Sesi', value: 'Dua sesi per hari' },
      { label: 'Bentuk', value: 'Tertulis dan praktik' },
      { label: 'Kategori', value: 'Akademik' },
    ],
  },
  {
    slug: 'workshop-ai-untuk-siswa',
    kategori: 'Workshop',
    title: 'Workshop AI untuk Siswa',
    subtitle: 'Terbuka untuk semua jurusan',
    date: '15 Mei 2026',
    image: showcaseRpl,
    lead: 'Workshop kecerdasan buatan dibuka untuk siswa semua jurusan, tanpa syarat pengalaman pemrograman sebelumnya.',
    body: [
      'Peserta akan berlatih menyiapkan data, melatih model sederhana, dan membaca hasil pengukuran akurasinya.',
      'Kegiatan berlangsung di Lab AI Center dengan pendampingan praktisi dari mitra industri sekolah.',
      'Kuota terbatas dan pendaftaran ditutup begitu kursi terisi penuh, jadi siswa yang berminat disarankan mendaftar lebih awal.',
    ],
    facts: [
      { label: 'Tempat', value: 'Lab AI Center' },
      { label: 'Peserta', value: 'Semua jurusan' },
      { label: 'Prasyarat', value: 'Tidak ada' },
      { label: 'Kategori', value: 'Workshop' },
    ],
  },
  {
    slug: 'kunjungan-industri-ke-telkom',
    kategori: 'Sekolah',
    title: 'Kunjungan Industri ke Telkom',
    subtitle: 'Agenda kelas XI semester ini',
    date: '15 Mei 2026',
    image: showcaseTjat,
    lead: 'Kunjungan industri ke fasilitas Telkom Indonesia menjadi bagian dari agenda pembelajaran kelas XI semester ini.',
    body: [
      'Siswa akan melihat langsung pusat operasi jaringan dan proses penanganan gangguan yang berjalan sepanjang hari.',
      'Setiap kelompok membawa lembar pengamatan dan menyusun laporan singkat sebagai penilaian mata pelajaran produktif.',
      'Rincian keberangkatan dan daftar kelompok disampaikan wali kelas sepekan sebelum keberangkatan.',
    ],
    facts: [
      { label: 'Peserta', value: 'Siswa kelas XI' },
      { label: 'Tujuan', value: 'Fasilitas Telkom Indonesia' },
      { label: 'Penilaian', value: 'Laporan pengamatan kelompok' },
      { label: 'Kategori', value: 'Sekolah' },
    ],
  },
  {
    slug: 'pengumuman-kelulusan-kelas-xii',
    kategori: 'Akademik',
    title: 'Pengumuman Kelulusan Kelas XII',
    subtitle: 'Disampaikan lewat portal siswa',
    date: '15 Mei 2026',
    image: profilHero,
    lead: 'Hasil kelulusan siswa kelas XII diumumkan melalui portal siswa dan dapat diakses menggunakan akun masing-masing.',
    body: [
      'Pengumuman dibuka serentak pada waktu yang telah ditentukan. Siswa disarankan memastikan akun portalnya masih aktif sebelum hari pengumuman.',
      'Surat keterangan lulus dapat diunduh langsung dari portal, sementara ijazah asli diambil di sekolah sesuai jadwal per jurusan.',
      'Bursa Kerja Khusus membuka pendampingan bagi lulusan yang ingin langsung bekerja maupun melanjutkan ke perguruan tinggi.',
    ],
    facts: [
      { label: 'Akses', value: 'Portal siswa' },
      { label: 'Surat lulus', value: 'Diunduh dari portal' },
      { label: 'Ijazah', value: 'Diambil sesuai jadwal jurusan' },
      { label: 'Kategori', value: 'Akademik' },
    ],
  },
];

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
      slug: 'juara-1-lks-nasional-2025-web-technologies',
      text: 'SMK Telkom Purwokerto Raih Juara 1 LKS Nasional 2025 Bidang Web Technologies!',
      date: '20 Mei 2025',
    },
    {
      slug: 'lab-ai-center-resmi-dibuka',
      text: 'Lab AI Center resmi dibuka dan langsung dipakai untuk pembelajaran siswa',
      date: '17 Mei 2025',
    },
    {
      slug: 'tim-robotika-juara-1-kri-nasional-2025',
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
      slug: 'juara-1-lks-nasional-2025-web-technologies',
      title: 'Juara 1 LKS Nasional 2025 Bidang Web Technologies',
      desc: 'Tim RPL SMK Telkom Purwokerto berhasil meraih Juara 1 dalam ajang Lomba Kompetensi Siswa (LKS) Nasional 2025 yang diselenggarakan di Jakarta.',
    },
    {
      kategori: 'Kegiatan',
      date: '18 Mei 2025',
      slug: 'workshop-ai-bersama-telkom-indonesia',
      title: 'Workshop AI untuk Siswa Bersama Telkom Indonesia',
      desc: 'Telkom Indonesia menghadirkan praktisi AI untuk membimbing siswa membangun model pembelajaran mesin sederhana selama dua hari penuh.',
    },
    {
      kategori: 'Sekolah',
      date: '15 Mei 2025',
      slug: 'kunjungan-industri-huawei-indonesia',
      title: 'Kunjungan Industri ke Huawei Indonesia',
      desc: 'Siswa kelas XI meninjau langsung pusat riset dan laboratorium jaringan Huawei Indonesia sebagai bagian dari pembelajaran berbasis industri.',
    },
    {
      kategori: 'Prestasi',
      date: '10 Mei 2025',
      slug: 'dua-medali-perak-world-skills-asia-2025',
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
      slug: 'tim-robotika-juara-1-kri-nasional-2025',
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
      slug: 'lab-ai-center-resmi-dibuka',
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
      slug: 'mou-dengan-pt-telkom-indonesia',
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
      slug: 'outing-class-borobudur-yogyakarta',
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
      slug: 'workshop-ui-ux-praktisi-industri',
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
      slug: 'seleksi-internal-gemastik-2025',
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
      slug: 'ppdb-gelombang-2-resmi-dibuka-berita',
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
      slug: 'campus-hiring-mitra-industri',
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
