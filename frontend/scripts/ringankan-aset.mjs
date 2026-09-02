// Mengecilkan aset gambar yang membengkak tanpa mengubah tampilannya.
//
// Foto disimpan sebagai PNG di folder tentang/ — enam berkas 1024x1024 saja
// memakan ~4,9 MB. PNG memang format yang keliru untuk foto: ia lossless dan
// tidak punya cara memampatkan gradasi.
//
// Dua perlakuan, dipilih otomatis berdasarkan isi berkasnya:
//
//   Buram (tanpa transparansi) -> JPEG. Penghematan terbesar, dan tidak ada
//   yang hilang karena tidak ada transparansi untuk dijaga.
//
//   Punya transparansi -> tetap PNG, hanya dimampatkan lebih agresif. Potret
//   guru adalah hasil cutout dengan ~50% piksel tembus pandang; mengubahnya
//   ke JPEG akan meratakannya jadi kotak putih di latar berwarna.
//
// Jalankan: npm run aset:ringankan

import { copyFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const AKAR = path.resolve(import.meta.dirname, '..', 'src', 'assets');
const CADANGAN = path.resolve(import.meta.dirname, 'foto-asli');
const SUMBER = path.join(AKAR, 'tentang');

// Di bawah ambang ini, transparansinya dianggap tidak disengaja (sisa
// anti-aliasing di tepi), bukan bagian dari desain.
const AMBANG_TRANSPARAN = 0.01;

const proses = async (nama) => {
  const asal = path.join(SUMBER, nama);
  const cadangan = path.join(CADANGAN, `tentang__${nama}`);
  if (!existsSync(cadangan)) await copyFile(asal, cadangan);

  const gambar = sharp(cadangan);
  const meta = await gambar.metadata();
  const ukuranAwal = statSync(asal).size;

  let transparan = 0;
  if (meta.hasAlpha) {
    const { data, info } = await sharp(cadangan).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let n = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] < 250) n += 1;
    transparan = n / (info.width * info.height);
  }

  if (transparan > AMBANG_TRANSPARAN) {
    // Tetap PNG. effort 10 memampatkan jauh lebih kuat; lihat catatan di
    // bersihkan-latar.mjs soal kompromi ketelitian warnanya.
    const { size } = await sharp(cadangan).png({ compressionLevel: 9, effort: 10 }).toFile(asal);
    return { nama, jadi: 'PNG (transparan dijaga)', kb: `${Math.round(ukuranAwal / 1024)} -> ${Math.round(size / 1024)}` };
  }

  const tujuan = asal.replace(/\.png$/i, '.jpg');
  const { size } = await sharp(cadangan)
    .jpeg({ quality: 86, mozjpeg: true, chromaSubsampling: '4:4:4' })
    .toFile(tujuan);
  await unlink(asal);
  return { nama, jadi: `JPEG (${path.basename(tujuan)})`, kb: `${Math.round(ukuranAwal / 1024)} -> ${Math.round(size / 1024)}` };
};

await mkdir(CADANGAN, { recursive: true });
const daftar = (await readdir(SUMBER)).filter((f) => f.toLowerCase().endsWith('.png'));
const hasil = [];
for (const nama of daftar) hasil.push(await proses(nama));

console.table(hasil);
const diubah = hasil.filter((h) => h.jadi.startsWith('JPEG')).map((h) => h.nama.replace(/\.png$/i, ''));
if (diubah.length) {
  console.log('\nBerkas berikut berganti ekstensi -- impornya harus ikut diperbarui:');
  for (const n of diubah) console.log(`  ${n}.png -> ${n}.jpg`);
}
