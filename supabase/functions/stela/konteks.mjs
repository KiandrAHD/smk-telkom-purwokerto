// Memilih potongan pengetahuan sekolah yang relevan dengan satu pertanyaan,
// bukan mengirim seluruh isi situs setiap kali.
//
// Kenapa ini ada: pengetahuan lengkap STELA ~28.000 token. Tier gratis Groq
// hanya memberi 8.000 token per menit, jadi prompt penuh ditolak mentah-mentah
// dengan HTTP 413 -- bukan lambat, melainkan mustahil.
//
// Kenapa TIDAK dipakai untuk semua penyedia: Anthropic menagih prefix yang
// sama dengan harga cache (sekitar sepersepuluh). Prefix 28.000 token yang
// konstan justru lebih murah daripada 6.000 token yang berubah tiap
// pertanyaan, karena yang berubah tidak pernah kena cache. Jadi pemangkasan
// hanya untuk penyedia yang memang berplafon ketat.

import { KONTEN_SEKOLAH } from './konten-sekolah.mjs';

// Perkiraan kasar; cukup untuk memutuskan muat atau tidak. Tidak perlu presisi
// tokenizer sungguhan, dan tiap penyedia menghitungnya sedikit berbeda.
const perkiraanToken = (teks) => Math.ceil(teks.length / 4);

// Selalu disertakan berapa pun anggarannya: identitas sekolah, kontak, dan
// daftar jurusan. Tanpa ini STELA bisa kehilangan jati diri hanya karena
// pertanyaannya kebetulan tidak memuat kata "sekolah".
const INTI = [
  'aboutDescription',
  'visiMisi',
  'jurusanData',
  'footerData',
  'ppdbMeta',
  'kepalaSekolah',
];

// Kata yang muncul di hampir semua kalimat, jadi tidak membedakan apa pun.
const KATA_UMUM = new Set([
  'yang', 'dan', 'dari', 'untuk', 'dengan', 'apa', 'saja', 'ada', 'itu', 'ini',
  'bisa', 'kalau', 'atau', 'pada', 'adalah', 'tidak', 'sudah', 'akan', 'juga',
  'dalam', 'oleh', 'saya', 'kamu', 'anda', 'gimana', 'bagaimana', 'berapa',
  'kapan', 'siapa', 'kenapa', 'mengapa', 'mau', 'ingin', 'tolong', 'mohon',
  'nya', 'nih', 'dong', 'kah', 'sih', 'boleh', 'harus', 'bagi', 'tentang',
]);

const BAGIAN = KONTEN_SEKOLAH.split(/\n(?=## )/).map((teks) => {
  const nama = teks.slice(3, teks.indexOf('\n'));
  return { nama, teks, token: perkiraanToken(teks), badan: teks.toLowerCase() };
});

const kataKunci = (pertanyaan) => [
  ...new Set(
    pertanyaan
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((k) => k.length >= 4 && !KATA_UMUM.has(k)),
  ),
];

// Skor sederhana: kemunculan kata kunci di isi bagian, dengan bobot besar bila
// kata itu muncul di nama bagiannya. Nama bagian berasal dari nama export
// (jurusanDetail, ketentuanPpdb, ...) sehingga sudah cukup deskriptif.
const skor = (bagian, kunci) => {
  let nilai = 0;
  const nama = bagian.nama.toLowerCase();
  for (const kata of kunci) {
    if (nama.includes(kata)) nilai += 10;
    const cocok = bagian.badan.split(kata).length - 1;
    if (cocok) nilai += Math.min(cocok, 5);
  }
  return nilai;
};

// maksToken 0 atau tidak diisi berarti kirim penuh.
export const pilihKonten = (pertanyaan, maksToken = 0) => {
  if (!maksToken) return KONTEN_SEKOLAH;

  const dipakai = new Set(INTI);
  let terpakai = 0;
  const hasil = [];

  for (const bagian of BAGIAN) {
    if (!dipakai.has(bagian.nama)) continue;
    hasil.push(bagian);
    terpakai += bagian.token;
  }

  const kunci = kataKunci(pertanyaan);
  const kandidat = BAGIAN.filter((b) => !dipakai.has(b.nama))
    .map((b) => ({ b, s: skor(b, kunci) }))
    .filter((x) => x.s > 0)
    .sort((x, y) => y.s - x.s);

  for (const { b } of kandidat) {
    if (terpakai + b.token > maksToken) continue; // lewati yang kebesaran, coba berikutnya
    hasil.push(b);
    terpakai += b.token;
  }

  // Urutkan kembali sesuai urutan aslinya supaya susunannya tetap terbaca wajar.
  const urutan = new Map(BAGIAN.map((b, i) => [b.nama, i]));
  hasil.sort((a, b) => urutan.get(a.nama) - urutan.get(b.nama));

  return hasil.map((b) => b.teks).join('\n\n');
};

export const statistikKonten = () => ({
  jumlahBagian: BAGIAN.length,
  totalToken: perkiraanToken(KONTEN_SEKOLAH),
});
