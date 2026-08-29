// Menajamkan foto-foto yang piksel aslinya lebih kecil daripada ukuran
// tampilnya di layar. Bukan super-resolution: tidak ada detail baru yang
// dikarang. Yang dilakukan hanya dua hal yang memang membantu:
//
//   1. Resample Lanczos3 ke 2x. Browser meregangkan gambar kecil dengan
//      interpolasi bilinear yang kasar. Dengan piksel yang sudah cukup,
//      browser justru mengecilkan -- dan mengecilkan selalu lebih bersih
//      daripada membesarkan.
//   2. Unsharp mask ringan, untuk mengembalikan ketegasan tepi yang hilang
//      dimakan kompresi JPEG.
//
// Berkas asli disalin ke scripts/foto-asli/ sebelum ditimpa, jadi hasilnya
// selalu bisa dikembalikan.
//
// Jalankan: npm run foto:pertajam

import { mkdir, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const AKAR = path.resolve(import.meta.dirname, '..', 'src', 'assets');
const CADANGAN = path.resolve(import.meta.dirname, 'foto-asli');

// Hanya foto yang terbukti diregangkan atau tipis piksel untuk layar retina.
// Logo mitra sengaja tidak ikut: ukurannya memang kecil di layar, dan unsharp
// mask pada logo justru memunculkan garis halo di tepi huruf.
const DAFTAR = [
  // Dipotong dulu: 60% bagian bawahnya bidang putih kosong.
  { file: 'landing/jurusan-rpl.jpg', potong: true },
  { file: 'landing/jurusan-pg.jpg' },
  { file: 'landing/jurusan-tkj.jpg', potong: true },
  { file: 'landing/jurusan-tjat.jpg', potong: true },
  { file: 'landing/prestasi-1.jpg' },
  { file: 'landing/prestasi-2.jpg' },
  { file: 'landing/prestasi-3.jpg' },
  { file: 'landing/prestasi-4.jpg' },
  { file: 'landing/about-video.jpg' },
  { file: 'jurusan/showcase-rpl.jpg' },
  { file: 'jurusan/showcase-pg.jpg' },
  { file: 'jurusan/showcase-tkj.jpg' },
  { file: 'jurusan/showcase-tjat.jpg' },
];

// Lebar maksimum yang masuk akal. Di atas ini berkasnya membengkak tanpa ada
// yang terlihat lebih baik, karena slot terlebarnya cuma ~832px CSS.
const LEBAR_MAKS = 1800;

const jalan = async ({ file, potong }) => {
  const sumber = path.join(AKAR, file);
  const cadangan = path.join(CADANGAN, file.replace('/', '__'));

  if (!existsSync(cadangan)) await copyFile(sumber, cadangan);

  // Selalu baca dari cadangan supaya menjalankan ulang skrip ini tidak
  // menajamkan gambar yang sudah pernah ditajamkan (halo bertumpuk).
  let img = sharp(cadangan);
  const awal = await img.metadata();

  if (potong) {
    // trim() membuang bingkai berwarna seragam di tepi. Ambangnya longgar
    // karena putih hasil ekspor jarang benar-benar #ffffff.
    img = sharp(await img.trim({ background: '#ffffff', threshold: 12 }).toBuffer());
  }
  const setelahPotong = await img.metadata();

  const skala = Math.min(2, LEBAR_MAKS / setelahPotong.width);
  const lebar = Math.round(setelahPotong.width * skala);
  const tinggi = Math.round(setelahPotong.height * skala);

  let keluar = img.resize(lebar, tinggi, { kernel: 'lanczos3' }).sharpen({
    sigma: 0.9, // radius kecil: menegaskan tepi tanpa mengangkat noise JPEG
    m1: 0.4, // penguatan area rata ditahan rendah supaya langit/dinding tetap halus
    m2: 2.2, // penguatan tepi
  });

  keluar =
    path.extname(file) === '.png'
      ? keluar.png({ compressionLevel: 9, palette: false })
      : keluar.jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' });

  const { size } = await keluar.toFile(sumber);

  return {
    file,
    dari: `${awal.width}x${awal.height}`,
    potong: potong ? `${setelahPotong.width}x${setelahPotong.height}` : '-',
    jadi: `${lebar}x${tinggi}`,
    kb: Math.round(size / 1024),
  };
};

await mkdir(CADANGAN, { recursive: true });
const hasil = [];
for (const item of DAFTAR) hasil.push(await jalan(item));

console.table(hasil);
console.log(`\n${hasil.length} berkas diperbarui. Asli tersimpan di scripts/foto-asli/`);
console.log('Kembalikan dengan: npm run foto:pulihkan');

// Sanity check: tidak boleh ada hasil yang justru lebih kecil dari aslinya.
const menyusut = hasil.filter((h) => {
  const [wl] = h.jadi.split('x').map(Number);
  const [wa] = (h.potong === '-' ? h.dari : h.potong).split('x').map(Number);
  return wl < wa;
});
if (menyusut.length) {
  console.error('GAGAL: ada gambar yang malah mengecil', menyusut);
  process.exit(1);
}

// Pastikan cadangan lengkap, supaya pemulihan tidak setengah jalan.
const isiCadangan = await readdir(CADANGAN);
if (isiCadangan.length < DAFTAR.length) {
  console.error(`GAGAL: cadangan cuma ${isiCadangan.length} dari ${DAFTAR.length} berkas`);
  process.exit(1);
}
