// Mengembalikan foto ke berkas asli sebelum dipertajam.
// Jalankan: npm run foto:pulihkan

import { readdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const AKAR = path.resolve(import.meta.dirname, '..', 'src', 'assets');
const CADANGAN = path.resolve(import.meta.dirname, 'foto-asli');

const berkas = await readdir(CADANGAN);
for (const nama of berkas) {
  await copyFile(path.join(CADANGAN, nama), path.join(AKAR, nama.replace('__', '/')));
}
console.log(`${berkas.length} foto dikembalikan ke versi asli.`);
