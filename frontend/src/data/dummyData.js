
import heroPanel from '../assets/landing/hero-panel.jpg';
import aboutVideo from '../assets/landing/about-video.jpg';
import jurusanRpl from '../assets/landing/jurusan-rpl.jpg';
import jurusanPg from '../assets/landing/jurusan-pg.jpg';
import jurusanTkj from '../assets/landing/jurusan-tkj.jpg';
import jurusanTjat from '../assets/landing/jurusan-tjat.jpg';
import prestasi1 from '../assets/landing/prestasi-1.jpg';
import prestasi2 from '../assets/landing/prestasi-2.jpg';
import prestasi3 from '../assets/landing/prestasi-3.jpg';
import mapImg from '../assets/landing/map.jpg';

import heroJurusan from '../assets/jurusan/hero-jurusan.jpg';

import logoTelkomColor from '../assets/bkk/logo-telkom.png';
import logoHuaweiColor from '../assets/bkk/logo-huawei.png';
import logoAgate from '../assets/bkk/logo-agate.png';
import logoDicodingColor from '../assets/bkk/logo-dicoding.png';
import stelaMascot from '../assets/bkk/stela-mascot.png';
import showcaseRpl from '../assets/jurusan/stock-hd/rpl-software-development.jpg';
import showcasePg from '../assets/jurusan/stock-hd/game-development.jpg';
import showcaseTkj from '../assets/jurusan/stock-hd/server-monitoring.jpg';
import showcaseTjat from '../assets/jurusan/stock-hd/fiber-optic-network.jpg';

import pengumumanHeroImg from '../assets/pengumuman/pengumuman-hero.jpg';
import stelaBot from '../assets/pengumuman/stela-bot.png';
import profilHero from '../assets/tentang/profil-hero.jpg';
import profilKepsek from '../assets/tentang/profil-kepsek.png';
import guru1 from '../assets/tentang/guru-1.png';
import guru2 from '../assets/tentang/guru-2.png';
import guru3 from '../assets/tentang/guru-3.png';
import guru4 from '../assets/tentang/guru-4.png';
import gedungSekolah from '../assets/tentang/school-building.jpg';
import labKomputer from '../assets/tentang/lab-komputer.jpg';
import perpustakaan from '../assets/tentang/perpustakaan.jpg';
import studioMultimedia from '../assets/tentang/studio-multimedia.jpg';
import guruGroup from '../assets/tentang/guru-group.jpg';

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
  {
    label: 'Tentang',
    children: [
      { label: 'Beranda', href: '/' },
      { label: 'Profil Sekolah', href: '/profil-sekolah' },
    ],
  },
  { label: 'Jurusan', href: '/jurusan' },
  { label: 'Prestasi', href: '/prestasi' },
  { label: 'BKK', href: '/bkk' },
  { label: 'Berita', href: '/berita' },
  { label: 'Pengumuman', href: '/pengumuman' },
];

// ── Hero Beranda ──
// Tombol "Masuk PPDB" muncul di navbar (desktop dan laci mobile) serta di hero
// beranda. Alamatnya disimpan sekali di sini supaya tidak ada lagi URL yang
// ditulis ulang di tiga tempat dan berisiko beda sendiri saat diubah.
// Tujuannya halaman masuk portal, bukan laman info /ppdb — di sana sudah ada
// tautan "Daftar Akun Baru" untuk pendaftar yang belum punya akun.
export const ctaMasukPpdb = { label: 'Masuk PPDB', href: '/ppdb/masuk' };

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
  primaryCta: ctaMasukPpdb,
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
  {
    icon: 'sparkles',
    title: 'NextTel AI',
    desc: 'Temukan jurusan yang sesuai dengan minat dan bakatmu',
    linkLabel: 'Cari Jurusanmu',
    href: '/nexttel',
  },
];

// ── Section Tentang (Beranda) ──
// Video profil resmi sekolah di kanal YouTube SMK Telkom Purwokerto. Disimpan
// sebagai satu konstanta karena dipakai di tiga halaman — Beranda, Tentang, dan
// Prestasi. Ganti `videoId` di sini kalau videonya diperbarui.
export const videoProfilSekolah = {
  videoId: 'w68QaEXd7iw',
  title: 'Video Profil SMK Telkom Purwokerto',
  desc: 'Mengenal program keahlian, fasilitas, dan keseharian belajar di SMK Telkom Purwokerto.',
};

export const landingAbout = {
  title: 'Tentang SMK Telkom Purwokerto',
  description:
    'Kami adalah sekolah vokasi teknologi informasi dan komunikasi yang berfokus pada pengembangan kompetensi, karakter, dan inovasi untuk menghasilkan lulusan yang siap kerja dan siap berwirausaha',
  image: aboutVideo,
  video: { ...videoProfilSekolah, poster: aboutVideo },
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
    { title: 'Juara 1\nIoT Challenge 2024', category: 'Smart Agriculture', image: showcaseTjat, slug: 'iot-challenge-telkom-2024' },
  ],
};

// ── STELA AI ──
export const stelaData = {
  title: 'Tanyakan apa saja\nke STELA',
  description:
    'STELA (Stematel Learning Asistant) siap menjawab pertanyaanmu tentang jurusan, fasilitas, prestasi, PPDB, dan informasi lainnya seputar SMK Telkom Purwokerto',
  ctaText: 'Tanya STELA Sekarang',
  // Sapaan pembuka dan pertanyaan contoh untuk halaman /stela. Ditaruh di sini,
  // bukan di komponen, supaya bisa diubah tanpa menyentuh kode.
  sapaan:
    'Halo! Aku STELA, asisten SMK Telkom Purwokerto. Tanya apa saja soal jurusan, PPDB, prestasi, atau fasilitas sekolah ya.',
  saran: [
    'Apa saja jurusan di SMK Telkom Purwokerto?',
    'Kapan PPDB gelombang 2 ditutup?',
    'Prestasi apa yang pernah diraih sekolah ini?',
    'Jurusan apa yang cocok kalau saya suka jaringan?',
  ],
  placeholder: 'Tulis pertanyaanmu di sini...',
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
// ── Profil sekolah dalam video + galeri fasilitas ──
export const profilVideo = {
  eyebrow: 'Profil Sekolah',
  title: 'Lihat Langsung Suasananya',
  description:
    'Satu video singkat untuk mengenal gedung, laboratorium, dan keseharian belajar di SMK Telkom Purwokerto sebelum kamu datang berkunjung.',
  video: { ...videoProfilSekolah, poster: gedungSekolah },
  galeriTitle: 'Fasilitas Sekolah',
  galeriDesc: 'Ruang belajar dan laboratorium yang dipakai siswa setiap hari.',
  galeri: [
    { image: labKomputer, alt: 'Laboratorium komputer dengan perangkat berstandar industri' },
    { image: studioMultimedia, alt: 'Studio multimedia untuk produksi konten dan game' },
    { image: perpustakaan, alt: 'Perpustakaan sekolah sebagai ruang baca dan diskusi' },
    { image: gedungSekolah, alt: 'Gedung utama SMK Telkom Purwokerto' },
    { image: guruGroup, alt: 'Guru produktif pendamping praktik siswa' },
    { image: heroPanel, alt: 'Kegiatan belajar siswa di dalam kelas' },
  ],
};

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
// Di Figma keempat kartu ini memakai teks placeholder hasil salin dari section Prestasi
// ("Juara 1 / LKS Nasional 2024"), sehingga di halaman Tentang seolah para guru memenangkan
// lomba yang sama dengan siswa. Diganti dengan data guru yang semestinya.
//
// ponytail: nama di bawah ini masih data dummy — ganti dengan data kepegawaian asli.
// Jumlah entri sengaja disamakan dengan jumlah foto yang tersedia (4) supaya tidak ada
// wajah yang sama muncul dengan dua nama berbeda. Tambah entri + foto baru, dan carousel
// di TentangKepalaSekolahSection otomatis aktif lagi (empat kartu per halaman).
export const guruData = [
  {
    nama: 'Bayu Setiawan, S.Kom.',
    jabatan: 'Guru Produktif RPL',
    bidang: 'Pemrograman web dan basis data',
    image: guru1,
  },
  {
    nama: 'Anindya Larasati, S.Pd.',
    jabatan: 'Guru Produktif PG',
    bidang: 'Desain game dan aset visual',
    image: guru2,
  },
  {
    nama: 'Nurul Hidayah, S.T.',
    jabatan: 'Guru Produktif TKJ',
    bidang: 'Administrasi jaringan dan server',
    image: guru3,
  },
  {
    nama: 'Fajar Nugroho, S.T.',
    jabatan: 'Guru Produktif TJAT',
    bidang: 'Fiber optic dan jaringan akses',
    image: guru4,
  },
];

export const footerData = {
  tagline:
    'Mencetak generasi digital yang kompeten, berkarakter, dan siap bersaing di era teknologi',
  menu: [
    { label: 'Profil Sekolah', href: '/profil-sekolah' },
    { label: 'Jurusan', href: '/jurusan' },
    { label: 'Prestasi', href: '/prestasi' },
    { label: 'BKK', href: '/bkk' },
    { label: 'Berita', href: '/berita' },
    { label: 'Pengumuman', href: '/pengumuman' },
  ],
  // Galeri sengaja tidak dicantumkan di sini: ia tidak ada di desain maupun di
  // navbar, jadi memunculkannya hanya di footer membuat strukturnya tidak
  // konsisten. Halamannya sendiri tetap ada dan tetap terjangkau lewat tautan
  // "Lihat Semua" di bagian Galeri Kegiatan pada halaman Berita.
  informasi: [
    { label: 'Berita', href: '/berita' },
    { label: 'Pengumuman', href: '/pengumuman' },
    { label: 'PPDB', href: '/ppdb' },
  ],
  kontak: {
    address: 'Jl.D I Panjaitan No.128 Purwokerto',
    phone: '(0281) 632138',
    email: 'info@smktelkom-pwt.sch.id',
  },
  // Akun resmi sekolah, handle-nya seragam: stematelpwt.
  //
  // Parameter pelacak bawaan tombol "salin tautan" (?igsi=, ?_r=&_t=, ?si=)
  // sengaja dibuang. Parameter itu terikat pada sesi orang yang menyalinnya,
  // tidak diperlukan untuk membuka profil, dan menyematkannya di situs publik
  // berarti setiap pengunjung ikut membawa jejak sesi tersebut.
  //
  // Facebook dihapus atas permintaan sekolah.
  socials: [
    { name: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/stematelpwt' },
    { name: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@stematelpwt' },
    { name: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@stematelpwt' },
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
  { value: '4', label: 'Jurusan Unggulan', icon: 'jurusan' },
  { value: '120+', label: 'Mitra Industri', icon: 'mitra' },
  { value: '98%', label: 'Lulusan Bekerja', icon: 'kerja' },
  { value: '350+', label: 'Projek Siswa', icon: 'projek' },
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
  { value: '150+', label: 'Total Prestasi', icon: 'trofi' },
  { value: '50+', label: 'Tingkat Nasional', icon: 'nasional' },
  { value: '15+', label: 'Tingkat Internasional', icon: 'internasional' },
  { value: '100+', label: 'Juara 1', icon: 'medali' },
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
      image: prestasi1,
    },
    {
      level: 'Interasional',
      slug: 'huawei-ict-competition-2024',
      title: 'Silver Medal Huawei ICT Competition 2024',
      date: '12 Juni 2024',
      year: 2024,
      tags: ['Interasional', 'Programming'],
      image: showcaseTkj,
    },
    {
      level: 'Nasional',
      slug: 'gemastik-2024-game-development',
      title: 'Juara 2 Gemastik 2024 Game Development',
      date: '30 September 2024',
      year: 2024,
      tags: ['Nasional', 'Game'],
      image: showcasePg,
    },
    {
      level: 'Nasional',
      slug: 'iot-challenge-telkom-2024',
      title: 'Juara 1 IoT Challenge Telkom 2024',
      date: '1 Oktober 2024',
      year: 2024,
      tags: ['Nasional', 'AI'],
      image: showcaseTjat,
    },
    {
      level: 'Interasional',
      slug: 'world-skills-asia-2024',
      title: 'Bronze Medal – Word Skills Asia 2024',
      date: '25 November 2024',
      year: 2024,
      tags: ['Interasional', 'Robotik', 'UI/UX'],
      image: prestasi2,
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
  // ponytail: memakai video profil resmi sekolah karena reel khusus prestasi
  // belum ada. Ganti `videoId` di sini begitu videonya tersedia.
  video: { ...videoProfilSekolah, poster: prestasi1 },
};

/* =========================================================
   HALAMAN BKK
   ========================================================= */

// Di Figma hero BKK memakai teks yang sama persis dengan halaman Prestasi;
// hanya angka statistiknya yang berbeda.
export const bkkHero = { ...prestasiHero };

export const bkkStats = [
  { value: '250+', label: 'Lowongan Aktif', icon: 'lowongan' },
  { value: '120+', label: 'Mitra Industri', icon: 'mitra' },
  { value: '95%', label: 'Penyiapan Alumni', icon: 'alumni' },
  { value: '500+', label: 'Alumni bekerja', icon: 'komunitas' },
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
    kompetensi: [
      'Dasar pemrograman, algoritma, dan struktur data',
      'Pengembangan web sisi tampilan maupun sisi server',
      'Pembuatan aplikasi mobile lintas perangkat',
      'Perancangan dan pengelolaan basis data relasional',
      'Pengujian program dan kerja tim dengan Git',
    ],
    kurikulum: [
      { tingkat: 'Kelas X', fokus: 'Dasar pemrograman, algoritma, logika, dan pengenalan basis data. Semua materi dilatih langsung di depan komputer.' },
      { tingkat: 'Kelas XI', fokus: 'Pengembangan aplikasi web dan mobile dalam tim kecil, dengan alur kerja Git, code review, dan rilis bertahap.' },
      { tingkat: 'Kelas XII', fokus: 'Praktik Kerja Lapangan di mitra industri, dilanjutkan proyek akhir berupa aplikasi yang benar-benar dipakai pengguna.' },
    ],
    fasilitas: [
      'Laboratorium RPL dengan komputer spesifikasi pengembangan',
      'Server praktik untuk menaikkan aplikasi buatan siswa',
      'Akses kelas daring bersertifikat dari mitra industri',
      'Ruang kerja tim untuk pengerjaan proyek bersama',
    ],
    karier: [
      { role: 'Software Engineer', desc: 'Membangun dan merawat perangkat lunak di perusahaan teknologi.' },
      { role: 'Web Developer', desc: 'Mengerjakan situs dan aplikasi web dari sisi tampilan sampai server.' },
      { role: 'Mobile Developer', desc: 'Mengembangkan aplikasi untuk perangkat Android maupun iOS.' },
      { role: 'Quality Assurance', desc: 'Menguji perangkat lunak agar bebas cacat sebelum sampai ke pengguna.' },
    ],
    galeri: [
      { image: showcaseRpl, alt: 'Aplikasi web karya siswa RPL' },
      { image: labKomputer, alt: 'Laboratorium RPL dengan komputer spesifikasi pengembangan' },
      { image: heroPanel, alt: 'Siswa RPL mengerjakan proyek secara berkelompok' },
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
    kompetensi: [
      'Prinsip desain game: aturan main, tingkat kesulitan, dan umpan balik',
      'Pemrograman mekanik permainan di dalam game engine',
      'Pembuatan aset visual 2D dan 3D',
      'Animasi karakter serta efek visual dan suara',
      'Pengujian permainan ke pemain sungguhan dan perbaikannya',
    ],
    kurikulum: [
      { tingkat: 'Kelas X', fokus: 'Dasar pemrograman dan prinsip desain game, termasuk cara menyusun aturan main yang terasa adil dan menantang.' },
      { tingkat: 'Kelas XI', fokus: 'Produksi penuh: bekerja dengan game engine, membuat aset sendiri, menyusun level, lalu menguji ke pemain.' },
      { tingkat: 'Kelas XII', fokus: 'Menyiapkan satu judul game utuh sampai siap rilis, lengkap dengan materi publikasi, sambil menjalani PKL.' },
    ],
    fasilitas: [
      'Laboratorium game dengan komputer berkartu grafis khusus',
      'Pen tablet untuk penggambaran aset digital',
      'Ruang playtest untuk menguji permainan ke pemain',
      'Lisensi resmi game engine dan perangkat lunak aset',
    ],
    karier: [
      { role: 'Game Developer', desc: 'Memprogram mekanik dan sistem di dalam sebuah permainan.' },
      { role: 'Technical Artist', desc: 'Menjembatani kebutuhan seniman dan pemrogram dalam produksi game.' },
      { role: 'Level Designer', desc: 'Merancang tata letak dan alur tantangan di setiap level.' },
      { role: 'Game Tester', desc: 'Menemukan cacat dan bagian yang membingungkan sebelum game dirilis.' },
    ],
    galeri: [
      { image: showcasePg, alt: 'Permainan buatan siswa Pengembangan Game' },
      { image: studioMultimedia, alt: 'Studio multimedia tempat aset game diproduksi' },
      { image: heroPanel, alt: 'Sesi playtest permainan bersama pemain' },
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
    kompetensi: [
      'Perakitan perangkat dan pemasangan sistem operasi',
      'Konfigurasi router, switch, dan perangkat nirkabel',
      'Perancangan topologi jaringan sesuai kebutuhan',
      'Administrasi server berbasis Linux',
      'Keamanan jaringan dan penelusuran gangguan lewat log',
    ],
    kurikulum: [
      { tingkat: 'Kelas X', fokus: 'Perakitan perangkat, sistem operasi, dan dasar jaringan. Praktik memakai perangkat yang dipakai industri, bukan simulator saja.' },
      { tingkat: 'Kelas XI', fokus: 'Konfigurasi router dan switch, perancangan topologi, serta administrasi server Linux.' },
      { tingkat: 'Kelas XII', fokus: 'Pendalaman keamanan jaringan dan komputasi awan, dilanjutkan PKL sebagai administrator jaringan pendamping.' },
    ],
    fasilitas: [
      'Laboratorium jaringan dengan perangkat Cisco dan MikroTik',
      'Rak server untuk praktik administrasi dan virtualisasi',
      'Perangkat nirkabel dan alat ukur jaringan',
      'Akses kurikulum resmi dari mitra sertifikasi',
    ],
    karier: [
      { role: 'Network Engineer', desc: 'Merancang dan merawat jaringan agar tetap stabil dan aman.' },
      { role: 'System Administrator', desc: 'Mengelola server serta layanan yang berjalan di atasnya.' },
      { role: 'NOC Engineer', desc: 'Memantau jaringan dan menangani gangguan sepanjang waktu.' },
      { role: 'IT Support', desc: 'Menangani kebutuhan perangkat dan jaringan pengguna di kantor.' },
    ],
    galeri: [
      { image: showcaseTkj, alt: 'Praktik konfigurasi router dan switch' },
      { image: heroPanel, alt: 'Siswa TKJ praktik konfigurasi jaringan di kelas' },
      { image: labKomputer, alt: 'Praktik administrasi server oleh siswa TKJ' },
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
    kompetensi: [
      'Dasar telekomunikasi dan karakteristik media transmisi',
      'Penyambungan kabel fiber optic dengan fusion splicer',
      'Pengukuran redaman jalur memakai OTDR dan power meter',
      'Instalasi jaringan akses sampai ke sisi pelanggan',
      'Penelusuran dan perbaikan gangguan pada jalur fiber',
    ],
    kurikulum: [
      { tingkat: 'Kelas X', fokus: 'Dasar telekomunikasi, karakteristik media transmisi, dan cara kerja jaringan akses secara menyeluruh.' },
      { tingkat: 'Kelas XI', fokus: 'Praktik inti: splicing, pengukuran redaman, dan penelusuran gangguan. Ketelitian di tahap ini menentukan kualitas layanan.' },
      { tingkat: 'Kelas XII', fokus: 'Proyek simulasi jaringan akses menyeluruh dan PKL langsung di penyedia layanan telekomunikasi.' },
    ],
    fasilitas: [
      'Fusion splicer untuk praktik penyambungan fiber',
      'OTDR dan power meter untuk pengukuran jalur',
      'Tiang dan jalur praktik instalasi di area sekolah',
      'Laboratorium simulasi jaringan FTTH',
    ],
    karier: [
      { role: 'Fiber Optic Technician', desc: 'Memasang dan menyambung jalur fiber optic di lapangan.' },
      { role: 'Access Network Engineer', desc: 'Merancang jaringan akses yang menghubungkan pelanggan ke jaringan inti.' },
      { role: 'Field Engineer', desc: 'Menangani pemasangan dan perbaikan perangkat di lokasi pelanggan.' },
      { role: 'Survey Technician', desc: 'Memetakan jalur dan menghitung kebutuhan material sebelum pemasangan.' },
    ],
    galeri: [
      { image: showcaseTjat, alt: 'Praktik penyambungan kabel fiber optic' },
      { image: heroPanel, alt: 'Siswa TJAT berlatih pengukuran jalur fiber' },
      { image: labKomputer, alt: 'Simulasi jaringan akses FTTH di laboratorium' },
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
    sorotan: [
      { angka: '1', label: 'Peringkat akhir' },
      { angka: '34', label: 'Provinsi bersaing' },
      { angka: '4 bulan', label: 'Masa persiapan' },
    ],
    perjalanan: [
      { tahap: 'Seleksi sekolah', isi: 'Dua puluh siswa RPL mengikuti simulasi lomba tertutup, disaring menjadi tiga kandidat.' },
      { tahap: 'Seleksi provinsi', isi: 'Tim menyelesaikan studi kasus aplikasi web dalam delapan jam dan lolos sebagai wakil Jawa Tengah.' },
      { tahap: 'Final nasional', isi: 'Tiga hari penilaian di Jakarta, ditutup dengan pengumuman Juara 1 bidang Web Technologies.' },
    ],
    galeri: [
      { image: prestasi3, alt: 'Tim menerima piala Juara 1 LKS Nasional 2024' },
      { image: showcaseRpl, alt: 'Aplikasi web yang dilombakan di babak final' },
      { image: labKomputer, alt: 'Latihan rutin di laboratorium RPL sebelum lomba' },
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
    sorotan: [
      { angka: 'Gold', label: 'Medali diraih' },
      { angka: '0', label: 'Perangkat keras tambahan' },
      { angka: '1', label: 'Sistem dipakai di sekolah' },
    ],
    perjalanan: [
      { tahap: 'Riset masalah', isi: 'Siswa memetakan gangguan jaringan yang paling sering terjadi di laboratorium sekolah selama satu semester.' },
      { tahap: 'Bangun purwarupa', isi: 'Pemantau lalu lintas dibuat murni sebagai perangkat lunak agar bisa dipasang tanpa membeli alat baru.' },
      { tahap: 'Penjurian IDSEEC', isi: 'Juri menguji ketepatan deteksi dan kesiapan penerapannya, lalu memberikan Gold Medal.' },
    ],
    galeri: [
      { image: prestasi1, alt: 'Presentasi purwarupa di hadapan juri IDSEEC 2024' },
      { image: jurusanTkj, alt: 'Praktik pemantauan jaringan di laboratorium TKJ' },
      { image: labKomputer, alt: 'Pengujian sistem deteksi pada jaringan sekolah' },
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
    sorotan: [
      { angka: 'Silver', label: 'Medali diraih' },
      { angka: '3', label: 'Anggota delegasi' },
      { angka: '2', label: 'Bidang diujikan' },
    ],
    perjalanan: [
      { tahap: 'Babak daring', isi: 'Peserta mengerjakan soal jaringan dan komputasi awan dengan batas waktu ketat dari sekolah masing-masing.' },
      { tahap: 'Pelatihan intensif', isi: 'Tim mendalami kurikulum resmi Huawei di laboratorium jaringan, dipandu guru bersertifikasi.' },
      { tahap: 'Babak praktik', isi: 'Konfigurasi langsung pada perangkat sungguhan, dinilai berdasarkan ketepatan dan kecepatan.' },
    ],
    galeri: [
      { image: prestasi1, alt: 'Delegasi sekolah di Huawei ICT Competition 2024' },
      { image: showcaseTkj, alt: 'Konfigurasi perangkat jaringan saat babak praktik' },
      { image: jurusanTkj, alt: 'Persiapan tim di laboratorium jaringan sekolah' },
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
    sorotan: [
      { angka: '2', label: 'Peringkat akhir' },
      { angka: '1', label: 'Judul game diproduksi' },
      { angka: '5 bulan', label: 'Masa produksi' },
    ],
    perjalanan: [
      { tahap: 'Konsep dan pitching', isi: 'Tim menyusun ide permainan, menguji aturan mainnya di atas kertas, lalu memilih satu konsep untuk dikembangkan.' },
      { tahap: 'Produksi', isi: 'Aset visual, musik, dan mekanik dikerjakan paralel dalam tim kecil dengan tenggat mingguan.' },
      { tahap: 'Playtest dan final', isi: 'Puluhan pemain menguji permainan, hasil masukannya dipakai memperbaiki level sebelum penjurian Gemastik.' },
    ],
    galeri: [
      { image: prestasi1, alt: 'Tim Pengembangan Game di panggung Gemastik 2024' },
      { image: showcasePg, alt: 'Tangkapan layar game yang dilombakan' },
      { image: studioMultimedia, alt: 'Produksi aset visual di studio multimedia' },
    ],
  },
  {
    slug: 'iot-challenge-telkom-2024',
    kategori: 'Tingkat Nasional',
    title: 'Juara 1 IoT Challenge Telkom 2024',
    subtitle: 'IoT Challenge Telkom 2024',
    date: '1 Oktober 2024',
    // TITIPAN: foto asli IoT Challenge belum ada, jadi sementara memakai foto
    // Gemastik. Dulu ini berkas terpisah (prestasi-4.jpg) yang isinya identik
    // byte-per-byte dengan prestasi-3.jpg, sehingga duplikasinya tak terlihat.
    // Ganti dengan foto IoT Challenge yang sebenarnya begitu tersedia.
    image: prestasi3,
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
    sorotan: [
      { angka: '1', label: 'Peringkat akhir' },
      { angka: '3', label: 'Sensor terpasang' },
      { angka: '2 pekan', label: 'Uji coba di lahan' },
    ],
    perjalanan: [
      { tahap: 'Survei lapangan', isi: 'Siswa mendata kebutuhan petani sekitar sekolah agar alat yang dibuat benar-benar terpakai.' },
      { tahap: 'Rakit purwarupa', isi: 'Sensor kelembapan, suhu, dan cahaya dirangkai lalu dihubungkan ke papan pemantau berbasis web.' },
      { tahap: 'Uji dan lomba', isi: 'Alat diuji langsung di lahan selama dua pekan sebelum dipresentasikan pada IoT Challenge Telkom 2024.' },
    ],
    galeri: [
      { image: prestasi2, alt: 'Purwarupa perangkat IoT pertanian buatan siswa' },
      { image: showcaseTjat, alt: 'Pemasangan sensor di lahan uji coba' },
      { image: labKomputer, alt: 'Perakitan dan pengujian perangkat di laboratorium' },
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
    sorotan: [
      { angka: 'Bronze', label: 'Medali diraih' },
      { angka: 'Asia', label: 'Tingkat kompetisi' },
      { angka: '2', label: 'Kategori diikuti' },
    ],
    perjalanan: [
      { tahap: 'Penyaringan nasional', isi: 'Peserta terpilih dari hasil LKS Nasional mengikuti pemusatan latihan bersama pelatih nasional.' },
      { tahap: 'Pemusatan latihan', isi: 'Latihan harian dengan format soal dan batas waktu yang sama persis seperti kompetisi sesungguhnya.' },
      { tahap: 'Kompetisi Asia', isi: 'Bersaing dengan peserta dari belasan negara dan membawa pulang medali perunggu.' },
    ],
    galeri: [
      { image: prestasi2, alt: 'Peraih medali World Skills Asia 2024' },
      { image: showcaseRpl, alt: 'Hasil kerja peserta pada kategori Web Technologies' },
      { image: heroPanel, alt: 'Sesi pemusatan latihan sebelum berangkat' },
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
    kutipan: {
      teks: 'Yang paling menentukan bukan kecepatan menulis kode, tapi kebiasaan memeriksa ulang sebelum waktu habis.',
      oleh: 'Pembina tim LKS Web Technologies',
    },
    galeri: [
      { image: prestasi3, alt: 'Penyerahan piala Juara 1 LKS Nasional 2025' },
      { image: showcaseRpl, alt: 'Aplikasi web yang dikerjakan selama babak final' },
      { image: labKomputer, alt: 'Latihan tim di laboratorium RPL' },
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
    kutipan: {
      teks: 'Siswa tidak dibiarkan berhenti di teori. Hari kedua mereka sudah melatih model sendiri dan melihat akurasinya naik-turun.',
      oleh: 'Praktisi AI Telkom Indonesia',
    },
    galeri: [
      { image: studioMultimedia, alt: 'Sesi praktik membangun model pembelajaran mesin' },
      { image: labKomputer, alt: 'Siswa mengikuti workshop di laboratorium komputer' },
      { image: guruGroup, alt: 'Pendampingan guru selama sesi berlangsung' },
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
    kutipan: {
      teks: 'Melihat langsung bagaimana gangguan ditangani tanpa memutus layanan pelanggan itu pelajaran yang tidak ada di buku.',
      oleh: 'Siswa kelas XI TKJ',
    },
    galeri: [
      { image: labKomputer, alt: 'Rombongan siswa di laboratorium jaringan Huawei' },
      { image: showcaseTkj, alt: 'Peninjauan perangkat jaringan berskala besar' },
      { image: gedungSekolah, alt: 'Pelepasan rombongan kunjungan industri di sekolah' },
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
    kutipan: {
      teks: 'Formatnya sama persis dengan latihan harian kami, jadi yang tersisa di hari lomba tinggal menjaga ketenangan.',
      oleh: 'Peraih medali perak Web Technologies',
    },
    galeri: [
      { image: prestasi1, alt: 'Dua siswa peraih medali perak World Skills Asia 2025' },
      { image: showcaseRpl, alt: 'Hasil kerja pada kategori Web Technologies' },
      { image: showcaseTkj, alt: 'Praktik kategori Network Systems' },
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
    kutipan: {
      teks: 'Robot kami sempat gagal di uji coba terakhir. Semalaman diperbaiki, dan besoknya justru jadi yang tercepat.',
      oleh: 'Ketua tim robotika',
    },
    galeri: [
      { image: prestasi3, alt: 'Tim robotika bersama piala KRI Nasional 2025' },
      { image: labKomputer, alt: 'Perakitan dan kalibrasi robot sebelum lomba' },
      { image: studioMultimedia, alt: 'Pengujian lintasan di ruang latihan' },
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
    kutipan: {
      teks: 'Ruang ini dibuka bukan untuk dipamerkan, tapi supaya dipakai siswa setiap hari.',
      oleh: 'Kepala SMK Telkom Purwokerto',
    },
    galeri: [
      { image: labKomputer, alt: 'Ruang AI Center dengan perangkat berspesifikasi tinggi' },
      { image: studioMultimedia, alt: 'Area kerja kelompok di dalam AI Center' },
      { image: gedungSekolah, alt: 'Gedung tempat AI Center berada' },
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
    kutipan: {
      teks: 'Kerja sama ini menyangkut tempat magang, materi ajar, sampai jalur rekrutmen lulusan.',
      oleh: 'Perwakilan PT Telkom Indonesia',
    },
    galeri: [
      { image: gedungSekolah, alt: 'Penandatanganan nota kesepahaman di aula sekolah' },
      { image: guruGroup, alt: 'Perwakilan sekolah dan mitra industri' },
      { image: perpustakaan, alt: 'Ruang pertemuan tempat pembahasan kerja sama' },
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
    kutipan: {
      teks: 'Belajar sejarah di depan bangunannya langsung terasa berbeda dibanding membacanya di kelas.',
      oleh: 'Peserta outing class kelas X',
    },
    galeri: [
      { image: heroPanel, alt: 'Rombongan siswa saat outing class' },
      { image: mapImg, alt: 'Rute perjalanan Purwokerto menuju Yogyakarta' },
      { image: guruGroup, alt: 'Guru pendamping bersama peserta' },
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
    kutipan: {
      teks: 'Desain yang bagus itu yang bisa dipakai orang tanpa dijelaskan lebih dulu.',
      oleh: 'Praktisi UI/UX pemateri workshop',
    },
    galeri: [
      { image: studioMultimedia, alt: 'Sesi workshop UI/UX di studio multimedia' },
      { image: jurusanPg, alt: 'Hasil rancangan antarmuka karya siswa' },
      { image: labKomputer, alt: 'Praktik membuat purwarupa antarmuka' },
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
    kutipan: {
      teks: 'Seleksi internal ini sengaja dibuat lebih berat dari lombanya, supaya tidak ada kejutan di hari H.',
      oleh: 'Guru pembina Gemastik',
    },
    galeri: [
      { image: showcasePg, alt: 'Peserta seleksi internal mempresentasikan karyanya' },
      { image: labKomputer, alt: 'Pengerjaan studi kasus dengan batas waktu' },
      { image: prestasi3, alt: 'Piala Gemastik tahun sebelumnya sebagai target tim' },
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
    kutipan: {
      teks: 'Kuota gelombang kedua lebih sedikit, jadi berkas sebaiknya disiapkan jauh sebelum hari terakhir.',
      oleh: 'Panitia PPDB',
    },
    galeri: [
      { image: heroPanel, alt: 'Sosialisasi PPDB gelombang 2 kepada calon siswa' },
      { image: gedungSekolah, alt: 'Gedung sekolah yang menjadi tujuan pendaftaran' },
      { image: perpustakaan, alt: 'Fasilitas yang bisa dipakai siswa baru' },
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
    kutipan: {
      teks: 'Kami datang mencari lulusan yang sudah terbiasa bekerja dalam tim, bukan sekadar hafal teori.',
      oleh: 'Perekrut mitra industri',
    },
    galeri: [
      { image: gedungSekolah, alt: 'Bursa kerja campus hiring di aula sekolah' },
      { image: guruGroup, alt: 'Sesi wawancara bersama perekrut' },
      { image: labKomputer, alt: 'Tes kemampuan teknis bagi pelamar' },
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
    tenggat: { label: 'Batas akhir pendaftaran', tanggal: '30 Juni 2026', catatan: 'Kuota gelombang 2 lebih terbatas dari gelombang 1.' },
    langkah: [
      'Buat akun di laman PPDB resmi sekolah menggunakan surel aktif.',
      'Isi formulir data diri dan pilih dua program keahlian sesuai urutan minat.',
      'Unggah seluruh berkas persyaratan dalam format PDF atau JPG.',
      'Lakukan konfirmasi pendaftaran dan simpan nomor pendaftaran yang diterbitkan.',
    ],
    berkas: ['Rapor semester terakhir', 'Kartu keluarga', 'Akta kelahiran', 'Pas foto terbaru'],
    kontak: { nama: 'Panitia PPDB', detail: 'Ruang Tata Usaha, Senin-Jumat pukul 08.00-15.00' },
    aksi: { label: 'Buka Laman PPDB', href: '/ppdb' },
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
    tenggat: { label: 'Periode pendaftaran', tanggal: '15 Mei 2026', catatan: 'Gelombang dengan kuota terbanyak sepanjang masa pendaftaran.' },
    langkah: [
      'Daftarkan diri melalui laman PPDB dan lengkapi data rapor.',
      'Ikuti tes minat daring pada tanggal yang ditentukan panitia.',
      'Pantau hasil seleksi melalui laman PPDB dan surel terdaftar.',
      'Lakukan daftar ulang sesuai jadwal bila dinyatakan diterima.',
    ],
    berkas: ['Rapor semester 1-5', 'Kartu keluarga', 'Surat keterangan siswa', 'Pas foto terbaru'],
    kontak: { nama: 'Panitia PPDB', detail: 'Ruang Tata Usaha, Senin-Jumat pukul 08.00-15.00' },
    aksi: { label: 'Buka Laman PPDB', href: '/ppdb' },
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
    tenggat: { label: 'Pelaksanaan ujian', tanggal: '15 Mei 2026', catatan: 'Hadir lima belas menit sebelum sesi dimulai.' },
    langkah: [
      'Unduh jadwal lengkap melalui portal siswa.',
      'Periksa nomor ruang dan sesi ujian masing-masing.',
      'Siapkan kartu pelajar sebagai syarat masuk ruang ujian.',
      'Ajukan ujian susulan lewat wali kelas bila berhalangan hadir.',
    ],
    berkas: ['Kartu pelajar', 'Kartu peserta ujian', 'Alat tulis pribadi'],
    kontak: { nama: 'Wakil Kepala Bidang Kurikulum', detail: 'Ruang Kurikulum, Senin-Jumat pukul 08.00-14.00' },
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
    tenggat: { label: 'Batas pendaftaran peserta', tanggal: '18 Mei 2026', catatan: 'Kuota peserta dibatasi agar setiap siswa mendapat pendampingan.' },
    langkah: [
      'Daftar melalui wali kelas atau ketua jurusan masing-masing.',
      'Pastikan laptop pribadi sudah terpasang perangkat lunak yang diumumkan panitia.',
      'Hadir di laboratorium sesuai sesi yang dibagikan panitia.',
      'Kumpulkan hasil latihan di akhir hari kedua untuk memperoleh sertifikat.',
    ],
    berkas: ['Kartu pelajar', 'Laptop pribadi', 'Formulir pendaftaran peserta'],
    kontak: { nama: 'Panitia Workshop', detail: 'Laboratorium AI Center, jam istirahat sekolah' },
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
    tenggat: { label: 'Batas pengumpulan izin orang tua', tanggal: '12 Mei 2026', catatan: 'Peserta tanpa surat izin tidak dapat diberangkatkan.' },
    langkah: [
      'Ambil formulir izin orang tua di wali kelas.',
      'Kembalikan formulir yang sudah ditandatangani sebelum batas waktu.',
      'Ikuti pengarahan teknis satu hari sebelum keberangkatan.',
      'Berkumpul di titik keberangkatan sesuai jadwal yang diumumkan.',
    ],
    berkas: ['Surat izin orang tua', 'Kartu pelajar', 'Kartu identitas kesehatan'],
    kontak: { nama: 'Panitia Kunjungan Industri', detail: 'Ruang Hubungan Industri, Senin-Jumat pukul 09.00-14.00' },
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
    tenggat: { label: 'Pengumuman hasil kelulusan', tanggal: '5 Mei 2026', catatan: 'Hasil diumumkan serentak melalui portal siswa.' },
    langkah: [
      'Masuk ke portal siswa menggunakan akun masing-masing.',
      'Periksa status kelulusan pada halaman pengumuman.',
      'Unduh dan simpan surat keterangan lulus sementara.',
      'Ikuti jadwal pengambilan ijazah yang diumumkan menyusul.',
    ],
    berkas: ['Akun portal siswa', 'Kartu pelajar', 'Bukti bebas tanggungan perpustakaan'],
    kontak: { nama: 'Ruang Tata Usaha', detail: 'Senin-Jumat pukul 08.00-15.00' },
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
  label: 'Breaking News',
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
      image: labKomputer,
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
      image: guruGroup,
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
      image: pengumumanHeroImg,
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
      image: gedungSekolah,
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
    { alt: 'Siswa di studio multimedia', image: studioMultimedia },
    { alt: 'Praktik jaringan siswa', image: showcaseTkj },
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

/* =========================================================
   ADMIN PANEL
   Data khusus panel admin, dipisah dari data situs publik karena isinya memang
   berbeda: tabel admin memuat status, thumbnail, dan berkas pendaftar yang
   tidak pernah tampil di halaman publik.
   ========================================================= */

export const adminProfil = {
  nama: 'Admin SMK Telkom',
  peran: 'Administrator',
  notifikasi: 5,
  placeholderCari: 'Cari sesuatu...',
};

export const adminSekolah = {
  nama: 'SMK Telkom Purwokerto',
  alamat: ['Jl. D.I. Panjaitan No.128', 'Purwokerto, Jawa Tengah'],
  website: 'https://smk-telkom-purwokerto.vercel.app/',
};

// Nama ikon dipetakan ke komponennya di DashboardSidebar, jadi berkas data ini
// tetap bebas dari impor komponen.
export const adminMenu = [
  { label: 'Dashboard', to: '/dashboard', icon: 'dashboard', end: true },
  { label: 'Manajemen PPDB', to: '/dashboard/ppdb', icon: 'ppdb' },
  { label: 'Jurusan', to: '/dashboard/jurusan', icon: 'jurusan' },
  { label: 'Prestasi', to: '/dashboard/prestasi', icon: 'prestasi' },
  { label: 'BKK', to: '/dashboard/bkk', icon: 'bkk' },
  { label: 'Berita', to: '/dashboard/berita', icon: 'berita' },
  { label: 'Pengumuman', to: '/dashboard/pengumuman', icon: 'pengumuman' },
  { label: 'Pengaturan', to: '/dashboard/pengaturan', icon: 'pengaturan' },
];

/* ── Manajemen Berita ── */

export const adminKategoriBerita = ['Prestasi', 'Kegiatan', 'PPDB', 'BKK'];
export const adminStatusBerita = ['Published', 'Draft'];

// Tanggal disimpan dalam format ISO supaya bisa langsung dipakai <input type="date">;
// tampilannya diformat ke "24 Mei 2025" oleh helper tanggal.
export const adminBerita = [
  { id: 1, judul: 'SMK Telkom Purwokerto Raih Juara 1 Lomba IoT Tingkat Nasional', kategori: 'Prestasi', tanggal: '2025-05-24', status: 'Published', konten: 'Tim IoT SMK Telkom Purwokerto meraih juara 1 pada ajang tingkat nasional setelah bersaing dengan puluhan sekolah dari seluruh Indonesia.' },
  { id: 2, judul: 'Kunjungan Industri ke PT Telkom Indonesia Tbk Jakarta', kategori: 'Kegiatan', tanggal: '2025-05-21', status: 'Published', konten: 'Siswa kelas XI mengikuti kunjungan industri ke kantor pusat PT Telkom Indonesia untuk melihat langsung operasional jaringan berskala nasional.' },
  { id: 3, judul: 'Informasi Penerimaan Peserta Didik Baru Tahun Ajaran 2025/2026', kategori: 'PPDB', tanggal: '2025-05-20', status: 'Published', konten: 'Pendaftaran peserta didik baru dibuka untuk seluruh program keahlian. Seluruh proses dilakukan daring melalui laman PPDB sekolah.' },
  { id: 4, judul: 'Workshop Cyber Security Bersama Industri Partner', kategori: 'BKK', tanggal: '2025-05-18', status: 'Draft', konten: 'Workshop keamanan siber diselenggarakan bersama mitra industri untuk membekali siswa dengan praktik pengamanan jaringan terkini.' },
  { id: 5, judul: 'Upacara Peringatan Hari Pendidikan Nasional 2025', kategori: 'Kegiatan', tanggal: '2025-05-17', status: 'Published', konten: 'Seluruh warga sekolah mengikuti upacara peringatan Hari Pendidikan Nasional di lapangan utama sekolah.' },
  { id: 6, judul: 'Tim Robotik Melaju ke Babak Final Kompetisi Provinsi', kategori: 'Prestasi', tanggal: '2025-05-15', status: 'Published', konten: 'Tim robotik sekolah memastikan tempat di babak final setelah menyisihkan sepuluh tim lain pada babak penyisihan.' },
  { id: 7, judul: 'Pembukaan Lab AI Center untuk Pembelajaran Siswa', kategori: 'Kegiatan', tanggal: '2025-05-14', status: 'Published', konten: 'Laboratorium AI Center resmi dibuka dan langsung dipakai untuk pembelajaran kecerdasan buatan pada hari yang sama.' },
  { id: 8, judul: 'Campus Hiring Bersama Enam Perusahaan Mitra', kategori: 'BKK', tanggal: '2025-05-12', status: 'Published', konten: 'Bursa Kerja Khusus menghadirkan enam perusahaan mitra untuk merekrut alumni pada acara campus hiring tahunan.' },
  { id: 9, judul: 'Sosialisasi Jalur Prestasi PPDB Gelombang Pertama', kategori: 'PPDB', tanggal: '2025-05-10', status: 'Draft', konten: 'Panitia PPDB menyampaikan mekanisme jalur prestasi kepada calon peserta didik dan orang tua melalui sesi daring.' },
  { id: 10, judul: 'Juara 2 Lomba Web Design Tingkat Provinsi', kategori: 'Prestasi', tanggal: '2025-05-09', status: 'Published', konten: 'Perwakilan sekolah meraih juara 2 pada lomba web design tingkat provinsi yang diikuti puluhan peserta.' },
  { id: 11, judul: 'Pelatihan Sertifikasi Jaringan untuk Siswa Kelas XII', kategori: 'Kegiatan', tanggal: '2025-05-08', status: 'Published', konten: 'Siswa kelas XII mengikuti pelatihan intensif sebagai persiapan mengambil sertifikasi jaringan berstandar industri.' },
  { id: 12, judul: 'Kerja Sama Baru dengan Perusahaan Teknologi Nasional', kategori: 'BKK', tanggal: '2025-05-06', status: 'Published', konten: 'Sekolah menandatangani kerja sama penempatan kerja dan magang dengan sebuah perusahaan teknologi nasional.' },
  { id: 13, judul: 'Jadwal Uji Kompetensi Keahlian Tahun 2025', kategori: 'PPDB', tanggal: '2025-05-05', status: 'Draft', konten: 'Jadwal uji kompetensi keahlian untuk seluruh program keahlian telah diterbitkan dan dapat diunduh di portal siswa.' },
  { id: 14, judul: 'Siswa Berbagi Cerita Magang di Perusahaan Rintisan', kategori: 'Kegiatan', tanggal: '2025-05-03', status: 'Published', konten: 'Beberapa siswa membagikan pengalaman magang mereka di perusahaan rintisan kepada adik kelas dalam sesi berbagi.' },
  { id: 15, judul: 'Medali Perak Kompetisi Keterampilan Tingkat Asia', kategori: 'Prestasi', tanggal: '2025-05-02', status: 'Published', konten: 'Dua siswa membawa pulang medali perak dari kompetisi keterampilan tingkat Asia pada kategori teknologi web.' },
  { id: 16, judul: 'Renovasi Perpustakaan Sekolah Rampung', kategori: 'Kegiatan', tanggal: '2025-04-30', status: 'Draft', konten: 'Renovasi perpustakaan selesai dengan penambahan ruang diskusi dan area baca yang lebih luas untuk siswa.' },
  { id: 17, judul: 'Lowongan Magang Terbaru dari Mitra Industri', kategori: 'BKK', tanggal: '2025-04-28', status: 'Published', konten: 'Sejumlah lowongan magang terbaru dibuka untuk siswa kelas XI dan XII pada berbagai bidang teknologi.' },
  { id: 18, judul: 'Panduan Pengisian Formulir Pendaftaran Daring', kategori: 'PPDB', tanggal: '2025-04-26', status: 'Published', konten: 'Panduan langkah demi langkah pengisian formulir pendaftaran daring diterbitkan untuk memudahkan calon pendaftar.' },
  { id: 19, judul: 'Juara Harapan 1 Lomba Robotik Tingkat Provinsi', kategori: 'Prestasi', tanggal: '2025-04-25', status: 'Published', konten: 'Tim robotik sekolah meraih juara harapan 1 pada lomba robotik tingkat provinsi tahun ini.' },
  { id: 20, judul: 'Pekan Olahraga Antar Kelas Resmi Dibuka', kategori: 'Kegiatan', tanggal: '2025-04-24', status: 'Draft', konten: 'Pekan olahraga antar kelas dibuka dengan pertandingan futsal dan berlangsung selama satu pekan penuh.' },
];

/* ── Manajemen PPDB ── */

export const adminPpdbStats = [
  { label: 'Total Pendaftar', value: '1.248', nada: 'merah', icon: 'ppdb' },
  { label: 'Pendaftar Baru', value: '312', nada: 'biru', icon: 'baru' },
  { label: 'Sudah Diverifikasi', value: '856', nada: 'hijau', icon: 'verifikasi' },
  { label: 'Belum Diverifikasi', value: '392', nada: 'oranye', icon: 'tunggu' },
];

// Kode program di panel admin memakai penamaan kurikulum terbaru (PPLG, TJKT,
// DKV, AKL) sesuai desain, berbeda dari singkatan di situs publik.
export const adminProgramKeahlian = ['PPLG', 'TJKT', 'DKV', 'AKL'];

export const adminPendaftar = [
  {
    id: 1,
    nama: 'Rizky Pratama',
    asalSekolah: 'SMP Negeri 1 Purwokerto',
    program: 'PPLG',
    tanggal: '2025-05-25',
    status: 'Diverifikasi',
    tempatLahir: 'Purwokerto',
    tanggalLahir: '14 Maret 2010',
    jenisKelamin: 'Laki-laki',
    nisn: '0123456784',
    alamat: 'Jl. Merdeka No. 10, Purwokerto',
    telepon: '0812-3456-7890',
    email: 'rizky.pratama@email.com',
    pilihan1: 'PPLG',
    pilihan2: 'TJKT',
  },
  {
    id: 2,
    nama: 'Salsabila Azzahra',
    asalSekolah: 'SMP Muhammadiyah 2',
    program: 'TJKT',
    tanggal: '2025-05-25',
    status: 'Belum Diverifikasi',
    tempatLahir: 'Banyumas',
    tanggalLahir: '2 Juni 2010',
    jenisKelamin: 'Perempuan',
    nisn: '0123456785',
    alamat: 'Jl. Gatot Subroto No. 22, Banyumas',
    telepon: '0813-2244-8899',
    email: 'salsabila.azzahra@email.com',
    pilihan1: 'TJKT',
    pilihan2: 'PPLG',
  },
  {
    id: 3,
    nama: 'Fajar Maulana',
    asalSekolah: 'SMP Negeri 3 Purwokerto',
    program: 'DKV',
    tanggal: '2025-05-24',
    status: 'Diverifikasi',
    tempatLahir: 'Purbalingga',
    tanggalLahir: '19 Januari 2010',
    jenisKelamin: 'Laki-laki',
    nisn: '0123456786',
    alamat: 'Jl. Ahmad Yani No. 5, Purbalingga',
    telepon: '0857-1122-3344',
    email: 'fajar.maulana@email.com',
    pilihan1: 'DKV',
    pilihan2: 'PPLG',
  },
  {
    id: 4,
    nama: 'Nadya Putri',
    asalSekolah: 'SMP Islam Al Ayyubi',
    program: 'AKL',
    tanggal: '2025-05-24',
    status: 'Belum Diverifikasi',
    tempatLahir: 'Cilacap',
    tanggalLahir: '30 September 2009',
    jenisKelamin: 'Perempuan',
    nisn: '0123456787',
    alamat: 'Jl. Diponegoro No. 41, Cilacap',
    telepon: '0895-6677-1200',
    email: 'nadya.putri@email.com',
    pilihan1: 'AKL',
    pilihan2: 'DKV',
  },
  {
    id: 5,
    nama: 'Daffa Alfarizi',
    asalSekolah: 'SMP Negeri 2 Purwokerto',
    program: 'PPLG',
    tanggal: '2025-05-23',
    status: 'Diverifikasi',
    tempatLahir: 'Purwokerto',
    tanggalLahir: '7 Juli 2010',
    jenisKelamin: 'Laki-laki',
    nisn: '0123456788',
    alamat: 'Jl. S. Parman No. 88, Purwokerto',
    telepon: '0821-9090-1122',
    email: 'daffa.alfarizi@email.com',
    pilihan1: 'PPLG',
    pilihan2: 'TJKT',
  },
  {
    id: 6,
    nama: 'Aisyah Nur Fadillah',
    asalSekolah: 'SMP Negeri 5 Purwokerto',
    program: 'DKV',
    tanggal: '2025-05-23',
    status: 'Belum Diverifikasi',
    tempatLahir: 'Purwokerto',
    tanggalLahir: '11 Februari 2010',
    jenisKelamin: 'Perempuan',
    nisn: '0123456789',
    alamat: 'Jl. Sudirman No. 17, Purwokerto',
    telepon: '0838-4455-6677',
    email: 'aisyah.nur@email.com',
    pilihan1: 'DKV',
    pilihan2: 'AKL',
  },
  {
    id: 7,
    nama: 'Bagas Nugroho',
    asalSekolah: 'SMP Negeri 4 Purwokerto',
    program: 'TJKT',
    tanggal: '2025-05-22',
    status: 'Diverifikasi',
    tempatLahir: 'Banjarnegara',
    tanggalLahir: '25 Agustus 2010',
    jenisKelamin: 'Laki-laki',
    nisn: '0123456790',
    alamat: 'Jl. Pemuda No. 3, Banjarnegara',
    telepon: '0812-7788-9911',
    email: 'bagas.nugroho@email.com',
    pilihan1: 'TJKT',
    pilihan2: 'PPLG',
  },
  {
    id: 8,
    nama: 'Salma Khairunnisa',
    asalSekolah: 'SMP Muhammadiyah 1',
    program: 'AKL',
    tanggal: '2025-05-22',
    status: 'Belum Diverifikasi',
    tempatLahir: 'Kebumen',
    tanggalLahir: '3 Desember 2009',
    jenisKelamin: 'Perempuan',
    nisn: '0123456791',
    alamat: 'Jl. Veteran No. 60, Kebumen',
    telepon: '0896-3322-1144',
    email: 'salma.khairunnisa@email.com',
    pilihan1: 'AKL',
    pilihan2: 'DKV',
  },
];

// Berkas yang sama diminta dari setiap pendaftar, jadi disimpan sekali saja.
export const adminBerkasPendaftar = [
  { nama: 'Akta Kelahiran.pdf' },
  { nama: 'Kartu Keluarga.pdf' },
  { nama: 'Rapor Semester 1-5.pdf' },
  { nama: 'Pas Foto 3x4.jpg' },
];

/* ── Manajemen Jurusan ── */

export const adminJurusan = [
  { id: 1, nama: 'PPLG (Pengembangan Perangkat Lunak dan Gim)', kode: 'PPLG', deskripsi: 'Mempelajari pengembangan software dan gim.', jumlahSiswa: 342 },
  { id: 2, nama: 'TJKT (Teknik Jaringan Komputer dan Telekomunikasi)', kode: 'TJKT', deskripsi: 'Mempelajari jaringan komputer dan telekomunikasi.', jumlahSiswa: 318 },
  { id: 3, nama: 'DKV (Desain Komunikasi Visual)', kode: 'DKV', deskripsi: 'Mempelajari desain grafis dan multimedia.', jumlahSiswa: 210 },
  { id: 4, nama: 'AKL (Akuntansi dan Keuangan Lembaga)', kode: 'AKL', deskripsi: 'Mempelajari akuntansi dan keuangan.', jumlahSiswa: 186 },
];

/* ── Manajemen Prestasi ── */

export const adminTingkatPrestasi = ['Nasional', 'Provinsi', 'Kota'];

export const adminPrestasi = [
  { id: 1, nama: 'Juara 1 Lomba IoT Tingkat Nasional', tingkat: 'Nasional', diraihOleh: 'Tim Siswa SMK Telkom Purwokerto', tanggal: '2025-05-24' },
  { id: 2, nama: 'Juara 2 Lomba Web Design', tingkat: 'Provinsi', diraihOleh: 'Daffa Alfarizi', tanggal: '2025-05-10' },
  { id: 3, nama: 'Juara 3 Futsal Antar Pelajar', tingkat: 'Kota', diraihOleh: 'Tim Futsal SMK Telkom', tanggal: '2025-05-05' },
  { id: 4, nama: 'Juara Harapan 1 Lomba Robotik', tingkat: 'Provinsi', diraihOleh: 'Tim Robotik SMK Telkom', tanggal: '2025-04-28' },
];

/* ── Manajemen BKK ── */

export const adminBkkStats = [
  { label: 'Total Lowongan', value: '28', nada: 'hijau', icon: 'lowongan' },
  { label: 'Perusahaan Mitra', value: '42', nada: 'biru', icon: 'mitra' },
  { label: 'Siswa Terserap', value: '156', nada: 'oranye', icon: 'terserap' },
  { label: 'Total Alumni', value: '1.256', nada: 'ungu', icon: 'alumni' },
];

export const adminLowongan = [
  { id: 1, posisi: 'Junior Programmer', perusahaan: 'PT Telkom Indonesia', tanggalPosting: '2025-05-24', batasLamaran: '2025-06-10' },
  { id: 2, posisi: 'Network Engineer', perusahaan: 'PT Huawei Indonesia', tanggalPosting: '2025-05-23', batasLamaran: '2025-06-08' },
  { id: 3, posisi: 'Graphic Designer', perusahaan: 'PT Ruang Raya Indonesia', tanggalPosting: '2025-05-22', batasLamaran: '2025-06-06' },
  { id: 4, posisi: 'Admin Keuangan', perusahaan: 'PT Sinar Saro', tanggalPosting: '2025-05-21', batasLamaran: '2025-06-03' },
  { id: 5, posisi: 'IT Support', perusahaan: 'PT Astra International', tanggalPosting: '2025-05-19', batasLamaran: '2025-06-01' },
];

/* ── Pengaturan ── */

export const adminTabPengaturan = ['Profil Sekolah', 'Akun Admin', 'Pengaturan Umum'];

export const adminProfilSekolah = {
  namaSekolah: 'SMK Telkom Purwokerto',
  npsn: '20303020',
  alamat: 'Jl. D.I. Panjaitan No.128, Purwokerto, Jawa Tengah',
  telepon: '(0281) 635180',
  email: 'info@smktelkom-pwt.sch.id',
  website: 'https://smk-telkom-purwokerto.vercel.app/',
};

export const adminAkun = {
  namaLengkap: 'Admin SMK Telkom',
  email: 'admin@smktelkom-pwt.sch.id',
  peran: 'Administrator',
};

export const adminPengaturanUmum = {
  tahunAjaran: '2025/2026',
  statusPpdb: 'Dibuka',
  beritaPerHalaman: '5',
};

/* =========================================================
   PORTAL PPDB
   Alur pendaftaran calon siswa: daftar akun, verifikasi email, isi formulir,
   unggah berkas, sampai bukti submit.
   ========================================================= */

export const ppdbMeta = {
  namaSekolah: 'SMK Telkom Purwokerto',
  sistem: 'PPDB System 2027/2028',
  portal: 'Portal PPDB 2027',
  tahun: '2027',
  hakCipta: '© 2027 SMK Telkom Purwokerto. All Rights Reserved.',
  waHelpdesk: 'https://wa.me/6281234567890',
};

export const ppdbPanelDaftar = {
  badge: 'Langkah 1 dari 2',
  judul: 'Mulai Masa Depan\nDigitalmu di Sini.',
  deskripsi:
    'Buat akun resmi untuk mengakses portal pendaftaran, memilih jurusan favorit, dan mengunggah berkas seleksi.',
  fitur: [
    { icon: 'centang', teks: 'Prosedur pendaftaran 100% online' },
    { icon: 'kirim', teks: 'Notifikasi kelulusan via WhatsApp & Portal' },
  ],
  bantuanLabel: 'Butuh bantuan?',
  bantuanTeks: 'CS PPDB Telkom',
};

export const ppdbPanelMasuk = {
  badge: 'Portal Calon Siswa',
  judul: 'Selamat Datang\nKembali!',
  deskripsi:
    'Masuk untuk memantau status pendaftaran, melengkapi berkas biodata, dan mengunduh kartu peserta seleksi.',
  fitur: [{ icon: 'pantau', teks: 'Pantau Hasil Seleksi Real-Time' }],
  bantuanLabel: 'Lupa akun?',
  bantuanTeks: 'Bantuan Login',
};

// Nama jurusan mengikuti penamaan kurikulum terbaru, sama dengan panel admin.
export const ppdbJurusanPilihan = [
  'PPLG (Pengembangan Perangkat Lunak dan Gim)',
  'TJKT (Teknik Jaringan Komputer dan Telekomunikasi)',
  'DKV (Desain Komunikasi Visual)',
  'AKL (Akuntansi dan Keuangan Lembaga)',
];

export const ppdbVerifikasi = {
  badge: 'Langkah 2 dari 2: Verifikasi Akun',
  judul: 'Cek Email Anda',
  deskripsi: 'Kami telah mengirimkan tautan konfirmasi pendaftaran ke alamat email',
  emailContoh: 'siswa@gmail.com',
  ctaLabel: 'Buka Gmail Langsung',
  ctaUrl: 'https://mail.google.com',
  catatanJudul: 'Belum menerima email?',
  catatan: [
    'Periksa folder Spam / Junk pada email Anda.',
    'Pastikan penulisan alamat email saat registrasi sudah benar.',
  ],
  ubahLabel: 'Salah email?',
  ubahTeks: 'Ubah Email',
  kirimUlangLabel: 'Kirim Ulang',
  jedaKirimUlang: 59,
};

export const ppdbAgama = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'];

export const ppdbTahunLulus = ['2027', '2026', '2025', '2024'];

// `catatan` hanya dipakai baris terakhir, mengikuti desain yang menampilkan
// keterangan kecil di bawah nama mata pelajarannya.
export const ppdbMataPelajaran = [
  { nama: 'Bahasa Indonesia' },
  { nama: 'Matematika' },
  { nama: 'Ilmu Pengetahuan Alam' },
  { nama: 'Bahasa Inggris' },
  { nama: 'Informatika / TIK', catatan: 'Dasar Keahlian Produktif' },
];

export const ppdbSemester = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5'];

export const ppdbDokumen = [
  {
    id: 'pas-foto',
    nama: 'Pas Foto Terbaru (3x4 atau 4x6 Background Merah/Biru)',
    format: 'Format: JPG, JPEG, PNG. Maks. 2MB',
    tipe: 'image/jpeg,image/png',
    maksMb: 2,
  },
  {
    id: 'rapor',
    nama: 'Scan Dokumen Rapor Semester 1 - 5 (Digabung 1 PDF)',
    format: 'Format: PDF. Maks: 5MB',
    tipe: 'application/pdf',
    maksMb: 5,
  },
  {
    id: 'akta',
    nama: 'Akta Kelahiran / Surat Kenal Lahir',
    format: 'Format: PDF, JPG, PNG. Maks. 2MB',
    tipe: 'application/pdf,image/jpeg,image/png',
    maksMb: 2,
  },
  {
    id: 'kk',
    nama: 'Kartu Keluarga (KK) Terbaru',
    format: 'Format: PDF, JPG, PNG. Maks. 2MB',
    tipe: 'application/pdf,image/jpeg,image/png',
    maksMb: 2,
  },
];

// Tiga langkah setelah calon siswa masuk portal. Desain memberi penomoran
// sendiri untuk tahap akun ("Langkah 1 dari 2"), jadi indikator ini khusus
// tahap portal dan tidak menabrak badge di halaman Daftar/Verifikasi.
export const ppdbLangkahPortal = [
  { id: 'formulir', label: 'Biodata & Nilai', to: '/ppdb/formulir' },
  { id: 'berkas', label: 'Unggah Berkas', to: '/ppdb/berkas' },
  { id: 'selesai', label: 'Selesai', to: '/ppdb/selesai' },
];

export const ppdbSukses = {
  judul: 'Pendaftaran Berhasil Disubmit!',
  pesan:
    'Terima kasih telah melengkapi seluruh rangkaian data dan berkas. Data Anda saat ini berada di dalam antrean verifikasi oleh panitia PPDB SMK Telkom Purwokerto.',
  kartu: [
    // nilai null diisi nomor registrasi hasil submit, bukan ditulis di sini
    { label: 'Nomor Registrasi', nilai: null, catatan: 'Aktif & Terdaftar', titikCatatan: 'hijau' },
    {
      label: 'Status Berkas',
      nilai: 'Menunggu Verifikasi',
      nadaNilai: 'oranye',
      titikNilai: 'oranye',
      catatan: 'Estimasi waktu: 1x24 jam kerja',
    },
    {
      label: 'Jalur Seleksi',
      nilai: 'Jalur Prestasi / Reguler',
      catatan: 'SMK Telkom Purwokerto',
      nadaCatatan: 'merah',
    },
  ],
  langkahJudul: 'Langkah Selanjutnya & Dokumen',
  langkah: [
    {
      icon: 'cetak',
      judul: 'Cetak Kartu Peserta PPDB',
      deskripsi: 'Unduh bukti pendaftaran format PDF',
    },
    {
      icon: 'jadwal',
      judul: 'Jadwal & Tahapan Seleksi',
      deskripsi: 'Cek tanggal tes dan pengumuman',
    },
  ],
  bantuanTeks: 'Butuh bantuan atau ada kesalahan input data?',
  bantuanCta: 'Hubungi Panitia PPDB via WhatsApp',
};

// Dipakai header portal setelah calon siswa masuk.
export const ppdbAkunContoh = {
  nama: 'Aditya Nur Arif',
  nisn: '0081234567',
};

/* =========================================================
   HALAMAN PELENGKAP
   Isi untuk empat belas tujuan yang sebelumnya mendarat di "Segera Hadir".
   Slug di sini WAJIB sama dengan hasil slugify() pada kartu asalnya, karena
   tautannya dirakit dari judul kartu — bukan dari field slug.
   ========================================================= */

/* ── Agenda kegiatan: /berita/agenda/:slug ── */
export const agendaDetail = [
  {
    slug: 'semianar-cyber-security-bersama-telkom',
    kategori: 'Event',
    title: 'Semianar Cyber Security bersama Telkom',
    subtitle: 'Aula SMK Telkom Purwokerto, 24 Mei',
    date: '24 Mei 2025',
    image: labKomputer,
    lead: 'Seminar keamanan siber menghadirkan praktisi dari Telkom untuk membahas ancaman yang paling sering menimpa pengguna sehari-hari dan cara menghadapinya.',
    body: [
      'Materi dibuka dengan peragaan bagaimana sebuah kata sandi lemah bisa ditebak dalam hitungan detik, lalu dilanjutkan dengan cara menyusun kata sandi yang kuat namun tetap mudah diingat.',
      'Sesi kedua membahas rekayasa sosial: bagaimana penipu memancing korban lewat pesan singkat, surel palsu, dan tautan yang menyamar. Siswa diajak membedah contoh nyata yang pernah beredar.',
      'Peserta yang hadir penuh sampai akhir memperoleh sertifikat kehadiran yang dapat dilampirkan pada portofolio.',
    ],
    facts: [
      { label: 'Tempat', value: 'Aula SMK Telkom Purwokerto' },
      { label: 'Waktu', value: '24 Mei 2025, 08.00 - 12.00' },
      { label: 'Pemateri', value: 'Praktisi keamanan siber Telkom' },
      { label: 'Biaya', value: 'Gratis untuk siswa' },
    ],
  },
  {
    slug: 'pelatihan-ui-ux-design-untuk-siswa',
    kategori: 'Workshop',
    title: 'Pelatihan UI/UX Design Untuk Siswa',
    subtitle: 'Lab Multimedia, 28 Mei',
    date: '28 Mei 2025',
    image: studioMultimedia,
    lead: 'Pelatihan sehari penuh untuk mengenal proses merancang antarmuka, mulai dari memahami kebutuhan pengguna sampai menyusun purwarupa yang bisa dicoba.',
    body: [
      'Peserta memulai dengan wawancara singkat sesama peserta untuk melatih kepekaan menangkap kebutuhan yang sebenarnya, bukan sekadar keinginan yang diucapkan.',
      'Setelah itu setiap kelompok menyusun alur layar di atas kertas sebelum memindahkannya ke perkakas desain. Tahap ini sengaja dilakukan manual agar ide cepat diuji dan cepat pula dibuang bila tidak cocok.',
      'Hari ditutup dengan sesi saling menguji purwarupa antar kelompok, lalu memperbaikinya berdasarkan catatan yang terkumpul.',
    ],
    facts: [
      { label: 'Tempat', value: 'Lab Multimedia' },
      { label: 'Waktu', value: '28 Mei 2025, 08.00 - 15.00' },
      { label: 'Kuota', value: '30 siswa' },
      { label: 'Perlu dibawa', value: 'Laptop pribadi' },
    ],
  },
  {
    slug: 'campus-hiring-day-telkom-grup',
    kategori: 'Career',
    title: 'Campus Hiring Day Telkom Grup',
    subtitle: 'Aula SMK Telkom Purwokerto, 2 Juni',
    date: '2 Juni 2025',
    image: guruGroup,
    lead: 'Hari rekrutmen bersama perusahaan di lingkungan Telkom Grup, terbuka untuk siswa kelas XII dan alumni yang sedang mencari penempatan kerja.',
    body: [
      'Setiap perusahaan membuka meja sendiri untuk sesi tanya jawab, penerimaan berkas, dan wawancara awal di tempat bagi pelamar yang berkasnya lengkap.',
      'Panitia menyarankan peserta membawa berkas cetak rangkap tiga dan mengenakan pakaian rapi, karena sebagian perusahaan langsung menjadwalkan wawancara lanjutan pada hari yang sama.',
      'Bursa Kerja Khusus sekolah membuka pendampingan penyusunan berkas satu pekan sebelum acara bagi yang membutuhkan.',
    ],
    facts: [
      { label: 'Tempat', value: 'Aula SMK Telkom Purwokerto' },
      { label: 'Waktu', value: '2 Juni 2025, 08.00 - 16.00' },
      { label: 'Peserta', value: 'Siswa kelas XII dan alumni' },
      { label: 'Berkas', value: 'CV, ijazah, transkrip nilai' },
    ],
  },
];

/* ── Galeri kegiatan: /galeri dan /galeri/:slug ── */
export const galeriIndex = {
  eyebrow: 'Dokumentasi Sekolah',
  title: 'Galeri Kegiatan',
  deskripsi:
    'Kumpulan momen dari kegiatan belajar, lomba, dan acara sekolah sepanjang tahun ajaran berjalan.',
};

export const galeriDetail = [
  {
    slug: 'tim-siswa-berprestasi',
    kategori: 'Prestasi',
    title: 'Tim Siswa Berprestasi',
    subtitle: 'Dokumentasi penerimaan penghargaan',
    date: '24 Agustus 2024',
    image: prestasi1,
    lead: 'Momen tim siswa menerima penghargaan setelah menyelesaikan rangkaian lomba tingkat nasional.',
    body: [
      'Foto diambil tepat setelah pengumuman pemenang dibacakan. Tim yang tampak di gambar menjalani persiapan selama empat bulan dengan pendampingan guru produktif.',
      'Dokumentasi seperti ini disimpan sebagai arsip sekolah dan dipakai kembali untuk bahan pembinaan angkatan berikutnya.',
    ],
    facts: [
      { label: 'Kegiatan', value: 'Penyerahan penghargaan lomba' },
      { label: 'Lokasi', value: 'Aula SMK Telkom Purwokerto' },
    ],
  },
  {
    slug: 'siswa-di-studio-multimedia',
    kategori: 'Fasilitas',
    title: 'Siswa di Studio Multimedia',
    subtitle: 'Produksi konten dan aset visual',
    date: '14 Mei 2025',
    image: studioMultimedia,
    lead: 'Studio multimedia dipakai untuk produksi konten, penyuntingan video, dan pembuatan aset visual oleh siswa jurusan Pengembangan Game dan Desain Komunikasi Visual.',
    body: [
      'Ruangan ini dilengkapi perangkat penyuntingan, pen tablet, dan area perekaman sederhana yang bisa dipakai bergantian antar kelas.',
      'Sebagian besar karya yang tampil di Project Showcase dikerjakan di ruangan ini.',
    ],
    facts: [
      { label: 'Ruang', value: 'Studio Multimedia' },
      { label: 'Dipakai oleh', value: 'Jurusan PG dan DKV' },
    ],
  },
  {
    slug: 'praktik-jaringan-siswa',
    kategori: 'Praktik',
    title: 'Praktik Jaringan Siswa',
    subtitle: 'Konfigurasi perangkat di laboratorium',
    date: '8 Mei 2025',
    image: showcaseTkj,
    lead: 'Siswa jurusan jaringan berlatih memasang dan mengonfigurasi perangkat menggunakan alat yang sama dengan yang dipakai di industri.',
    body: [
      'Praktik dilakukan langsung pada router dan switch fisik, bukan hanya simulator, supaya siswa terbiasa dengan penanganan perangkat sungguhan.',
      'Setiap kelompok diberi skenario gangguan berbeda dan diminta menemukan penyebabnya lewat pembacaan log.',
    ],
    facts: [
      { label: 'Ruang', value: 'Laboratorium Jaringan' },
      { label: 'Perangkat', value: 'Router dan switch industri' },
    ],
  },
  {
    slug: 'siswa-mengerjakan-proyek',
    kategori: 'Kegiatan',
    title: 'Siswa Mengerjakan Proyek',
    subtitle: 'Kerja kelompok menjelang penilaian',
    date: '2 Mei 2025',
    image: prestasi2,
    lead: 'Suasana kerja kelompok menjelang penilaian proyek akhir semester, saat setiap tim merapikan hasil kerja sebelum dipresentasikan.',
    body: [
      'Proyek dikerjakan dalam tim kecil dengan pembagian peran menyerupai alur kerja di industri: ada yang menangani rancangan, ada yang menulis kode, ada yang menguji.',
      'Penilaian tidak hanya melihat hasil akhir, tetapi juga catatan perkembangan pekerjaan selama proses berlangsung.',
    ],
    facts: [
      { label: 'Kegiatan', value: 'Penilaian proyek akhir semester' },
      { label: 'Bentuk', value: 'Kerja tim' },
    ],
  },
];

/* ── Panduan karier BKK: /bkk/panduan dan /bkk/panduan/:slug ── */
export const panduanIndex = {
  eyebrow: 'Bursa Kerja Khusus',
  title: 'Panduan Karier',
  deskripsi:
    'Bahan siap pakai untuk menyiapkan berkas lamaran, menghadapi wawancara, dan merencanakan langkah karier setelah lulus.',
};

export const panduanDetail = [
  {
    slug: 'download-template-cv-profesional',
    kategori: 'Berkas Lamaran',
    title: 'Download Template CV Profesional',
    subtitle: 'Format satu halaman yang mudah dibaca perekrut',
    date: 'Diperbarui 12 Mei 2025',
    image: labKomputer,
    lead: 'Templat riwayat hidup satu halaman yang disusun mengikuti kebiasaan perekrut di industri teknologi: ringkas, mudah dipindai, dan menonjolkan bukti kerja.',
    body: [
      'Perekrut umumnya hanya memindai riwayat hidup selama beberapa detik pada tahap penyaringan awal. Karena itu bagian paling atas diisi keahlian dan pengalaman yang paling relevan dengan posisi yang dilamar, bukan riwayat pendidikan sejak sekolah dasar.',
      'Setiap pengalaman ditulis dengan pola tindakan dan hasil. Tulis apa yang dikerjakan, alat yang dipakai, dan hasilnya jika ada angkanya. Kalimat "membuat aplikasi kasir yang dipakai koperasi sekolah" jauh lebih berbobot daripada "menguasai pemrograman".',
      'Simpan berkas dalam format PDF dan beri nama sesuai pola Nama_Posisi_CV agar tidak tertukar di kotak masuk perekrut.',
    ],
    facts: [
      { label: 'Format', value: 'PDF, satu halaman' },
      { label: 'Cocok untuk', value: 'Lamaran kerja dan magang' },
      { label: 'Disusun oleh', value: 'Tim BKK sekolah' },
    ],
  },
  {
    slug: 'panduan-interview-kerja',
    kategori: 'Wawancara',
    title: 'Panduan Interview Kerja',
    subtitle: 'Persiapan sebelum, saat, dan sesudah wawancara',
    date: 'Diperbarui 10 Mei 2025',
    image: guruGroup,
    lead: 'Panduan menghadapi wawancara kerja pertama, disusun dari pertanyaan yang paling sering muncul pada perekrutan tingkat pemula di bidang teknologi.',
    body: [
      'Sebelum hari wawancara, pelajari apa yang dikerjakan perusahaan dan siapkan satu pertanyaan yang menunjukkan Anda benar-benar mencari tahu. Pertanyaan yang baik memberi kesan lebih kuat daripada jawaban yang dihafal.',
      'Saat wawancara, jawab pertanyaan pengalaman dengan urutan situasi, tindakan, dan hasil. Bila belum punya pengalaman kerja, proyek sekolah tetap sah dijadikan contoh selama diceritakan dengan jujur.',
      'Setelah selesai, kirim pesan terima kasih singkat dalam satu hari kerja. Langkah kecil ini jarang dilakukan pelamar lain dan membuat Anda lebih diingat.',
    ],
    facts: [
      { label: 'Isi', value: 'Daftar pertanyaan dan cara menjawab' },
      { label: 'Sesi latihan', value: 'Tersedia lewat BKK sekolah' },
      { label: 'Cocok untuk', value: 'Siswa kelas XII dan alumni' },
    ],
  },
  {
    slug: 'latihan-soal-dan-tips',
    kategori: 'Tes Seleksi',
    title: 'Latihan Soal dan Tips',
    subtitle: 'Kumpulan soal tes masuk kerja',
    date: 'Diperbarui 6 Mei 2025',
    image: perpustakaan,
    lead: 'Kumpulan soal latihan untuk tahap tes tertulis, mencakup kemampuan dasar, logika, dan pengetahuan teknis sesuai bidang keahlian.',
    body: [
      'Bagian kemampuan dasar menguji hitungan cepat dan pemahaman bacaan. Kuncinya bukan menghafal rumus, melainkan membiasakan diri mengerjakan dengan batas waktu.',
      'Bagian logika berisi pola gambar dan penalaran. Latihan rutin membuat pola-pola yang muncul terasa akrab sehingga waktu pengerjaan jauh lebih hemat.',
      'Bagian teknis disesuaikan dengan jurusan. Kerjakan soal sesuai bidang Anda dulu, baru melebar ke bidang lain jika masih ada waktu.',
    ],
    facts: [
      { label: 'Jumlah soal', value: 'Lebih dari 200 butir' },
      { label: 'Pembahasan', value: 'Disertakan di setiap paket' },
      { label: 'Bentuk', value: 'PDF dan latihan daring' },
    ],
  },
  {
    slug: 'panduan-pengembangan-karier',
    kategori: 'Rencana Karier',
    title: 'Panduan Pengembangan Karier',
    subtitle: 'Menyusun langkah setelah lulus',
    date: 'Diperbarui 2 Mei 2025',
    image: gedungSekolah,
    lead: 'Panduan menyusun rencana karier jangka menengah, baik bagi yang langsung bekerja, melanjutkan kuliah, maupun merintis usaha sendiri.',
    body: [
      'Langkah pertama adalah mengenali bidang yang benar-benar diminati. Cara paling jujur menilainya adalah melihat pekerjaan apa yang tetap dikerjakan meski sedang tidak ada tugas.',
      'Setelah bidangnya jelas, susun target satu tahun yang bisa diukur, misalnya menyelesaikan satu sertifikasi atau membangun tiga proyek yang layak masuk portofolio.',
      'Sertifikasi industri membantu, tetapi bukti kerja tetap yang paling menentukan. Simpan setiap hasil kerja dengan rapi sejak masih sekolah.',
    ],
    facts: [
      { label: 'Isi', value: 'Kerangka rencana satu dan tiga tahun' },
      { label: 'Pendampingan', value: 'Konsultasi dengan BKK' },
      { label: 'Cocok untuk', value: 'Semua tingkat' },
    ],
  },
];

/* ── Info PKL: /bkk/pkl/:slug ── */
export const pklDetailLengkap = [
  {
    slug: 'pkl-it-support-pt-telkom-indonesia',
    kategori: 'PKL',
    title: 'PKL IT Support',
    subtitle: 'PT Telkom Indonesia - Purwokerto, Jawa Tengah',
    date: 'Kuota 8 siswa',
    image: labKomputer,
    lead: 'Penempatan praktik kerja lapangan pada tim dukungan teknis, menangani kebutuhan perangkat dan jaringan pengguna di lingkungan kantor.',
    body: [
      'Peserta membantu penanganan keluhan perangkat, pemasangan aplikasi, dan pemeriksaan sambungan jaringan. Semua pekerjaan didampingi teknisi tetap.',
      'Bagian yang paling melatih adalah pencatatan tiket: setiap keluhan harus dicatat, ditelusuri, dan ditutup dengan keterangan penyelesaian. Kebiasaan ini yang kelak membedakan teknisi rapi dan teknisi asal selesai.',
      'Di akhir masa PKL, peserta menyusun laporan berisi jenis gangguan yang paling sering muncul beserta usulan pencegahannya.',
    ],
    facts: [
      { label: 'Perusahaan', value: 'PT Telkom Indonesia' },
      { label: 'Lokasi', value: 'Purwokerto, Jawa Tengah' },
      { label: 'Kuota', value: '8 siswa' },
      { label: 'Jurusan disarankan', value: 'TKJ dan TJAT' },
    ],
  },
  {
    slug: 'pkl-game-dev-pt-telkom-indonesia',
    kategori: 'PKL',
    title: 'PKL Game Dev',
    subtitle: 'PT Telkom Indonesia - Yogyakarta',
    date: 'Kuota 6 siswa',
    image: studioMultimedia,
    lead: 'Penempatan pada tim pengembangan permainan, terlibat dalam pembuatan aset, penyusunan level, dan pengujian permainan.',
    body: [
      'Peserta bergabung pada satu siklus produksi pendek: menerima rancangan, mengerjakan bagiannya, lalu ikut sesi tinjauan bersama tim.',
      'Pengujian permainan menjadi bagian penting. Peserta diminta mencatat titik yang membuat pemain bingung atau berhenti bermain, lalu mengusulkan perbaikannya.',
      'Hasil kerja selama PKL boleh dimasukkan ke portofolio pribadi sepanjang tidak memuat aset milik perusahaan.',
    ],
    facts: [
      { label: 'Perusahaan', value: 'PT Telkom Indonesia' },
      { label: 'Lokasi', value: 'Yogyakarta' },
      { label: 'Kuota', value: '6 siswa' },
      { label: 'Jurusan disarankan', value: 'PG dan DKV' },
    ],
  },
  {
    slug: 'pkl-software-engineer-pt-telkom-indonesia',
    kategori: 'PKL',
    title: 'PKL Software Engineer',
    subtitle: 'PT Telkom Indonesia - Jakarta',
    date: 'Kuota 6 siswa',
    image: showcaseRpl,
    lead: 'Penempatan pada tim pengembang perangkat lunak, mengerjakan bagian kecil dari produk yang benar-benar dipakai pengguna.',
    body: [
      'Peserta mulai dengan mempelajari alur kerja tim: bagaimana pekerjaan dibagi, bagaimana kode ditinjau sebelum digabung, dan bagaimana rilis disiapkan.',
      'Tugas biasanya berupa perbaikan kecil atau penambahan fitur ringan. Ukuran tugasnya sengaja dijaga agar peserta sempat melewati seluruh siklus, dari menulis sampai dirilis.',
      'Pendampingan dilakukan oleh seorang pengembang tetap yang menjadi tempat bertanya selama masa penempatan.',
    ],
    facts: [
      { label: 'Perusahaan', value: 'PT Telkom Indonesia' },
      { label: 'Lokasi', value: 'Jakarta' },
      { label: 'Kuota', value: '6 siswa' },
      { label: 'Jurusan disarankan', value: 'PPLG dan RPL' },
    ],
  },
];

/* ── Roadmap karier: /bkk/roadmap/:slug ── */
export const roadmapDetail = [
  {
    slug: 'rpl',
    kategori: 'Jalur Karier',
    title: 'Roadmap Karier Rekayasa Perangkat Lunak',
    subtitle: 'Dari belajar dasar sampai memimpin tim',
    date: 'Jalur 6 tahap',
    image: showcaseRpl,
    lead: 'Rangkaian tahap yang umum dilalui lulusan Rekayasa Perangkat Lunak, dari menguasai dasar sampai menempati peran senior di industri.',
    body: [
      'Tiga tahap pertama diselesaikan selama masa sekolah: menguasai dasar, membangun portofolio, lalu menjalani praktik kerja lapangan. Bekal terpenting dari tahap ini bukan banyaknya bahasa pemrograman yang dikuasai, melainkan kebiasaan menulis kode yang bisa dibaca orang lain.',
      'Tahap Junior biasanya berjalan satu sampai dua tahun pertama setelah lulus. Fokusnya menyelesaikan tugas dengan tuntas dan belajar dari tinjauan kode rekan yang lebih berpengalaman.',
      'Tahap Profesional dan Expert ditandai dengan berpindahnya tanggung jawab, dari menyelesaikan tugas menjadi menentukan cara tim bekerja dan merancang sistem yang dipakai banyak orang.',
    ],
    facts: [
      { label: 'Jurusan', value: 'Rekayasa Perangkat Lunak' },
      { label: 'Jumlah tahap', value: '6 tahap' },
      { label: 'Contoh peran', value: 'Software Engineer, Web Developer' },
    ],
  },
  {
    slug: 'pg',
    kategori: 'Jalur Karier',
    title: 'Roadmap Karier Pengembangan Game',
    subtitle: 'Dari game pertama sampai memimpin produksi',
    date: 'Jalur 6 tahap',
    image: showcasePg,
    lead: 'Rangkaian tahap bagi lulusan Pengembangan Game, mulai dari merilis permainan pertama sampai memimpin produksi sebuah judul.',
    body: [
      'Tahap awal difokuskan pada penguasaan dasar desain permainan dan pemrograman. Merilis satu permainan kecil yang benar-benar selesai lebih berharga daripada menyimpan sepuluh proyek setengah jadi.',
      'Praktik kerja lapangan di studio memberi gambaran bagaimana permainan dikerjakan sebagai produk, lengkap dengan tenggat, pembagian peran, dan pengujian ke pemain sungguhan.',
      'Tahap lanjut membuka pilihan bercabang: mendalami sisi teknis, sisi seni, atau sisi rancangan permainan. Ketiganya bisa mengantar ke peran Game Director atau merintis studio sendiri.',
    ],
    facts: [
      { label: 'Jurusan', value: 'Pengembangan Game' },
      { label: 'Jumlah tahap', value: '6 tahap' },
      { label: 'Contoh peran', value: 'Game Developer, Level Designer' },
    ],
  },
  {
    slug: 'tkj',
    kategori: 'Jalur Karier',
    title: 'Roadmap Karier Teknik Komputer dan Jaringan',
    subtitle: 'Dari lab sendiri sampai arsitek jaringan',
    date: 'Jalur 6 tahap',
    image: showcaseTkj,
    lead: 'Rangkaian tahap bagi lulusan Teknik Komputer dan Jaringan, dari membangun laboratorium sendiri sampai merancang infrastruktur berskala besar.',
    body: [
      'Tahap awal menuntut penguasaan dasar jaringan dan server. Membangun laboratorium kecil di rumah, meski hanya dengan perangkat bekas, mempercepat pemahaman jauh melebihi membaca teori.',
      'Sertifikasi mulai berperan pada tahap Junior. Banyak perusahaan memakainya sebagai penyaring awal, sehingga mengambilnya sejak masa sekolah memberi keuntungan.',
      'Tahap Profesional berhubungan dengan pengelolaan infrastruktur yang tidak boleh berhenti. Di titik ini kemampuan menelusuri gangguan secara sistematis lebih menentukan daripada hafalan perintah.',
    ],
    facts: [
      { label: 'Jurusan', value: 'Teknik Komputer dan Jaringan' },
      { label: 'Jumlah tahap', value: '6 tahap' },
      { label: 'Contoh peran', value: 'Network Engineer, System Administrator' },
    ],
  },
  {
    slug: 'tjat',
    kategori: 'Jalur Karier',
    title: 'Roadmap Karier Teknik Jaringan Akses Telekomunikasi',
    subtitle: 'Dari fiber optic sampai perancangan jaringan akses',
    date: 'Jalur 6 tahap',
    image: showcaseTjat,
    lead: 'Rangkaian tahap bagi lulusan Teknik Jaringan Akses Telekomunikasi, dari penguasaan fiber optic sampai merancang jaringan yang menghubungkan pelanggan.',
    body: [
      'Tahap awal berfokus pada dasar telekomunikasi dan keterampilan tangan: penyambungan fiber dan pengukuran redaman jalur. Ketelitian di tahap ini sangat menentukan kualitas layanan yang diterima pelanggan.',
      'Praktik kerja lapangan biasanya dijalani di operator telekomunikasi, ikut tim lapangan menangani pemasangan dan perbaikan jalur.',
      'Tahap lanjut bergeser dari pekerjaan lapangan ke perancangan: memperkirakan kebutuhan material, memetakan jalur, dan menyusun rencana pengembangan jaringan.',
    ],
    facts: [
      { label: 'Jurusan', value: 'Teknik Jaringan Akses Telekomunikasi' },
      { label: 'Jumlah tahap', value: '6 tahap' },
      { label: 'Contoh peran', value: 'Fiber Optic Technician, Access Network Engineer' },
    ],
  },
];

/* ── Project showcase: /jurusan/project/:slug ── */
export const projectDetail = [
  {
    slug: 'sistem-informasi-perpustakaan',
    kategori: 'RPL',
    title: 'Sistem Informasi Perpustakaan',
    subtitle: 'Karya siswa Rekayasa Perangkat Lunak',
    date: 'Proyek kelas XI',
    image: showcaseRpl,
    lead: 'Aplikasi web untuk mencatat peminjaman dan pengembalian buku perpustakaan sekolah, menggantikan pencatatan manual di buku besar.',
    body: [
      'Masalah yang diselesaikan sederhana tetapi nyata: petugas kesulitan mengetahui buku mana yang sedang dipinjam dan siapa yang terlambat mengembalikan.',
      'Sistem ini mencatat setiap transaksi, menghitung tenggat otomatis, dan menampilkan daftar keterlambatan pada halaman utama petugas. Pencarian buku memakai penelusuran judul dan pengarang sekaligus.',
      'Aplikasinya kini dipakai di perpustakaan sekolah dan dirawat bergantian oleh siswa kelas XI sebagai bagian dari pembelajaran.',
    ],
    facts: [
      { label: 'Jurusan', value: 'Rekayasa Perangkat Lunak' },
      { label: 'Bentuk', value: 'Aplikasi web' },
      { label: 'Status', value: 'Dipakai di perpustakaan sekolah' },
    ],
  },
  {
    slug: 'game-2d-adventure',
    kategori: 'PG',
    title: 'Game 2D Adventure',
    subtitle: 'Karya siswa Pengembangan Game',
    date: 'Proyek kelas XI',
    image: showcasePg,
    lead: 'Permainan petualangan dua dimensi dengan cerita, level bertingkat, dan aset visual yang seluruhnya digambar sendiri oleh tim siswa.',
    body: [
      'Permainan dibangun dalam satu semester dengan pembagian peran menyerupai studio kecil: ada yang menangani pemrograman mekanik, ada yang menggambar aset, ada yang menyusun level.',
      'Tantangan terbesar bukan pada pemrogramannya, melainkan menjaga tingkat kesulitan tetap wajar. Beberapa level harus dirombak setelah pengujian menunjukkan pemain berhenti di tempat yang sama.',
      'Versi akhirnya diuji ke siswa kelas lain sebelum dipamerkan pada Project Showcase sekolah.',
    ],
    facts: [
      { label: 'Jurusan', value: 'Pengembangan Game' },
      { label: 'Bentuk', value: 'Permainan 2D' },
      { label: 'Aset', value: 'Digambar sendiri oleh tim' },
    ],
  },
  {
    slug: 'server-monitoring-system',
    kategori: 'TKJ',
    title: 'Server Monitoring System',
    subtitle: 'Karya siswa Teknik Komputer dan Jaringan',
    date: 'Proyek kelas XII',
    image: showcaseTkj,
    lead: 'Sistem pemantau kondisi server sekolah yang menampilkan penggunaan sumber daya dan mengirim peringatan saat ada yang melewati batas aman.',
    body: [
      'Sistem membaca beban prosesor, pemakaian memori, dan sisa ruang penyimpanan dari beberapa server sekaligus, lalu menampilkannya pada satu halaman ringkas.',
      'Peringatan dikirim lewat pesan singkat ketika sebuah nilai melewati ambang yang ditetapkan, sehingga gangguan dapat ditangani sebelum layanan benar-benar terhenti.',
      'Proyek ini muncul dari kebutuhan nyata: sebelumnya kondisi server hanya diketahui ketika ada yang mengeluh layanan tidak bisa diakses.',
    ],
    facts: [
      { label: 'Jurusan', value: 'Teknik Komputer dan Jaringan' },
      { label: 'Bentuk', value: 'Aplikasi pemantauan' },
      { label: 'Status', value: 'Dipasang di jaringan sekolah' },
    ],
  },
  {
    slug: 'jaringan-fiber-optic-simulation',
    kategori: 'TJAT',
    title: 'Jaringan Fiber Optic Simulation',
    subtitle: 'Karya siswa Teknik Jaringan Akses Telekomunikasi',
    date: 'Proyek kelas XII',
    image: showcaseTjat,
    lead: 'Simulasi jaringan akses fiber optic dari sisi penyedia layanan sampai ke rumah pelanggan, lengkap dengan perhitungan redaman jalurnya.',
    body: [
      'Simulasi menampilkan jalur lengkap beserta perangkat di setiap titik, sehingga siswa dapat melihat bagaimana satu sambungan yang buruk memengaruhi kualitas sampai ke ujung.',
      'Perhitungan redaman dilakukan mengikuti rumus yang dipakai di lapangan, lalu dibandingkan dengan hasil pengukuran nyata di laboratorium.',
      'Model ini kini dipakai sebagai alat bantu mengajar untuk adik kelas sebelum mereka menyentuh perangkat sungguhan.',
    ],
    facts: [
      { label: 'Jurusan', value: 'Teknik Jaringan Akses Telekomunikasi' },
      { label: 'Bentuk', value: 'Simulasi jaringan' },
      { label: 'Status', value: 'Dipakai sebagai alat bantu ajar' },
    ],
  },
];

/* ── Profil guru: /profil-sekolah/guru/:slug ── */
export const guruDetail = [
  {
    slug: 'bayu-setiawan-s-kom',
    kategori: 'Guru Produktif RPL',
    title: 'Bayu Setiawan, S.Kom.',
    subtitle: 'Pemrograman web dan basis data',
    date: 'Guru Produktif',
    image: guru1,
    lead: 'Mengampu mata pelajaran pemrograman web dan basis data untuk jurusan Rekayasa Perangkat Lunak.',
    body: [
      'Pendekatan mengajarnya bertumpu pada praktik: teori disampaikan seperlunya, lalu siswa langsung mengerjakan kasus nyata di depan komputer.',
      'Selain mengajar, beliau mendampingi tim lomba bidang teknologi web dan membimbing siswa menyiapkan portofolio sebelum praktik kerja lapangan.',
    ],
    facts: [
      { label: 'Jabatan', value: 'Guru Produktif RPL' },
      { label: 'Bidang ajar', value: 'Pemrograman web dan basis data' },
    ],
  },
  {
    slug: 'anindya-larasati-s-pd',
    kategori: 'Guru Produktif PG',
    title: 'Anindya Larasati, S.Pd.',
    subtitle: 'Desain game dan aset visual',
    date: 'Guru Produktif',
    image: guru2,
    lead: 'Mengampu desain permainan dan pembuatan aset visual untuk jurusan Pengembangan Game.',
    body: [
      'Kelasnya menekankan bahwa permainan yang baik lahir dari aturan main yang jelas, bukan dari tampilan yang paling megah.',
      'Beliau juga mendampingi produksi permainan yang ditampilkan pada Project Showcase sekolah setiap akhir tahun ajaran.',
    ],
    facts: [
      { label: 'Jabatan', value: 'Guru Produktif PG' },
      { label: 'Bidang ajar', value: 'Desain game dan aset visual' },
    ],
  },
  {
    slug: 'nurul-hidayah-s-t',
    kategori: 'Guru Produktif TKJ',
    title: 'Nurul Hidayah, S.T.',
    subtitle: 'Administrasi jaringan dan server',
    date: 'Guru Produktif',
    image: guru3,
    lead: 'Mengampu administrasi jaringan dan server untuk jurusan Teknik Komputer dan Jaringan.',
    body: [
      'Praktik di kelasnya dilakukan pada perangkat sungguhan, bukan hanya simulator, agar siswa terbiasa menangani perangkat yang dipakai industri.',
      'Beliau membimbing siswa menyiapkan sertifikasi jaringan yang dapat diambil sejak masa sekolah.',
    ],
    facts: [
      { label: 'Jabatan', value: 'Guru Produktif TKJ' },
      { label: 'Bidang ajar', value: 'Administrasi jaringan dan server' },
    ],
  },
  {
    slug: 'fajar-nugroho-s-t',
    kategori: 'Guru Produktif TJAT',
    title: 'Fajar Nugroho, S.T.',
    subtitle: 'Fiber optic dan jaringan akses',
    date: 'Guru Produktif',
    image: guru4,
    lead: 'Mengampu praktik fiber optic dan jaringan akses untuk jurusan Teknik Jaringan Akses Telekomunikasi.',
    body: [
      'Fokus pengajarannya pada ketelitian kerja lapangan: penyambungan fiber, pengukuran redaman, dan penelusuran gangguan jalur.',
      'Beliau mendampingi siswa saat praktik kerja lapangan di penyedia layanan telekomunikasi.',
    ],
    facts: [
      { label: 'Jabatan', value: 'Guru Produktif TJAT' },
      { label: 'Bidang ajar', value: 'Fiber optic dan jaringan akses' },
    ],
  },
];

/* ── Halaman FAQ lengkap: /jurusan/faq ── */
// Tiga butir pertama sengaja diambil ulang dari jurusanFaq supaya isi ringkasan
// di halaman Jurusan dan halaman lengkap ini tidak pernah berbeda.
export const faqLengkap = {
  eyebrow: 'Pertanyaan yang Sering Diajukan',
  title: 'FAQ Tentang Jurusan',
  deskripsi:
    'Kumpulan pertanyaan yang paling sering ditanyakan calon siswa dan orang tua seputar program keahlian di SMK Telkom Purwokerto.',
  kelompok: [
    {
      nama: 'Umum',
      items: [
        {
          q: 'Apakah semua jurusan belajar coding?',
          a: 'Semua jurusan mendapat dasar pemrograman, tetapi porsinya berbeda. RPL dan PG paling banyak coding, sedangkan TKJ dan TJAT lebih banyak konfigurasi jaringan dan perangkat.',
        },
        {
          q: 'Apakah bisa pindah jurusan setelah diterima?',
          a: 'Perpindahan jurusan hanya dimungkinkan pada awal semester pertama, dengan mempertimbangkan sisa daya tampung jurusan tujuan dan hasil konsultasi dengan wali kelas.',
        },
        {
          q: 'Apakah harus punya laptop sendiri?',
          a: 'Tidak wajib. Seluruh praktik dapat dikerjakan memakai komputer laboratorium sekolah. Namun laptop pribadi memudahkan pengerjaan tugas di luar jam sekolah.',
        },
      ],
    },
    {
      nama: 'Pembelajaran',
      items: [
        {
          q: 'Berapa banyak porsi praktik dibanding teori?',
          a: 'Mata pelajaran produktif berjalan dengan porsi praktik lebih besar daripada teori. Teori disampaikan seperlunya, lalu langsung dilanjutkan pengerjaan di laboratorium.',
        },
        {
          q: 'Apakah ada sertifikasi selama sekolah?',
          a: 'Ada. Siswa dapat mengambil sertifikasi industri sesuai bidang keahlian, dan sekolah menyediakan pendampingan persiapannya.',
        },
        {
          q: 'Bagaimana penilaian proyek dilakukan?',
          a: 'Penilaian tidak hanya melihat hasil akhir, tetapi juga catatan perkembangan pekerjaan selama proses, termasuk kerja sama di dalam tim.',
        },
      ],
    },
    {
      nama: 'Magang dan Karier',
      items: [
        {
          q: 'Apakah ada kesempatan magang?',
          a: 'Ada. Seluruh siswa menjalani Praktik Kerja Lapangan di mitra industri kami, dan penempatannya disesuaikan dengan jurusan masing-masing.',
        },
        {
          q: 'Apakah bisa lanjut ke jenjang lebih tinggi?',
          a: 'Bisa. Lulusan kami banyak yang melanjutkan ke perguruan tinggi, termasuk Telkom University, di samping yang langsung bekerja atau berwirausaha.',
        },
        {
          q: 'Apakah sekolah membantu penyaluran kerja?',
          a: 'Bursa Kerja Khusus sekolah menghubungkan lulusan dengan perusahaan mitra, menyelenggarakan campus hiring, dan menyediakan pendampingan penyusunan berkas lamaran.',
        },
      ],
    },
  ],
};

/* ── Halaman perbandingan jurusan: /jurusan/perbandingan ── */
// Baris tabelnya diambil dari jurusanCompare agar tidak ada dua sumber angka
// yang bisa berbeda. Yang ditambahkan di sini hanya keterangan pelengkap.
export const perbandinganLengkap = {
  eyebrow: 'Bantuan Memilih',
  title: 'Perbandingan Jurusan',
  deskripsi:
    'Bandingkan keempat program keahlian berdasarkan fokus belajar, tingkat kesulitan, dan arah kariernya sebelum menentukan pilihan.',
  cocokUntuk: [
    {
      kode: 'RPL',
      judul: 'Rekayasa Perangkat Lunak',
      teks: 'Cocok bila kamu senang memecahkan masalah lewat logika dan betah menghabiskan waktu membangun sesuatu dari nol.',
      slug: 'rpl',
    },
    {
      kode: 'PG',
      judul: 'Pengembangan Game',
      teks: 'Cocok bila kamu tertarik pada sisi kreatif sekaligus teknis, dan senang menguji apakah sesuatu terasa menyenangkan dimainkan.',
      slug: 'pg',
    },
    {
      kode: 'TKJ',
      judul: 'Teknik Komputer dan Jaringan',
      teks: 'Cocok bila kamu suka membongkar perangkat, menelusuri penyebab gangguan, dan memastikan sistem tetap berjalan.',
      slug: 'tkj',
    },
    {
      kode: 'TJAT',
      judul: 'Teknik Jaringan Akses Telekomunikasi',
      teks: 'Cocok bila kamu betah bekerja teliti dengan alat ukur dan tertarik pada infrastruktur yang menghubungkan banyak orang.',
      slug: 'tjat',
    },
  ],
  catatan:
    'Tingkat kesulitan bukan ukuran mana yang lebih baik. Jurusan yang paling tepat adalah yang paling dekat dengan hal yang membuatmu betah belajar.',
};

/* ── Ketentuan PPDB: /ketentuan-ppdb ── */
export const ketentuanPpdb = {
  eyebrow: 'Dokumen Resmi',
  title: 'Ketentuan PPDB SMK Telkom Purwokerto',
  deskripsi: 'Ketentuan yang berlaku bagi seluruh calon peserta didik pada Penerimaan Peserta Didik Baru tahun ajaran 2027/2028.',
  diperbarui: 'Diperbarui 20 Mei 2026',
  bagian: [
    {
      judul: 'Persyaratan Umum',
      butir: [
        'Lulus atau akan lulus SMP/MTs atau sederajat pada tahun berjalan.',
        'Berusia paling tinggi 21 tahun pada saat mendaftar.',
        'Memiliki Nomor Induk Siswa Nasional (NISN) yang terdaftar.',
        'Bersedia mengikuti seluruh tahapan seleksi yang ditetapkan panitia.',
      ],
    },
    {
      judul: 'Berkas Pendaftaran',
      butir: [
        'Pas foto terbaru ukuran 3x4 atau 4x6 dengan latar merah atau biru.',
        'Pindaian rapor semester 1 sampai 5 yang digabung dalam satu berkas PDF.',
        'Akta kelahiran atau surat kenal lahir.',
        'Kartu Keluarga terbaru.',
      ],
    },
    {
      judul: 'Ketentuan Data',
      butir: [
        'Seluruh data yang diisikan harus benar dan dapat dipertanggungjawabkan.',
        'Data yang terbukti tidak benar dapat menggugurkan pendaftaran, termasuk setelah dinyatakan diterima.',
        'Perubahan data setelah pendaftaran dikirim hanya dapat dilakukan lewat panitia PPDB.',
        'Satu calon peserta didik hanya diperbolehkan memiliki satu akun pendaftaran.',
      ],
    },
    {
      judul: 'Perlindungan Data Pribadi',
      butir: [
        'Data yang dikumpulkan hanya digunakan untuk keperluan seleksi dan administrasi penerimaan.',
        'Berkas pendaftaran tidak dibagikan ke pihak lain di luar kepentingan penyelenggaraan PPDB.',
        'Pendaftar berhak meminta penghapusan data apabila membatalkan pendaftaran.',
      ],
    },
    {
      judul: 'Pengumuman Hasil',
      butir: [
        'Hasil seleksi diumumkan melalui portal PPDB dan pemberitahuan WhatsApp.',
        'Keputusan panitia bersifat final dan tidak dapat diganggu gugat.',
        'Peserta yang dinyatakan diterima wajib melakukan daftar ulang sesuai jadwal.',
      ],
    },
  ],
  kontakTeks: 'Ada bagian yang belum jelas?',
  kontakCta: 'Hubungi Panitia PPDB',
};

/* ── Lupa sandi: /lupa-sandi ── */
export const lupaSandi = {
  badge: 'Pemulihan Akun',
  judul: 'Lupa Kata Sandi?',
  deskripsi:
    'Masukkan alamat email yang kamu pakai saat mendaftar. Kami akan mengirimkan tautan untuk membuat kata sandi baru.',
  ctaLabel: 'Kirim Tautan Pemulihan',
  pesanTerkirim:
    'Kalau alamat itu terdaftar, tautan pemulihan sudah dikirim. Periksa juga folder Spam bila belum masuk dalam beberapa menit.',
  catatanJudul: 'Masih belum bisa masuk?',
  catatan: [
    'Pastikan alamat email yang dimasukkan sama dengan yang dipakai saat pendaftaran.',
    'Tautan pemulihan hanya berlaku 60 menit sejak dikirim.',
    'Bila email pendaftaran sudah tidak aktif, hubungi panitia PPDB untuk penggantian.',
  ],
};

/* ── Dokumen peserta: /ppdb/dokumen-peserta ── */
export const dokumenPeserta = {
  eyebrow: 'Berkas Peserta',
  title: 'Dokumen Peserta PPDB',
  deskripsi:
    'Kartu peserta dan jadwal seleksi untuk dibawa saat mengikuti tahapan tes. Simpan atau cetak sebelum hari pelaksanaan.',
  kartuJudul: 'Kartu Peserta PPDB',
  kartuCatatan: 'Tunjukkan kartu ini saat registrasi ulang dan pelaksanaan tes.',
  berkas: [
    { icon: 'cetak', judul: 'Kartu Peserta PPDB', deskripsi: 'Bukti pendaftaran resmi, format PDF' },
    { icon: 'jadwal', judul: 'Jadwal Seleksi', deskripsi: 'Tanggal tes tertulis dan wawancara' },
    { icon: 'panduan', judul: 'Panduan Tes Seleksi', deskripsi: 'Materi yang diujikan dan tata tertib' },
  ],
  tahapan: [
    { tanggal: '02 Juli 2026', nama: 'Verifikasi Berkas', ket: 'Panitia memeriksa kelengkapan dokumen' },
    { tanggal: '08 Juli 2026', nama: 'Tes Tertulis', ket: 'Kemampuan dasar dan logika' },
    { tanggal: '12 Juli 2026', nama: 'Wawancara', ket: 'Minat dan kesiapan belajar' },
    { tanggal: '18 Juli 2026', nama: 'Pengumuman Hasil', ket: 'Diumumkan lewat portal dan WhatsApp' },
  ],
};
