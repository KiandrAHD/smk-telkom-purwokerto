// Lapisan penahan biaya STELA.
//
// Urutannya sengaja dari yang paling murah ke paling mahal, dan permintaan
// harus lolos semuanya sebelum satu token pun dibeli:
//
//   1. Sakelar mati      -> matikan STELA tanpa deploy ulang
//   2. Anggaran harian   -> plafon total panggilan per hari
//   3. Pembatas per IP   -> tahan satu pengunjung membanjiri
//   4. Cache jawaban     -> pertanyaan yang sama tidak dibeli dua kali
//
// Lapisan 4 yang paling berdampak di situs sekolah: mayoritas pengunjung
// menanyakan hal yang itu-itu juga ("jurusan apa saja", "kapan PPDB"), dan
// satu jawaban tersimpan bisa melayani puluhan orang tanpa biaya tambahan.
//
// Hitungan ini hanya membatasi server dev. Edge memakai reserve_ai_attempt
// di Postgres untuk kuota bersama; pembatas IP/cache tetap lokal per isolate.

import { keluaranAman } from './inti.mjs';

const SEHARI_MS = 24 * 60 * 60 * 1000;

// Menyeragamkan pertanyaan supaya "Jurusan apa saja?", "jurusan apa saja",
// dan "Jurusan  apa  saja !" dianggap satu pertanyaan yang sama.
// Kunci cache diawali dengan prefiks bahasa (mis. id:jurusan apa saja, en:what majors are available)
const kunciPertanyaan = (teks, bahasa = 'id') => {
  const norm = teks
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[?!.,]+$/, '')
    .trim();
  return `${bahasa}:${norm}`;
};

export const buatPenjaga = ({
  aktif = true,
  maksPerHari = 500,
  maksPerIp = 20,
  jendelaIpMs = 5 * 60 * 1000,
  ttlCacheMs = 60 * 60 * 1000,
  maksCache = 200,
  maksIpDilacak = 5000,
} = {}) => {
  const kunjungan = new Map();
  const cache = new Map();
  let hariIni = Math.floor(Date.now() / SEHARI_MS);
  let terpakaiHariIni = 0;

  const putarHari = () => {
    const hari = Math.floor(Date.now() / SEHARI_MS);
    if (hari !== hariIni) {
      hariIni = hari;
      terpakaiHariIni = 0;
    }
  };

  return {
    // Dipanggil sebelum permintaan diproses. Mengembalikan alasan penolakan,
    // atau null kalau boleh lanjut.
    periksa(ip) {
      if (!aktif) {
        return { galat: 'STELA sedang dinonaktifkan sementara.', status: 503 };
      }

      putarHari();
      if (terpakaiHariIni >= maksPerHari) {
        return {
          galat: 'STELA sudah mencapai batas percakapan hari ini. Silakan coba lagi besok atau hubungi Tata Usaha.',
          status: 429,
        };
      }

      const sekarang = Date.now();
      const catatan = kunjungan.get(ip);
      if (!catatan || sekarang > catatan.reset) {
        kunjungan.set(ip, { jumlah: 1, reset: sekarang + jendelaIpMs });
      } else {
        catatan.jumlah += 1;
        if (catatan.jumlah > maksPerIp) {
          return { galat: 'Terlalu banyak pertanyaan. Coba lagi beberapa menit lagi.', status: 429 };
        }
      }

      // Buang catatan kedaluwarsa hanya saat map mulai besar, supaya jalur
      // normal tidak membayar biaya penyapuan di tiap permintaan.
      if (kunjungan.size > maksIpDilacak) {
        for (const [alamat, isi] of kunjungan) {
          if (sekarang > isi.reset) kunjungan.delete(alamat);
        }
      }

      return null;
    },

    // Cache hanya untuk pertanyaan pembuka satu pesan. Percakapan lanjutan
    // jawabannya bergantung konteks sebelumnya, jadi menyimpannya berisiko
    // memberi jawaban yang keliru ke orang lain.
    ambilCache(pesan, bahasa = 'id') {
      if (pesan.length !== 1) return null;
      const kunci = kunciPertanyaan(pesan[0].content, bahasa);
      const isi = cache.get(kunci);
      if (!isi) return null;
      if (Date.now() > isi.kedaluwarsa || !keluaranAman(isi.jawaban)) {
        cache.delete(kunci);
        return null;
      }
      // Sentuh ulang supaya entri populer tidak terbuang duluan saat penuh.
      cache.delete(kunci);
      cache.set(kunci, isi);
      return isi.jawaban;
    },

    simpanCache(pesan, jawaban, bahasa = 'id') {
      if (pesan.length !== 1 || !keluaranAman(jawaban)) return;
      // Map mempertahankan urutan sisip, jadi entri terlama ada di depan.
      if (cache.size >= maksCache) cache.delete(cache.keys().next().value);
      cache.set(kunciPertanyaan(pesan[0].content, bahasa), {
        jawaban,
        kedaluwarsa: Date.now() + ttlCacheMs,
      });
    },

    // Hanya dihitung saat panggilan berbayar benar-benar terjadi. Jawaban dari
    // cache tidak boleh memakan jatah harian -- justru itu gunanya.
    catatPanggilan() {
      putarHari();
      if (terpakaiHariIni >= maksPerHari) {
        throw Object.assign(new Error('Batas percobaan AI hari ini tercapai. Silakan coba lagi besok.'), {
          status: 429, untukPengguna: true, batasPanggilan: true,
        });
      }
      terpakaiHariIni += 1;
    },

    // Untuk log dan pengujian.
    statistik: () => ({ terpakaiHariIni, maksPerHari, ukuranCache: cache.size }),
  };
};
