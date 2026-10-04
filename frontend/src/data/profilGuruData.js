// Khusus Profil Guru dan detailnya; jangan diimpor oleh dummyData/Profil Sekolah.
// Nama dan jabatan: nama berkas ZIP pengguna. Ejaan hanya dirapikan pada spasi/gelar.
// Mapel null menunggu konfirmasi; Nina: label Guru Sejarah pada foto.
// Tiga paragraf merupakan penjelasan editorial umum bidang, bukan biografi pribadi.
import { guruData, guruDetail } from './guruData';
import { slugify } from '../utils/slug';
import photo0 from '../assets/tentang/guru/baru/thoriq-abdul-azis-m.webp?no-inline';
import thumb0 from '../assets/tentang/guru/baru/thoriq-abdul-azis-m-240.webp?no-inline';
import photo1 from '../assets/tentang/guru/baru/susi-listyarini.webp?no-inline';
import thumb1 from '../assets/tentang/guru/baru/susi-listyarini-240.webp?no-inline';
import photo2 from '../assets/tentang/guru/baru/afhail-lucqi-sianggang.webp?no-inline';
import thumb2 from '../assets/tentang/guru/baru/afhail-lucqi-sianggang-240.webp?no-inline';
import photo3 from '../assets/tentang/guru/baru/anisa-rizqi-utami.webp?no-inline';
import thumb3 from '../assets/tentang/guru/baru/anisa-rizqi-utami-240.webp?no-inline';
import photo4 from '../assets/tentang/guru/baru/agus-widodo.webp?no-inline';
import thumb4 from '../assets/tentang/guru/baru/agus-widodo-240.webp?no-inline';
import photo5 from '../assets/tentang/guru/baru/nugrahani-puspitasari.webp?no-inline';
import thumb5 from '../assets/tentang/guru/baru/nugrahani-puspitasari-240.webp?no-inline';
import photo6 from '../assets/tentang/guru/baru/arif-muttakin.webp?no-inline';
import thumb6 from '../assets/tentang/guru/baru/arif-muttakin-240.webp?no-inline';
import photo7 from '../assets/tentang/guru/baru/agung-restu-saputra.webp?no-inline';
import thumb7 from '../assets/tentang/guru/baru/agung-restu-saputra-240.webp?no-inline';
import photo8 from '../assets/tentang/guru/baru/princes-iqlima-kafilla.webp?no-inline';
import thumb8 from '../assets/tentang/guru/baru/princes-iqlima-kafilla-240.webp?no-inline';
import photo9 from '../assets/tentang/guru/baru/lulu-zakiyah.webp?no-inline';
import thumb9 from '../assets/tentang/guru/baru/lulu-zakiyah-240.webp?no-inline';
import photo10 from '../assets/tentang/guru/baru/agustiana-dwi-nurcahyani.webp?no-inline';
import thumb10 from '../assets/tentang/guru/baru/agustiana-dwi-nurcahyani-240.webp?no-inline';
import photo11 from '../assets/tentang/guru/baru/imam-sugiharto.webp?no-inline';
import thumb11 from '../assets/tentang/guru/baru/imam-sugiharto-240.webp?no-inline';
import photo12 from '../assets/tentang/guru/baru/saefullah-s.webp?no-inline';
import thumb12 from '../assets/tentang/guru/baru/saefullah-s-240.webp?no-inline';
import photo13 from '../assets/tentang/guru/baru/winda-yusmawardani-putri.webp?no-inline';
import thumb13 from '../assets/tentang/guru/baru/winda-yusmawardani-putri-240.webp?no-inline';
import photo14 from '../assets/tentang/guru/baru/wahyuni-tri-widayati.webp?no-inline';
import thumb14 from '../assets/tentang/guru/baru/wahyuni-tri-widayati-240.webp?no-inline';
import photo15 from '../assets/tentang/guru/baru/teguh-arif-hidayatuloh.webp?no-inline';
import thumb15 from '../assets/tentang/guru/baru/teguh-arif-hidayatuloh-240.webp?no-inline';
import photo16 from '../assets/tentang/guru/baru/nia-yuliana.webp?no-inline';
import thumb16 from '../assets/tentang/guru/baru/nia-yuliana-240.webp?no-inline';
import photo17 from '../assets/tentang/guru/baru/prasetyo-adi-wibowo.webp?no-inline';
import thumb17 from '../assets/tentang/guru/baru/prasetyo-adi-wibowo-240.webp?no-inline';
import photo18 from '../assets/tentang/guru/baru/tisna-eka-darwati.webp?no-inline';
import thumb18 from '../assets/tentang/guru/baru/tisna-eka-darwati-240.webp?no-inline';
import photo19 from '../assets/tentang/guru/baru/bintang-nugraha-ks.webp?no-inline';
import thumb19 from '../assets/tentang/guru/baru/bintang-nugraha-ks-240.webp?no-inline';
import photo20 from '../assets/tentang/guru/baru/berlian-windasari.webp?no-inline';
import thumb20 from '../assets/tentang/guru/baru/berlian-windasari-240.webp?no-inline';
import photo21 from '../assets/tentang/guru/baru/nina-wijiati.webp?no-inline';
import thumb21 from '../assets/tentang/guru/baru/nina-wijiati-240.webp?no-inline';
import photo22 from '../assets/tentang/guru/baru/siti-mufsohah-muhimmati.webp?no-inline';
import thumb22 from '../assets/tentang/guru/baru/siti-mufsohah-muhimmati-240.webp?no-inline';
import photo23 from '../assets/tentang/guru/baru/sri-mulani-widayati.webp?no-inline';
import thumb23 from '../assets/tentang/guru/baru/sri-mulani-widayati-240.webp?no-inline';
import photo24 from '../assets/tentang/guru/baru/yuli-opia-sari.webp?no-inline';
import thumb24 from '../assets/tentang/guru/baru/yuli-opia-sari-240.webp?no-inline';
import photo25 from '../assets/tentang/guru/baru/tofik-nurhadi.webp?no-inline';
import thumb25 from '../assets/tentang/guru/baru/tofik-nurhadi-240.webp?no-inline';
import photo26 from '../assets/tentang/guru/baru/krisma-dwi-brata.webp?no-inline';
import thumb26 from '../assets/tentang/guru/baru/krisma-dwi-brata-240.webp?no-inline';

const descriptions = {
  "sinergi": [
    [
      "Bidang sinergi menghubungkan kegiatan sekolah dengan kebutuhan mitra, unit produksi, dan alumni.",
      "Synergy connects school activities with the needs of partners, the production unit and alumni."
    ],
    [
      "Lingkup bidang ini meliputi komunikasi, pengelolaan informasi kemitraan, dan koordinasi kegiatan bersama.",
      "This field covers communication, partnership information and coordination of shared activities."
    ],
    [
      "Kerja sama yang terarah membantu memperluas kesempatan belajar dan hubungan antara sekolah dengan dunia kerja.",
      "Coordinated collaboration helps expand learning opportunities and connections between school and the workplace."
    ]
  ],
  "mutu": [
    [
      "Bidang penjaminan mutu berkaitan dengan pengelolaan standar dan perbaikan layanan pendidikan.",
      "Quality assurance concerns standards and the improvement of educational services."
    ],
    [
      "Kegiatan terkait mencakup dokumentasi, pemantauan proses, dan evaluasi berdasarkan informasi yang tersedia.",
      "Related activities include documentation, process monitoring and evaluation based on available information."
    ],
    [
      "Ketelitian dan koordinasi mendukung konsistensi layanan serta perbaikan proses kerja sekolah.",
      "Attention to detail and coordination support consistent services and improved school processes."
    ]
  ],
  "komunikasi": [
    [
      "Bidang penerimaan siswa dan komunikasi berkaitan dengan penyampaian informasi sekolah kepada calon siswa serta masyarakat.",
      "Admissions and communications concern sharing school information with prospective students and the community."
    ],
    [
      "Lingkup bidang ini meliputi informasi pendaftaran, koordinasi layanan, dan komunikasi kegiatan sekolah.",
      "This field covers registration information, service coordination and communication about school activities."
    ],
    [
      "Informasi yang jelas dan tertata membantu calon siswa serta orang tua memahami proses dan layanan sekolah.",
      "Clear, organised information helps prospective students and parents understand school processes and services."
    ]
  ],
  "bk": [
    [
      "Bimbingan Konseling mendukung perkembangan pribadi, sosial, belajar, dan perencanaan karier siswa.",
      "Counselling supports students’ personal, social and learning development, as well as career planning."
    ],
    [
      "Bidang ini berkaitan dengan pendampingan, komunikasi, dan pengenalan kebutuhan siswa di lingkungan sekolah.",
      "This field concerns guidance, communication and understanding students’ needs at school."
    ],
    [
      "Pendampingan membantu siswa mengenali potensi, mengambil keputusan, dan membangun kebiasaan belajar yang baik.",
      "Guidance helps students recognise their potential, make decisions and develop positive learning habits."
    ]
  ],
  "sarana": [
    [
      "Sarana dan prasarana mendukung kesiapan ruang, perlengkapan, serta fasilitas yang digunakan dalam kegiatan sekolah.",
      "Facilities and infrastructure support the readiness of rooms, equipment and resources used in school activities."
    ],
    [
      "Lingkup bidang ini berkaitan dengan pendataan, pemeliharaan, dan koordinasi penggunaan fasilitas.",
      "This field concerns inventories, maintenance and coordination of facility use."
    ],
    [
      "Pengelolaan yang tertib mendukung lingkungan belajar yang aman, nyaman, dan berfungsi dengan baik.",
      "Orderly management supports a safe, comfortable and functional learning environment."
    ]
  ],
  "perpustakaan": [
    [
      "Perencanaan pembelajaran dan layanan perpustakaan mendukung tersedianya kegiatan serta sumber belajar yang terarah.",
      "Learning planning and library services support organised activities and access to learning resources."
    ],
    [
      "Lingkup bidang ini berkaitan dengan pengelolaan informasi, sumber bacaan, jadwal, dan kebutuhan kegiatan belajar.",
      "This field concerns information, reading resources, schedules and learning needs."
    ],
    [
      "Keteraturan layanan serta pemanfaatan sumber belajar membantu siswa dan guru menjalankan kegiatan pembelajaran.",
      "Organised services and learning resources help students and teachers carry out learning activities."
    ]
  ],
  "kesiswaan": [
    [
      "Bidang kesiswaan mendukung perkembangan siswa melalui pembinaan kegiatan, organisasi, dan karakter.",
      "Student affairs supports students’ development through activities, organisations and character guidance."
    ],
    [
      "Lingkup bidang ini berkaitan dengan koordinasi kegiatan siswa, pendampingan, dan pengembangan tanggung jawab.",
      "This field concerns coordinating student activities, guidance and developing responsibility."
    ],
    [
      "Kegiatan yang terarah memberi ruang bagi siswa untuk belajar bekerja sama, berorganisasi, dan berpartisipasi.",
      "Organised activities give students opportunities to learn teamwork, organisation and participation."
    ]
  ],
  "teknisi": [
    [
      "Layanan laboratorium dan teknologi mendukung kesiapan alat, perangkat, serta lingkungan praktik.",
      "Laboratory and technology services support the readiness of equipment, devices and practical learning environments."
    ],
    [
      "Lingkup bidang ini berkaitan dengan pemeliharaan, pemeriksaan perangkat, dan dukungan penggunaan fasilitas praktik.",
      "This field concerns maintenance, equipment checks and support for practical facilities."
    ],
    [
      "Kesiapan fasilitas membantu kegiatan pembelajaran praktik berjalan dengan aman dan tertib.",
      "Ready facilities help practical learning activities run safely and smoothly."
    ]
  ],
  "program": [
    [
      "Program keahlian Pengembangan Perangkat Lunak dan Gim (PPLG) berkaitan dengan pembelajaran teknologi perangkat lunak serta gim.",
      "The Software and Game Development program concerns learning software and game technologies."
    ],
    [
      "Koordinasi program mendukung keselarasan kegiatan, sumber belajar, dan kebutuhan kompetensi keahlian.",
      "Program coordination supports alignment between activities, learning resources and vocational competency needs."
    ],
    [
      "Perencanaan yang terarah membantu pelaksanaan pembelajaran dan kerja sama dalam lingkup program keahlian.",
      "Organised planning supports teaching and collaboration within the vocational program."
    ]
  ],
  "rohis": [
    [
      "Pembinaan Rohis berkaitan dengan kegiatan kerohanian Islam dan pengembangan karakter siswa.",
      "Islamic spiritual guidance concerns religious activities and students’ character development."
    ],
    [
      "Lingkup kegiatan ini mencakup pendampingan organisasi, kegiatan keagamaan, dan penerapan nilai kepedulian.",
      "This field covers organisational guidance, religious activities and practising care for others."
    ],
    [
      "Pembinaan mendukung tanggung jawab, kerja sama, dan sikap saling menghormati dalam kehidupan sekolah.",
      "Guidance supports responsibility, teamwork and mutual respect in school life."
    ]
  ],
  "kbm": [
    [
      "Pelaksanaan dan evaluasi Kegiatan Belajar Mengajar (KBM) mendukung keteraturan proses pembelajaran.",
      "Teaching and learning implementation and evaluation support organised learning processes."
    ],
    [
      "Bidang ini berkaitan dengan koordinasi pelaksanaan, dokumentasi kegiatan, dan pengelolaan informasi evaluasi.",
      "This field concerns implementation coordination, activity documentation and evaluation information."
    ],
    [
      "Pemantauan serta evaluasi membantu mengenali kebutuhan perbaikan dalam kegiatan belajar mengajar.",
      "Monitoring and evaluation help identify areas for improvement in teaching and learning."
    ]
  ],
  "keuangan": [
    [
      "Administrasi keuangan berkaitan dengan pencatatan dan pengelolaan informasi keuangan sekolah.",
      "Financial administration concerns recording and managing school financial information."
    ],
    [
      "Lingkup bidang ini mencakup dokumentasi transaksi, penataan data, dan koordinasi layanan administrasi.",
      "This field covers transaction documentation, data organisation and administrative service coordination."
    ],
    [
      "Ketelitian serta keteraturan pencatatan mendukung layanan yang dapat diperiksa dan dipertanggungjawabkan.",
      "Accurate, organised records support services that can be checked and accounted for."
    ]
  ],
  "ekskul": [
    [
      "Ekstrakurikuler memberi ruang pengembangan minat, bakat, dan keterampilan siswa di luar pembelajaran kelas.",
      "Extracurricular activities develop students’ interests, talents and skills beyond classroom learning."
    ],
    [
      "Koordinasi kegiatan berkaitan dengan perencanaan, pendampingan, dan dukungan bagi pembinaan prestasi siswa.",
      "Activity coordination concerns planning, guidance and support for student achievement development."
    ],
    [
      "Kegiatan yang terarah membantu siswa membangun kedisiplinan, kerja sama, dan keberanian untuk berpartisipasi.",
      "Organised activities help students develop discipline, teamwork and confidence to participate."
    ]
  ],
  "sejarah": [
    [
      "Sejarah mempelajari peristiwa masa lalu serta hubungannya dengan perkembangan kehidupan masyarakat.",
      "History studies past events and their relationship with the development of society."
    ],
    [
      "Pembelajaran berkaitan dengan sumber sejarah, urutan waktu, dan analisis sebab serta akibat peristiwa.",
      "Learning covers historical sources, chronology and analysing the causes and effects of events."
    ],
    [
      "Keterampilan yang dikembangkan meliputi berpikir kritis, membaca sumber, dan memahami perubahan dalam masyarakat.",
      "Skills include critical thinking, interpreting sources and understanding changes in society."
    ]
  ],
  "administrasi": [
    [
      "Administrasi sekolah mendukung keteraturan dokumen, informasi, dan layanan operasional.",
      "School administration supports organised documents, information and operational services."
    ],
    [
      "Lingkup bidang ini berkaitan dengan pengelolaan data, korespondensi, kebutuhan logistik, dan koordinasi layanan.",
      "This field concerns data management, correspondence, logistics needs and service coordination."
    ],
    [
      "Ketelitian dan komunikasi mendukung kelancaran kegiatan serta kemudahan akses informasi sekolah.",
      "Attention to detail and communication support smooth activities and access to school information."
    ]
  ]
};

const records = [
  { ...{
  "nama": "Thoriq Abdul Azis M, S.Kom.",
  "jabatan": "Staf Sinergi, Unit Produksi & Alumni",
  "jabatanOrganisasi": "Staf Sinergi, Unit Produksi & Alumni",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf Sinergi, Unit Produksi & Alumni dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Synergy, Production Unit & Alumni Staff in support of school activities.",
  "jabatanEn": "Synergy, Production Unit & Alumni Staff",
  "bidang": "sinergi",
  "sourceFile": "Thoriq Abdul Azis M, S. Kom. (Staf Sinergi, UP & Alumni).png",
  "sourcePhoto": {
    "width": 1540,
    "height": 931,
    "crop": {
      "left": 340,
      "top": 260,
      "width": 520,
      "height": 650
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo0, thumbnail: thumb0 },
  { ...{
  "nama": "Susi Listyarini, S.Pd.",
  "jabatan": "Koord. QDPM",
  "jabatanOrganisasi": "Koord. QDPM",
  "mapel": null,
  "deskripsi": "Berperan sebagai Koord. QDPM dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as QDPM Coordinator in support of school activities.",
  "jabatanEn": "QDPM Coordinator",
  "bidang": "mutu",
  "sourceFile": "Susi Listyarini, S.Pd (Koord. QDPM)",
  "sourcePhoto": {
    "width": 1919,
    "height": 1079,
    "crop": {
      "left": 690,
      "top": 429,
      "width": 520,
      "height": 650
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo1, thumbnail: thumb1 },
  { ...{
  "nama": "Afhail Lucqi Sianggang, S.Kom.",
  "jabatan": "Kaur PPDB dan Komunikasi",
  "jabatanOrganisasi": "Kaur PPDB dan Komunikasi",
  "mapel": null,
  "deskripsi": "Berperan sebagai Kaur PPDB dan Komunikasi dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Head of Admissions and Communications in support of school activities.",
  "jabatanEn": "Head of Admissions and Communications",
  "bidang": "komunikasi",
  "sourceFile": "Afhail Lucqi Sianggang, S.Kom. (Kaur. PPDB dan Komunikasi).png",
  "sourcePhoto": {
    "width": 1919,
    "height": 1073,
    "crop": {
      "left": 714,
      "top": 280,
      "width": 632,
      "height": 790
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo2, thumbnail: thumb2 },
  { ...{
  "nama": "Anisa Rizqi Utami, S.Pd.",
  "jabatan": "Bimbingan Konseling",
  "jabatanOrganisasi": "Bimbingan Konseling",
  "mapel": null,
  "deskripsi": "Berperan sebagai Bimbingan Konseling dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Counselling in support of school activities.",
  "jabatanEn": "Counselling",
  "bidang": "bk",
  "sourceFile": "Anisa Rizqi Utami, S.Pd. (Bimbingan Konseling).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 420,
      "top": 430,
      "width": 520,
      "height": 650
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo3, thumbnail: thumb3 },
  { ...{
  "nama": "Agus Widodo, S.Kom.",
  "jabatan": "Staf Sarana Prasarana",
  "jabatanOrganisasi": "Staf Sarana Prasarana",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf Sarana Prasarana dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Facilities and Infrastructure Staff in support of school activities.",
  "jabatanEn": "Facilities and Infrastructure Staff",
  "bidang": "sarana",
  "sourceFile": "Agus Widodo, S.Kom(Staf Sarpra).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 670,
      "top": 280,
      "width": 640,
      "height": 800
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo4, thumbnail: thumb4 },
  { ...{
  "nama": "Nugrahani Puspitasari, S.I.Pust.",
  "jabatan": "Staf Perpustakaan",
  "jabatanOrganisasi": "Staf Perpustakaan",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf Perpustakaan dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Library Staff in support of school activities.",
  "jabatanEn": "Library Staff",
  "bidang": "perpustakaan",
  "sourceFile": "Nugrahani Puspitasari, S.I.Pust (Staf Perpustakaan).png",
  "sourcePhoto": {
    "width": 1919,
    "height": 1079,
    "crop": {
      "left": 720,
      "top": 354,
      "width": 580,
      "height": 725
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo5, thumbnail: thumb5 },
  { ...{
  "nama": "Arif Muttakin, S.T.",
  "jabatan": "Waka Bid. Kesiswaan",
  "jabatanOrganisasi": "Waka Bid. Kesiswaan",
  "mapel": null,
  "deskripsi": "Berperan sebagai Waka Bid. Kesiswaan dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Vice Principal for Student Affairs in support of school activities.",
  "jabatanEn": "Vice Principal for Student Affairs",
  "bidang": "kesiswaan",
  "sourceFile": "Arif Muttakin, S.T.(Waka Bid. Kesiswaan).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 648,
      "top": 300,
      "width": 624,
      "height": 780
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo6, thumbnail: thumb6 },
  { ...{
  "nama": "Agung Restu Saputra, S.Kom.",
  "jabatan": "PIC IT, Lab & Sarana Prasarana",
  "jabatanOrganisasi": "PIC IT, Lab & Sarana Prasarana",
  "mapel": null,
  "deskripsi": "Berperan sebagai PIC IT, Lab & Sarana Prasarana dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as IT, Laboratory and Facilities Lead in support of school activities.",
  "jabatanEn": "IT, Laboratory and Facilities Lead",
  "bidang": "teknisi",
  "sourceFile": "Agung Restu Saputra,S.Kom(PIC.IT, Lab & SarPra).png",
  "sourcePhoto": {
    "width": 1919,
    "height": 1079,
    "crop": {
      "left": 570,
      "top": 250,
      "width": 640,
      "height": 800
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo7, thumbnail: thumb7 },
  { ...{
  "nama": "Princes Iqlima Kafilla, S.Kom.",
  "jabatan": "Koord. Program Keahlian PPLG",
  "jabatanOrganisasi": "Koord. Program Keahlian PPLG",
  "mapel": null,
  "deskripsi": "Berperan sebagai Koord. Program Keahlian PPLG dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Software and Game Development Program Coordinator in support of school activities.",
  "jabatanEn": "Software and Game Development Program Coordinator",
  "bidang": "program",
  "sourceFile": "Princes Iqlima Kafilla,S. Kom (Koord. ProgramKeahlian PPLG)).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 650,
      "top": 355,
      "width": 580,
      "height": 725
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo8, thumbnail: thumb8 },
  { ...{
  "nama": "Lulu Zakiyah, S.Kom.",
  "jabatan": "Pembina Sekbid X",
  "jabatanOrganisasi": "Pembina Sekbid X",
  "mapel": null,
  "deskripsi": "Berperan sebagai Pembina Sekbid X dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Adviser for Section X in support of school activities.",
  "jabatanEn": "Adviser for Section X",
  "bidang": "kesiswaan",
  "sourceFile": "Lulu Zakiyah, S.Kom(Pembina Sekbid X).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 600,
      "top": 355,
      "width": 580,
      "height": 725
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo9, thumbnail: thumb9 },
  { ...{
  "nama": "Agustiana Dwi Nurcahyani, S.Pd., M.Pd.",
  "jabatan": "Staf PPDB dan Komunikasi",
  "jabatanOrganisasi": "Staf PPDB dan Komunikasi",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf PPDB dan Komunikasi dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Admissions and Communications Staff in support of school activities.",
  "jabatanEn": "Admissions and Communications Staff",
  "bidang": "komunikasi",
  "sourceFile": "Agustiana Dwi Nurcahyani, S.Pd, M.Pd(Staf PPDB dan Komunikasi).png",
  "sourcePhoto": {
    "width": 1068,
    "height": 817,
    "crop": {
      "left": 290,
      "top": 217,
      "width": 480,
      "height": 600
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo10, thumbnail: thumb10 },
  { ...{
  "nama": "Imam Sugiharto, S.Pd.I.",
  "jabatan": "Pembina Sekbid I (Rohis)",
  "jabatanOrganisasi": "Pembina Sekbid I (Rohis)",
  "mapel": null,
  "deskripsi": "Berperan sebagai Pembina Sekbid I (Rohis) dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Adviser for Section I (Islamic Spiritual Activities) in support of school activities.",
  "jabatanEn": "Adviser for Section I (Islamic Spiritual Activities)",
  "bidang": "rohis",
  "sourceFile": "Imam Sugiharto, S.Pd.I.(Pembina Sekbid I (Rohis)).png",
  "sourcePhoto": {
    "width": 1452,
    "height": 848,
    "crop": {
      "left": 430,
      "top": 248,
      "width": 480,
      "height": 600
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo11, thumbnail: thumb11 },
  { ...{
  "nama": "Saefullah S",
  "jabatan": "Laboran / Teknisi",
  "jabatanOrganisasi": "Laboran / Teknisi",
  "mapel": null,
  "deskripsi": "Berperan sebagai Laboran / Teknisi dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Laboratory Assistant / Technician in support of school activities.",
  "jabatanEn": "Laboratory Assistant / Technician",
  "bidang": "teknisi",
  "sourceFile": "Saefullah S (Laboran_Teknisi).png",
  "sourcePhoto": {
    "width": 1919,
    "height": 1079,
    "crop": {
      "left": 650,
      "top": 270,
      "width": 640,
      "height": 800
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo12, thumbnail: thumb12 },
  { ...{
  "nama": "Winda Yusmawardani Putri, S.Pd.",
  "jabatan": "Staf Perencanaan KBM dan Perpustakaan",
  "jabatanOrganisasi": "Staf Perencanaan KBM dan Perpustakaan",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf Perencanaan KBM dan Perpustakaan dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Teaching and Learning Planning and Library Staff in support of school activities.",
  "jabatanEn": "Teaching and Learning Planning and Library Staff",
  "bidang": "perpustakaan",
  "sourceFile": "Winda Yusmawardani Putri, S.Pd (Staf Perencanaan KBM dan Perpustakaan).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 590,
      "top": 330,
      "width": 600,
      "height": 750
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo13, thumbnail: thumb13 },
  { ...{
  "nama": "Wahyuni Tri Widayati, S.Pd.",
  "jabatan": "Staf Pelaksanaan dan Evaluasi KBM",
  "jabatanOrganisasi": "Staf Pelaksanaan dan Evaluasi KBM",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf Pelaksanaan dan Evaluasi KBM dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Teaching and Learning Implementation and Evaluation Staff in support of school activities.",
  "jabatanEn": "Teaching and Learning Implementation and Evaluation Staff",
  "bidang": "kbm",
  "sourceFile": "Wahyuni Tri Widayati, S.Pd (Staf Pelaksanaan dan Evaluasi KBM).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 610,
      "top": 380,
      "width": 560,
      "height": 700
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo14, thumbnail: thumb14 },
  { ...{
  "nama": "Teguh Arif Hidayatuloh, S.Kom.",
  "jabatan": "Staf Sarana Prasarana",
  "jabatanOrganisasi": "Staf Sarana Prasarana",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf Sarana Prasarana dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Facilities and Infrastructure Staff in support of school activities.",
  "jabatanEn": "Facilities and Infrastructure Staff",
  "bidang": "sarana",
  "sourceFile": "Teguh Arif Hidayatuloh, S.Kom (Staf Sapra).png",
  "sourcePhoto": {
    "width": 1918,
    "height": 1079,
    "crop": {
      "left": 620,
      "top": 310,
      "width": 600,
      "height": 750
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo15, thumbnail: thumb15 },
  { ...{
  "nama": "Nia Yuliana, S.Ak.",
  "jabatan": "Staf Administrasi Keuangan",
  "jabatanOrganisasi": "Staf Administrasi Keuangan",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf Administrasi Keuangan dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Financial Administration Staff in support of school activities.",
  "jabatanEn": "Financial Administration Staff",
  "bidang": "keuangan",
  "sourceFile": "Nia Yuliana, S Ak. (Staf Administrasi Keuangan).png",
  "sourcePhoto": {
    "width": 1917,
    "height": 1079,
    "crop": {
      "left": 750,
      "top": 350,
      "width": 520,
      "height": 650
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo16, thumbnail: thumb16 },
  { ...{
  "nama": "Prasetyo Adi Wibowo, S.Pd., M.Pd.",
  "jabatan": "Koord. Ekskul & Pembina Prestasi",
  "jabatanOrganisasi": "Koord. Ekskul & Pembina Prestasi",
  "mapel": null,
  "deskripsi": "Berperan sebagai Koord. Ekskul & Pembina Prestasi dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Extracurricular Activities Coordinator and Achievement Adviser in support of school activities.",
  "jabatanEn": "Extracurricular Activities Coordinator and Achievement Adviser",
  "bidang": "ekskul",
  "sourceFile": "Prasetyo Adi Wibowo, S. Pd., M.Pd (Koord. Eskul & Pembina Prestasi).png",
  "sourcePhoto": {
    "width": 1743,
    "height": 614,
    "crop": {
      "left": 830,
      "top": 239,
      "width": 300,
      "height": 375
    }
  },
  "imageWidth": 300,
  "imageHeight": 375
}, image: photo17, thumbnail: thumb17 },
  { ...{
  "nama": "Tisna Eka Darwati, S.Psi., S.Sos.",
  "jabatan": "Bimbingan Konseling",
  "jabatanOrganisasi": "Bimbingan Konseling",
  "mapel": null,
  "deskripsi": "Berperan sebagai Bimbingan Konseling dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Counselling in support of school activities.",
  "jabatanEn": "Counselling",
  "bidang": "bk",
  "sourceFile": "Tisna Eka Darwati, S. Psi., S. Sos (Bimbingan Konseling).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 660,
      "top": 330,
      "width": 600,
      "height": 750
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo18, thumbnail: thumb18 },
  { ...{
  "nama": "Bintang Nugraha KS, S.Kom.",
  "jabatan": "Staf Sinergi, Unit Produksi & Alumni",
  "jabatanOrganisasi": "Staf Sinergi, Unit Produksi & Alumni",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf Sinergi, Unit Produksi & Alumni dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Synergy, Production Unit & Alumni Staff in support of school activities.",
  "jabatanEn": "Synergy, Production Unit & Alumni Staff",
  "bidang": "sinergi",
  "sourceFile": "Bintang NugrahaKS,S.Kom(Staf Sinergu UP&Alumni).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 570,
      "top": 330,
      "width": 600,
      "height": 750
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo19, thumbnail: thumb19 },
  { ...{
  "nama": "Berlian Windasari, S.Kom.",
  "jabatan": "Staf Sinergi, Unit Produksi & Alumni",
  "jabatanOrganisasi": "Staf Sinergi, Unit Produksi & Alumni",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf Sinergi, Unit Produksi & Alumni dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Synergy, Production Unit & Alumni Staff in support of school activities.",
  "jabatanEn": "Synergy, Production Unit & Alumni Staff",
  "bidang": "sinergi",
  "sourceFile": "Berlian Windasari, S.Kom(Staf Sinergi, UP&Alumni).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 400,
      "top": 220,
      "width": 680,
      "height": 850
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo20, thumbnail: thumb20 },
  { ...{
  "nama": "Nina Wijiati, S.Pd.",
  "jabatan": "Staf Pelaksanaan dan Evaluasi KBM",
  "jabatanOrganisasi": "Staf Pelaksanaan dan Evaluasi KBM",
  "mapel": "Sejarah",
  "deskripsi": "Mengajar Sejarah dan tercatat sebagai Staf Pelaksanaan dan Evaluasi KBM.",
  "deskripsiEn": "Teaches History and is listed as Teaching and Learning Implementation and Evaluation Staff.",
  "jabatanEn": "Teaching and Learning Implementation and Evaluation Staff",
  "bidang": "sejarah",
  "sourceFile": "Nina Wijiati, S.Pd(Staf Pelaksana & Evaluasi KBM).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 660,
      "top": 260,
      "width": 560,
      "height": 700
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo21, thumbnail: thumb21 },
  { ...{
  "nama": "Siti Mufsohah Muhimmati, S.Ag.",
  "jabatan": "Pembina Sekbid VI",
  "jabatanOrganisasi": "Pembina Sekbid VI",
  "mapel": null,
  "deskripsi": "Berperan sebagai Pembina Sekbid VI dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Adviser for Section VI in support of school activities.",
  "jabatanEn": "Adviser for Section VI",
  "bidang": "kesiswaan",
  "sourceFile": "Siti Mufsohah Muhimmati,S.Ag (Pembina Sekbid VI).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 560,
      "top": 330,
      "width": 600,
      "height": 750
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo22, thumbnail: thumb22 },
  { ...{
  "nama": "Sri Mulani Widayati, S.Pd., M.Pd.",
  "jabatan": "Kepala Administrasi",
  "jabatanOrganisasi": "Kepala Administrasi",
  "mapel": null,
  "deskripsi": "Berperan sebagai Kepala Administrasi dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Head of Administration in support of school activities.",
  "jabatanEn": "Head of Administration",
  "bidang": "administrasi",
  "sourceFile": "Sri Mulani Widayati, S.Pd., M.Pd.(Kepala Administrasi).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 610,
      "top": 320,
      "width": 600,
      "height": 750
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo23, thumbnail: thumb23 },
  { ...{
  "nama": "Yuli Opia Sari, S.E.",
  "jabatan": "Staf HC, Logistik & Sekretariat",
  "jabatanOrganisasi": "Staf HC, Logistik & Sekretariat",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf HC, Logistik & Sekretariat dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Human Capital, Logistics and Secretariat Staff in support of school activities.",
  "jabatanEn": "Human Capital, Logistics and Secretariat Staff",
  "bidang": "administrasi",
  "sourceFile": "Yuli Opia Sari, S.E. (Staf HC, Logistik&Sekretariat).png",
  "sourcePhoto": {
    "width": 1919,
    "height": 1079,
    "crop": {
      "left": 676,
      "top": 310,
      "width": 608,
      "height": 760
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo24, thumbnail: thumb24 },
  { ...{
  "nama": "Tofik Nurhadi, S.Pd.",
  "jabatan": "Staf Perencanaan KBM dan Perpustakaan",
  "jabatanOrganisasi": "Staf Perencanaan KBM dan Perpustakaan",
  "mapel": null,
  "deskripsi": "Berperan sebagai Staf Perencanaan KBM dan Perpustakaan dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Teaching and Learning Planning and Library Staff in support of school activities.",
  "jabatanEn": "Teaching and Learning Planning and Library Staff",
  "bidang": "perpustakaan",
  "sourceFile": "Tofik Nurhadi,S.Pd. (Staf Perencanaan dan Perpustakaan).png",
  "sourcePhoto": {
    "width": 1919,
    "height": 1078,
    "crop": {
      "left": 500,
      "top": 278,
      "width": 640,
      "height": 800
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo25, thumbnail: thumb25 },
  { ...{
  "nama": "Krisma Dwi Brata, S.Kom.",
  "jabatan": "Waka Bid. Hubungan Industri & Komunikasi",
  "jabatanOrganisasi": "Waka Bid. Hubungan Industri & Komunikasi",
  "mapel": null,
  "deskripsi": "Berperan sebagai Waka Bid. Hubungan Industri & Komunikasi dalam mendukung kegiatan sekolah.",
  "deskripsiEn": "Serves as Vice Principal for Industry Relations and Communications in support of school activities.",
  "jabatanEn": "Vice Principal for Industry Relations and Communications",
  "bidang": "sinergi",
  "sourceFile": "Krisma Dwi Brata, S. Kom ( Waka Bid. Hubin & Komunikasi).png",
  "sourcePhoto": {
    "width": 1920,
    "height": 1080,
    "crop": {
      "left": 540,
      "top": 270,
      "width": 640,
      "height": 800
    }
  },
  "imageWidth": 480,
  "imageHeight": 600
}, image: photo26, thumbnail: thumb26 }
];

export const guruBaruData = records.map((guru) => ({
  ...guru,
  body: descriptions[guru.bidang].map(([id]) => id),
  photoCropClassName: 'w-full left-0 top-0',
  imageSrcSet: guru.imageWidth > 240 ? `${guru.thumbnail} 240w, ${guru.image} ${guru.imageWidth}w` : undefined,
}));

// Hilangkan catatan mapel kosong dari profil guru lama tanpa mengubah Profil Sekolah.
const cleanSubjectNote = text => text
  .replace('; mata pelajaran yang diampu [perlu konfirmasi].', '.')
  .replace(' Mata pelajaran yang diampu masih [perlu konfirmasi].', '');

export const profilGuruData = [...guruData.map(guru => ({
  ...guru,
  mapel: guru.mapel === '[perlu konfirmasi]' ? null : guru.mapel,
  deskripsi: cleanSubjectNote(guru.deskripsi),
})), ...guruBaruData];
export const profilGuruDetail = [...guruDetail.map(guru => ({
  ...guru,
  lead: cleanSubjectNote(guru.lead),
  body: guru.body.map(cleanSubjectNote),
  facts: guru.facts.filter(fact => fact.value !== '[perlu konfirmasi]'),
})), ...guruBaruData.map(guru => ({
  slug: slugify(guru.nama),
  kategori: 'Profil Guru & Tenaga Pendidik',
  title: guru.nama,
  subtitle: guru.jabatan,
  image: guru.image,
  imageAlt: guru.nama,
  imageSrcSet: guru.imageSrcSet,
  imageWidth: guru.imageWidth,
  imageHeight: guru.imageHeight,
  imageSizes: '(min-width: 640px) 384px, 90vw',
  photoCropClassName: guru.photoCropClassName,
  lead: guru.deskripsi,
  body: guru.body,
  facts: [
    ...(guru.mapel ? [{ label: 'Mata Pelajaran', value: guru.mapel }] : []),
    { label: 'Jabatan Organisasi', value: guru.jabatanOrganisasi },
  ],
}))];

// Terjemahan lokal pada chunk rute guru agar JavaScript awal tidak bertambah.
export const profilGuruTranslations = Object.fromEntries([
  ['Sejarah', 'History'],
  ['Tercatat pada bidang Karakter.', 'Listed in Character Development.'],
  ['Informasi yang tersedia mencatat peran pada bidang Karakter.', 'Available information records a role in Character Development.'],
  ...Object.values(descriptions).flat(),
  ...records.flatMap(guru => [[guru.jabatan, guru.jabatanEn], [guru.deskripsi, guru.deskripsiEn]]),
]);
