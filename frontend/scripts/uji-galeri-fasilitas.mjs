import assert from 'node:assert/strict';
import { createServer } from 'vite';

const expected = [
  'kelas-inovasi.jpg',
  'ruang-kelas-1.jpg',
  'ruang-kelas-2.jpeg',
  'laboratorium-tjkt.jpeg',
  'robotik-1.png',
  'robotik-2.png',
  'robotik-3.png',
];
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });

try {
  const { profilVideo } = await server.ssrLoadModule('/src/data/dummyData.js');
  const actual = profilVideo.galeri.map(({ image }) => image.split('/').at(-1));
  assert.deepEqual(actual, expected);
  console.log(`Galeri fasilitas menampilkan ${actual.length} foto.`);
} finally {
  await server.close();
}
