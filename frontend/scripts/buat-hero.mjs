// Menyusun foto hero Prestasi, BKK, dan Berita di atas latar putih.
// Ukuran kanvas mengikuti hero yang sudah ada: 1600x751, rasio 2.13.
//
// Jalankan: node scripts/buat-hero.mjs

import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const AKAR = path.resolve(import.meta.dirname, '..', 'src', 'assets');
const L = 1600;
const T = 751;

// Kartu foto: sisakan margin supaya foto tetap terlihat mengambang.
const KARTU = { x: 96, y: 56, w: 950, h: 600, r: 44 };

// Bayangan lembut di bawah kartu supaya ia terbaca mengambang, bukan ditempel.
const bayangan = Buffer.from(`
<svg width="${L}" height="${T}" xmlns="http://www.w3.org/2000/svg">
  <defs><filter id="b" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="26"/>
  </filter></defs>
  <rect x="${KARTU.x + 10}" y="${KARTU.y + 22}" width="${KARTU.w}" height="${KARTU.h}"
        rx="${KARTU.r}" fill="#64748b" opacity="0.2" filter="url(#b)"/>
</svg>`);

const masker = Buffer.from(`
<svg width="${KARTU.w}" height="${KARTU.h}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${KARTU.w}" height="${KARTU.h}" rx="${KARTU.r}" fill="#fff"/>
</svg>`);

// Crop area sumber dipilih manual agar framing tiap foto tetap konsisten.
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
  .composite([{ input: bayangan }])
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
