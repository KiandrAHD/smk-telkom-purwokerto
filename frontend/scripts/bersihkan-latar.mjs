// Membuat latar putih maskot STELA menjadi transparan.
//
// Masalahnya: stela-bot.png digambar sebagai avatar bulat, tetapi area di luar
// lingkarannya diisi PUTIH PEKAT, bukan transparan. Di halaman berlatar terang
// itu tidak terlihat. Di header widget chat yang berlatar merah, yang tampak
// adalah kotak putih dengan potongan maskot di dalamnya.
//
// Diperbaiki di asetnya, bukan di keempat pemanggilnya, supaya pemakaian baru
// di kemudian hari tidak mengulang bug yang sama.
//
// Caranya banjir-isi (flood fill) dari tepi gambar, BUKAN "hapus semua piksel
// putih". Maskot ini punya badan putih; menghapus semua putih akan melubangi
// robotnya. Yang dibuang hanya putih yang tersambung ke tepi gambar.
//
// Jalankan: npm run aset:bersihkan

import { copyFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const AKAR = path.resolve(import.meta.dirname, '..', 'src', 'assets');
const CADANGAN = path.resolve(import.meta.dirname, 'foto-asli');

const DAFTAR = ['pengumuman/stela-bot.png'];

// Ambang longgar: putih hasil ekspor jarang benar-benar 255,255,255, dan tepi
// lingkaran biasanya punya piksel antara hasil anti-aliasing.
const AMBANG = 232;

const bersihkan = async (berkas) => {
  const sumber = path.join(AKAR, berkas);
  const cadangan = path.join(CADANGAN, berkas.replace('/', '__'));
  if (!existsSync(cadangan)) await copyFile(sumber, cadangan);

  const { data, info } = await sharp(cadangan)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: W, height: H } = info;
  const putih = (i) => data[i] >= AMBANG && data[i + 1] >= AMBANG && data[i + 2] >= AMBANG;

  // Banjir-isi dari seluruh piksel tepi. Antrean array biasa sudah cukup:
  // gambarnya 250x252, jadi rekursi tidak perlu dan memori tidak jadi soal.
  const sudahDilihat = new Uint8Array(W * H);
  const antrean = [];
  const dorong = (x, y) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const p = y * W + x;
    if (sudahDilihat[p]) return;
    if (!putih(p * 4)) return;
    sudahDilihat[p] = 1;
    antrean.push(p);
  };

  for (let x = 0; x < W; x++) { dorong(x, 0); dorong(x, H - 1); }
  for (let y = 0; y < H; y++) { dorong(0, y); dorong(W - 1, y); }

  let dibuang = 0;
  while (antrean.length) {
    const p = antrean.pop();
    data[p * 4 + 3] = 0;
    dibuang += 1;
    const x = p % W;
    const y = (p / W) | 0;
    dorong(x + 1, y);
    dorong(x - 1, y);
    dorong(x, y + 1);
    dorong(x, y - 1);
  }

  await sharp(data, { raw: { width: W, height: H, channels: 4 } })
    // effort 10 BUKAN lossless. Di sharp, opsi ini menyalakan kuantisasi
    // palet meski `palette` tidak diisi. Diukur pada berkas ini:
    //
    //   compressionLevel 9 saja : 106 KB, 0 piksel berubah
    //   + effort 10             :  24 KB, 47.539 piksel berubah
    //
    // Dipilih yang 24 KB setelah selisihnya diukur, bukan diterka: 93% piksel
    // yang berubah selisihnya di bawah 10/255 dan hanya 4 piksel di atas 20.
    // Maskot ini tampil paling besar pun cuma 63 px, jadi tidak kasatmata --
    // sementara 82 KB yang dihemat terasa, karena widget-nya ada di semua
    // halaman. Kalau suatu saat aset ini dipakai berukuran besar, buang
    // `effort` dan terima berkas 106 KB.
    .png({ compressionLevel: 9, effort: 10 })
    .toFile(sumber);

  return { berkas, ukuran: `${W}x${H}`, transparan: `${((100 * dibuang) / (W * H)).toFixed(1)}%` };
};

await mkdir(CADANGAN, { recursive: true });
const hasil = [];
for (const berkas of DAFTAR) hasil.push(await bersihkan(berkas));
console.table(hasil);

// Sanity check: badan robot tidak boleh ikut terhapus. Titik tengah gambar
// selalu berada di badan maskot, jadi ia wajib tetap buram.
const uji = await sharp(path.join(AKAR, DAFTAR[0])).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const tengah = (((uji.info.height >> 1) * uji.info.width + (uji.info.width >> 1)) * 4) + 3;
if (uji.data[tengah] < 250) {
  console.error('GAGAL: bagian tengah maskot ikut transparan, banjir-isi bocor ke badan robot.');
  process.exit(1);
}
console.log('Badan maskot utuh. Asli tersimpan di scripts/foto-asli/');
