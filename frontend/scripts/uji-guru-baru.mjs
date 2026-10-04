import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { guruData } = await server.ssrLoadModule('/src/data/guruData.js');
  const { guruBaruData, profilGuruData, profilGuruDetail, profilGuruTranslations } = await server.ssrLoadModule('/src/data/profilGuruData.js');
  assert.equal(guruData.length, 13, 'Daftar Profil Sekolah tetap 13 guru lama');
  assert.equal(guruBaruData.length, 27, 'Seluruh foto ZIP harus memiliki profil');
  assert.equal(profilGuruData.length, 40);
  assert.equal(profilGuruDetail.length, 40);
  assert.equal(new Set(profilGuruDetail.map(item => item.slug)).size, 40, 'Tidak ada slug ganda');
  assert.doesNotMatch(JSON.stringify(profilGuruData.map(item => [item.mapel, item.deskripsi])), /perlu konfirmasi/);
  assert.doesNotMatch(JSON.stringify(profilGuruDetail.map(item => [item.lead, item.body, item.facts])), /perlu konfirmasi/);
  for (const guru of guruBaruData) {
    assert(!guruData.some(item => item.nama === guru.nama), `Guru baru masuk Profil Sekolah: ${guru.nama}`);
    assert(guru.nama && guru.jabatanOrganisasi && guru.deskripsi && guru.sourceFile);
    const detail = profilGuruDetail.find(item => item.title === guru.nama);
    assert.equal(detail.body.length, 3, guru.nama);
    const mapelFact = detail.facts.find(item => item.label === 'Mata Pelajaran');
    if (guru.mapel) assert.equal(mapelFact?.value, guru.mapel);
    else assert.equal(mapelFact, undefined, 'Mapel yang belum tersedia tidak ditampilkan');
    assert.equal(detail.facts.find(item => item.label === 'Jabatan Organisasi')?.value, guru.jabatanOrganisasi);
    for (const text of [guru.jabatan, guru.deskripsi, ...detail.body]) {
      assert(profilGuruTranslations[text], `Terjemahan tidak tersedia: ${text}`);
    }
    for (const [url, expectedWidth, maxBytes] of [[guru.image, guru.imageWidth, 25 * 1024], [guru.thumbnail, 240, 10 * 1024]]) {
      const file = path.resolve(import.meta.dirname, '..', url.split('?')[0].replace(/^\//, ''));
      const meta = await sharp(file).metadata();
      assert.equal(meta.format, 'webp');
      assert.equal(meta.width, expectedWidth);
      assert.equal(meta.width / meta.height, 4 / 5, guru.nama);
      assert((await stat(file)).size < maxBytes, `Berkas terlalu besar: ${guru.nama}`);
    }
    const { crop: c, width, height } = guru.sourcePhoto;
    assert(c.left >= 0 && c.top >= 0 && c.left + c.width <= width && c.top + c.height <= height, guru.nama);
    assert.equal(c.width / c.height, 4 / 5);
    assert(guru.imageWidth <= c.width, 'Jangan memperbesar foto kecil');
    assert.equal(detail.imageSrcSet, guru.imageSrcSet);
  }
  assert.equal(guruBaruData.find(item => item.nama.startsWith('Nina Wijiati')).mapel, 'Sejarah', 'Label mapel pada foto Nina');
  const school = await readFile(new URL('../src/components/tentang/TentangKepalaSekolahSection.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(school, /profilGuruData|guruBaruData/);
  const shared = await readFile(new URL('../src/data/dummyData.js', import.meta.url), 'utf8');
  assert.doesNotMatch(shared, /profilGuruData|guruBaruData/);
  const detailPage = await readFile(new URL('../src/pages/DetailPelengkapPage.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(detailPage, /profilGuruData|guruBaruData/, 'Detail non-guru tidak memuat koleksi guru baru');
  console.log(`27 profil baru, 40 slug unik, 54 WebP optimal, crop 4:5, ID/EN, detail, dan isolasi 13 guru Profil Sekolah valid. Mapel belum dikonfirmasi: ${guruBaruData.filter(item => !item.mapel).length}.`);
} finally {
  await server.close();
}
