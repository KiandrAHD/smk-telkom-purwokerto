import { slugify } from '../utils/slug';
import photo0 from '../assets/tentang/guru/bu-firda.png';
import photo1 from '../assets/tentang/guru/pak-aic.png';
import photo2 from '../assets/tentang/guru/pak-bayu.png';
import photo3 from '../assets/tentang/guru/herdiyanto.jpeg';
import photo4 from '../assets/tentang/guru/pak-nandar.png';
import photo5 from '../assets/tentang/guru/pak-ragil.png';
import photo6 from '../assets/tentang/guru/andang-jaka-patrianta.jpeg';
import photo7 from '../assets/tentang/guru/anggita-laras-pratama.jpeg';
import photo8 from '../assets/tentang/guru/keksi-manik-setyawati.jpeg';
import photo9 from '../assets/tentang/guru/sutri-aniroh.jpeg';
import photo10 from '../assets/tentang/guru/desti-nurcahyani.jpeg';
import photo11 from '../assets/tentang/guru/finka-ayu-fitriani.jpeg';
import photo12 from '../assets/tentang/guru/reza-aditya-permana.jpeg';
import photo13 from '../assets/tentang/guru/arif-muttakin.jpeg';
import photo14 from '../assets/tentang/guru/krisma-dwi-brata.jpeg';

// Nama dan jabatan: SK Pengawakan TP 2026/2027, halaman 2–3.
// Mata pelajaran: informasi pengguna. Kesiswaan untuk Krisma: konfirmasi pengguna.
// Deskripsi adalah ringkasan editorial, bukan kutipan biografi dalam SK.
export const guruData = [
  {
    "nama": "Firda Ayu Nirmala, S.Kom.",
    "mapel": "Guru Mapel Kejuruan 2",
    "jabatan": "Guru Mapel Kejuruan 2",
    "bidang": "Mengajar Mapel Kejuruan 2 dan tercatat sebagai Staf Sinergi, Unit Produksi & Alumni.",
    "deskripsi": "Mengajar Mapel Kejuruan 2 dan tercatat sebagai Staf Sinergi, Unit Produksi & Alumni.",
    "jabatanOrganisasi": "Staf Sinergi, Unit Produksi & Alumni",
    "sourcePage": 3,
    "image": photo0,
    "photoCropClassName": "w-[171.6667%] left-[-38.8889%] top-[-7.7778%]",
    "crop": {
      "left": 140,
      "top": 35,
      "width": 360,
      "height": 450,
      "sourceWidth": 618,
      "sourceHeight": 665
    }
  },
  {
    "nama": "Agus Indra Cahaya, S.Kom.",
    "mapel": "Guru Mapel Kejuruan 3",
    "jabatan": "Guru Mapel Kejuruan 3",
    "bidang": "Mengajar Mapel Kejuruan 3 dan tercatat sebagai Staf Teknologi Informasi.",
    "deskripsi": "Mengajar Mapel Kejuruan 3 dan tercatat sebagai Staf Teknologi Informasi.",
    "jabatanOrganisasi": "Staf Teknologi Informasi",
    "sourcePage": 3,
    "image": photo1,
    "photoCropClassName": "w-[120.2083%] left-[-13.5417%] top-[-4.1667%]",
    "crop": {
      "left": 65,
      "top": 25,
      "width": 480,
      "height": 600,
      "sourceWidth": 577,
      "sourceHeight": 703
    }
  },
  {
    "nama": "Bayu Aji Sukma, S.Si.",
    "mapel": "Matematika",
    "jabatan": "Matematika",
    "bidang": "Mengajar Matematika dan mengoordinasikan perencanaan kegiatan belajar mengajar serta perpustakaan.",
    "deskripsi": "Mengajar Matematika dan mengoordinasikan perencanaan kegiatan belajar mengajar serta perpustakaan.",
    "jabatanOrganisasi": "Koord. Perencanaan KBM dan Perpustakaan",
    "sourcePage": 2,
    "image": photo2,
    "photoCropClassName": "w-[117.0833%] left-[-14.5833%] top-[-3.3333%]",
    "crop": {
      "left": 70,
      "top": 20,
      "width": 480,
      "height": 600,
      "sourceWidth": 562,
      "sourceHeight": 769
    }
  },
  {
    "nama": "Herdiyanto, S.Sos.I., M.Pd.",
    "mapel": "Pembelajaran Agama Islam",
    "jabatan": "Pembelajaran Agama Islam",
    "bidang": "Mengajar Pembelajaran Agama Islam dan tercatat sebagai Pembina Kerohanian.",
    "deskripsi": "Mengajar Pembelajaran Agama Islam dan tercatat sebagai Pembina Kerohanian.",
    "jabatanOrganisasi": "Pembina Kerohanian",
    "sourcePage": 3,
    "image": photo3,
    "photoCropClassName": "w-[333.3333%] left-[-121.875%] top-[-41.6667%]",
    "crop": {
      "left": 585,
      "top": 250,
      "width": 480,
      "height": 600,
      "sourceWidth": 1600,
      "sourceHeight": 900
    }
  },
  {
    "nama": "Arif Munandar, S.Si.",
    "mapel": "[perlu konfirmasi]",
    "jabatan": "Karakter",
    "bidang": "Tercatat pada bidang Karakter; mata pelajaran yang diampu [perlu konfirmasi].",
    "deskripsi": "Tercatat pada bidang Karakter; mata pelajaran yang diampu [perlu konfirmasi].",
    "jabatanOrganisasi": "Karakter",
    "sourcePage": 3,
    "image": photo4,
    "photoCropClassName": "w-[203.6364%] left-[-47.7273%] top-[-30.9091%]",
    "crop": {
      "left": 210,
      "top": 170,
      "width": 440,
      "height": 550,
      "sourceWidth": 896,
      "sourceHeight": 898
    }
  },
  {
    "nama": "Ragil Rudi Priyanto, S.Si.",
    "mapel": "Informatika",
    "jabatan": "Informatika",
    "bidang": "Mengajar Informatika dan tercatat sebagai Kepala Urusan Pelaksanaan dan Evaluasi KBM.",
    "deskripsi": "Mengajar Informatika dan tercatat sebagai Kepala Urusan Pelaksanaan dan Evaluasi KBM.",
    "jabatanOrganisasi": "Kaur Pelaksanaan dan Evaluasi KBM",
    "sourcePage": 2,
    "image": photo5,
    "photoCropClassName": "w-[136.875%] left-[-26.0417%] top-[-4.1667%]",
    "crop": {
      "left": 125,
      "top": 25,
      "width": 480,
      "height": 600,
      "sourceWidth": 657,
      "sourceHeight": 803
    }
  },
  {
    "nama": "Andang Jaka Patrianta, S.Pd.",
    "mapel": "Bahasa Jawa",
    "jabatan": "Bahasa Jawa",
    "bidang": "Mengajar Bahasa Jawa dan tercatat sebagai Kepala Urusan Bimbingan Konseling & Karakter.",
    "deskripsi": "Mengajar Bahasa Jawa dan tercatat sebagai Kepala Urusan Bimbingan Konseling & Karakter.",
    "jabatanOrganisasi": "Kaur Bimbingan Konseling & Karakter",
    "sourcePage": 2,
    "image": photo6,
    "photoCropClassName": "w-[333.3333%] left-[-116.6667%] top-[-43.3333%]",
    "crop": {
      "left": 560,
      "top": 260,
      "width": 480,
      "height": 600,
      "sourceWidth": 1600,
      "sourceHeight": 900
    }
  },
  {
    "nama": "Anggita Laras Pratama, S.Pd., M.Pd.",
    "mapel": "Seni Budaya",
    "jabatan": "Seni Budaya",
    "bidang": "Mengajar Seni Budaya dan tercatat sebagai Pembina Sekbid IV.",
    "deskripsi": "Mengajar Seni Budaya dan tercatat sebagai Pembina Sekbid IV.",
    "jabatanOrganisasi": "Pembina Sekbid IV",
    "sourcePage": 2,
    "image": photo7,
    "photoCropClassName": "w-[294.1176%] left-[-110.2941%] top-[-30.8824%]",
    "crop": {
      "left": 600,
      "top": 210,
      "width": 544,
      "height": 680,
      "sourceWidth": 1600,
      "sourceHeight": 900
    }
  },
  {
    "nama": "Keksi Manik Setyawati, S.Pd.",
    "mapel": "PJOK",
    "jabatan": "PJOK",
    "bidang": "Mengajar PJOK dan tercatat pada bidang penerimaan siswa serta komunikasi.",
    "deskripsi": "Mengajar PJOK dan tercatat pada bidang penerimaan siswa serta komunikasi.",
    "jabatanOrganisasi": "Staf Penerimaan Siswa dan Komunikasi",
    "sourcePage": 3,
    "image": photo8,
    "photoCropClassName": "w-[333.3333%] left-[-102.0833%] top-[-40.8333%]",
    "crop": {
      "left": 490,
      "top": 245,
      "width": 480,
      "height": 600,
      "sourceWidth": 1600,
      "sourceHeight": 900
    }
  },
  {
    "nama": "Sutri Aniroh, S.Kom.",
    "mapel": "Dasar Pengembangan Koding B",
    "jabatan": "Dasar Pengembangan Koding B",
    "bidang": "Mengajar Dasar Pengembangan Koding B dan mengoordinasikan HC, Logistik & Sekretariat.",
    "deskripsi": "Mengajar Dasar Pengembangan Koding B dan mengoordinasikan HC, Logistik & Sekretariat.",
    "jabatanOrganisasi": "Koord. HC, Logistik & Sekretariat",
    "sourcePage": 2,
    "image": photo9,
    "photoCropClassName": "w-[500%] left-[-153.125%] top-[-87.5%]",
    "crop": {
      "left": 490,
      "top": 350,
      "width": 320,
      "height": 400,
      "sourceWidth": 1600,
      "sourceHeight": 900
    }
  },
  {
    "nama": "Desti Nurcahyani, S.Pd.Si.",
    "mapel": "PIPAS",
    "jabatan": "PIPAS",
    "bidang": "Mengajar PIPAS dan tercatat sebagai Wakil Kepala Sekolah Bidang Kurikulum.",
    "deskripsi": "Mengajar PIPAS dan tercatat sebagai Wakil Kepala Sekolah Bidang Kurikulum.",
    "jabatanOrganisasi": "Waka Bid. Kurikulum",
    "sourcePage": 2,
    "image": photo10,
    "photoCropClassName": "w-[363.6364%] left-[-136.3636%] top-[-60%]",
    "crop": {
      "left": 600,
      "top": 330,
      "width": 440,
      "height": 550,
      "sourceWidth": 1600,
      "sourceHeight": 900
    }
  },
  {
    "nama": "Finka Ayu Fitriani, S.Pd.",
    "mapel": "Bahasa Inggris",
    "jabatan": "Bahasa Inggris",
    "bidang": "Mengajar Bahasa Inggris dan tercatat sebagai Staf Sinergi, Unit Produksi & Alumni.",
    "deskripsi": "Mengajar Bahasa Inggris dan tercatat sebagai Staf Sinergi, Unit Produksi & Alumni.",
    "jabatanOrganisasi": "Staf Sinergi, Unit Produksi & Alumni",
    "sourcePage": 3,
    "image": photo11,
    "photoCropClassName": "w-[400%] left-[-155%] top-[-62%]",
    "crop": {
      "left": 620,
      "top": 310,
      "width": 400,
      "height": 500,
      "sourceWidth": 1600,
      "sourceHeight": 897
    }
  },
  {
    "nama": "Reza Aditya Permana, S.Kom.",
    "mapel": "Kreativitas, Inovasi, dan Kewirausahaan",
    "jabatan": "Kreativitas, Inovasi, dan Kewirausahaan",
    "bidang": "Mengajar Kreativitas, Inovasi, dan Kewirausahaan serta tercatat sebagai Pembina Sekbid IX.",
    "deskripsi": "Mengajar Kreativitas, Inovasi, dan Kewirausahaan serta tercatat sebagai Pembina Sekbid IX.",
    "jabatanOrganisasi": "Pembina Sekbid IX",
    "sourcePage": 2,
    "image": photo12,
    "photoCropClassName": "w-[363.6364%] left-[-154.5455%] top-[-47.2727%]",
    "crop": {
      "left": 680,
      "top": 260,
      "width": 440,
      "height": 550,
      "sourceWidth": 1600,
      "sourceHeight": 894
    }
  },
  {
    "nama": "Arif Muttakin, S.T.",
    "mapel": "[perlu konfirmasi]",
    "jabatan": "Kesiswaan",
    "bidang": "Bertugas di bidang Kesiswaan dan tercatat sebagai Wakil Kepala Sekolah Bidang Kesiswaan & Karakter; mata pelajaran [perlu konfirmasi].",
    "deskripsi": "Bertugas di bidang Kesiswaan dan tercatat sebagai Wakil Kepala Sekolah Bidang Kesiswaan & Karakter; mata pelajaran [perlu konfirmasi].",
    "jabatanOrganisasi": "Waka Bid. Kesiswaan & Karakter",
    "sourcePage": 2,
    "image": photo13,
    "photoCropClassName": "w-[363.6364%] left-[-113.6364%] top-[-61.8182%]",
    "crop": {
      "left": 500,
      "top": 340,
      "width": 440,
      "height": 550,
      "sourceWidth": 1600,
      "sourceHeight": 900
    }
  },
  {
    "nama": "Krisma Dwi Brata, S.Kom.",
    "mapel": "[perlu konfirmasi]",
    "jabatan": "Kesiswaan",
    "bidang": "Bertugas di bidang Kesiswaan sesuai informasi terbaru; mata pelajaran [perlu konfirmasi].",
    "deskripsi": "Bertugas di bidang Kesiswaan sesuai informasi terbaru; mata pelajaran [perlu konfirmasi].",
    "jabatanOrganisasi": "Waka Bid. Hubungan Industri & Komunikasi",
    "sourcePage": 3,
    "image": photo14,
    "photoCropClassName": "w-[363.6364%] left-[-131.8182%] top-[-50%]",
    "crop": {
      "left": 580,
      "top": 275,
      "width": 440,
      "height": 550,
      "sourceWidth": 1600,
      "sourceHeight": 900
    }
  }
];

export const guruDetail = guruData.map((guru) => ({
  slug: slugify(guru.nama),
  kategori: 'Profil Guru & Tenaga Pendidik',
  title: guru.nama,
  subtitle: guru.jabatan,
  image: guru.image,
  imageAlt: guru.nama,
  photoCropClassName: guru.photoCropClassName,
  lead: guru.deskripsi,
  body: guru.nama === 'Krisma Dwi Brata, S.Kom.'
    ? ['SK mencantumkan Hubungan Industri & Komunikasi. Jabatan Kesiswaan mengikuti informasi terbaru dan perlu diselaraskan dengan dokumen sekolah.']
    : [],
  facts: [
    { label: 'Mata Pelajaran', value: guru.mapel },
    { label: 'Jabatan dalam SK 2026/2027', value: guru.jabatanOrganisasi },
    ...(guru.nama === 'Krisma Dwi Brata, S.Kom.' ? [{ label: 'Jabatan Terbaru', value: 'Kesiswaan' }] : []),
  ],
}));
