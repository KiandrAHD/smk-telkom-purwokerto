// Menyusun foto hero untuk halaman yang tadinya menumpang hero-jurusan.jpg.
//
// Empat halaman (/jurusan, /prestasi, /bkk, /berita) memakai satu berkas yang
// sama, jadi keempatnya terlihat identik saat dibuka. Yang dibutuhkan bukan
// foto acak, melainkan foto yang masih terasa satu keluarga dengan dua hero
// yang sudah ada: latar putih, sapuan merah menyapu dari kanan bawah, subjek
// mengambang di atasnya.
//
// Sapuan merahnya digambar sendiri lewat SVG (bukan dipotong dari aset lama,
// karena di sana ia tertutup subjek), lalu fotonya ditaruh sebagai kartu
// bersudut tumpul di atasnya. Ukuran kanvas mengikuti hero yang sudah ada:
// 1600x751, rasio 2.13.
//
// Jalankan: node scripts/buat-hero.mjs

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const AKAR = path.resolve(import.meta.dirname, '..', 'src', 'assets');
const L = 1600;
const T = 751;

// Kartu foto: sisakan margin supaya sapuan merah terlihat mengintip di
// kanan dan bawah, bukan tertutup rata.
const KARTU = { x: 96, y: 56, w: 950, h: 600, r: 44 };

const MERAH = '#c8102e';

// Dua pita melengkung yang saling menimpa, meniru sapuan pada pengumuman-hero:
// satu pita gelap sebagai dasar, satu pita terang di atasnya.
const sapuan = Buffer.from(`
<svg width="${L}" height="${T}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tua" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="${MERAH}" stop-opacity="0.85"/>
      <stop offset="55%" stop-color="${MERAH}"/>
      <stop offset="100%" stop-color="#e8283f"/>
    </linearGradient>
    <linearGradient id="muda" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%" stop-color="#f36b73" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ff9d84" stop-opacity="0.9"/>
    </linearGradient>
    <filter id="halus" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="1.2"/>
    </filter>
  </defs>

  <!-- pita dasar: pita merah penuh di sepanjang bawah, menebal ke kanan -->
  <path filter="url(#halus)" fill="url(#tua)"
    d="M -40 ${T - 72}
       C 420 ${T - 78}, 880 ${T - 120}, 1200 ${T - 300}
       C 1400 ${T - 410}, 1520 ${T - 520}, ${L + 40} ${T - 625}
       L ${L + 40} ${T + 40} L -40 ${T + 40} Z" />

  <!-- pita terang: menumpang di atas pita dasar, hanya di paruh kanan -->
  <path filter="url(#halus)" fill="url(#muda)"
    d="M 300 ${T - 80}
       C 700 ${T - 122}, 1000 ${T - 232}, 1240 ${T - 400}
       C 1420 ${T - 520}, 1520 ${T - 620}, ${L + 40} ${T - 718}
       L ${L + 40} ${T - 622}
       C 1520 ${T - 522}, 1400 ${T - 412}, 1200 ${T - 302}
       C 880 ${T - 122}, 420 ${T - 80}, 300 ${T - 80} Z" />
</svg>`);

// Bayangan lembut di bawah kartu supaya ia terbaca mengambang, bukan ditempel.
const bayangan = Buffer.from(`
<svg width="${L}" height="${T}" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="b" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="26"/>
  </filter></defs>
  <rect x="${KARTU.x + 10}" y="${KARTU.y + 22}" width="${KARTU.w}" height="${KARTU.h}"
        rx="${KARTU.r}" fill="#8a1420" opacity="0.26" filter="url(#b)"/>
</svg>`);

const masker = Buffer.from(`
<svg width="${KARTU.w}" height="${KARTU.h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${KARTU.w}" height="${KARTU.h}" rx="${KARTU.r}" fill="#fff"/>
</svg>`);

// crop = area sumber yang dipakai. Dipilih manual, bukan center-crop, karena
// dua foto punya watermark yang harus ikut terpotong.
const HERO = [
  {
    keluar: 'prestasi/hero-prestasi.jpg',
    sumber: 'landing/prestasi-2.jpg',
    // Watermark "DreaminaAI" di kanan bawah dan lencana kecil di kiri atas
    // dibuang lewat batas crop ini.
    crop: { left: 55, top: 110, width: 1020, height: 644 },
  },
  {
    keluar: 'bkk/hero-bkk.jpg',
    sumber: 'tentang/lab-komputer.jpg',
    crop: { left: 0, top: 190, width: 1024, height: 647 },
  },
  {
    keluar: 'berita/hero-berita.jpg',
    sumber: 'tentang/school-building.jpg',
    crop: { left: 0, top: 160, width: 1024, height: 647 },
  },
];

const dasar = await sharp({
  create: { width: L, height: T, channels: 3, background: '#ffffff' },
})
  .composite([{ input: sapuan }, { input: bayangan }])
  .png()
  .toBuffer();

for (const { keluar, sumber, crop } of HERO) {
  const foto = await sharp(path.join(AKAR, sumber))
    .extract(crop)
    .resize(KARTU.w, KARTU.h, { fit: 'cover', kernel: 'lanczos3' })
    .composite([{ input: masker, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const tujuan = path.join(AKAR, keluar);
  await mkdir(path.dirname(tujuan), { recursive: true });
  const { size } = await sharp(dasar)
    .composite([{ input: foto, left: KARTU.x, top: KARTU.y }])
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(tujuan);

  console.log(`${keluar.padEnd(28)} <- ${sumber.padEnd(30)} ${Math.round(size / 1024)} KB`);
}
