import assert from 'node:assert/strict';
import { createServer } from 'vite';
import sharp from 'sharp';
import path from 'node:path';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { guruData, guruDetail } = await server.ssrLoadModule('/src/data/dummyData.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  assert.equal(guruData.length, 13);
  assert.equal(guruDetail.length, 13);
  assert.equal(new Set(guruDetail.map(g => g.slug)).size, 13, 'Slug guru harus unik');
  const expected = new Map([
    ['Firda Ayu Nirmala, S.Kom.', 'Guru Mapel Kejuruan 2'],
    ['Agus Indra Cahaya, S.Kom.', 'Guru Mapel Kejuruan 3'],
    ['Bayu Aji Sukma, S.Si.', 'Matematika'],
    ['Herdiyanto, S.Sos.I., M.Pd.', 'Pembelajaran Agama Islam'],
    ['Ragil Rudi Priyanto, S.Si.', 'Informatika'],
    ['Andang Jaka Patrianta, S.Pd.', 'Bahasa Jawa'],
    ['Anggita Laras Pratama, S.Pd., M.Pd.', 'Seni Budaya'],
    ['Keksi Manik Setyawati, S.Pd.', 'PJOK'],
    ['Sutri Aniroh, S.Kom.', 'Dasar Pengembangan Koding B'],
    ['Desti Nurcahyani, S.Pd.Si.', 'PIPAS'],
    ['Finka Ayu Fitriani, S.Pd.', 'Bahasa Inggris'],
    ['Reza Aditya Permana, S.Kom.', 'Kreativitas, Inovasi, dan Kewirausahaan'],
  ]);
  for (const [index, guru] of guruData.entries()) {
    assert.equal(guru.mapel, expected.get(guru.nama) || '[perlu konfirmasi]', guru.nama);
    const file = path.resolve(import.meta.dirname, '..', guru.image.replace(/^\//, ''));
    const { width, height } = await sharp(file).metadata();
    const crop = guru.crop;
    assert.equal(width, crop.sourceWidth);
    assert.equal(height, crop.sourceHeight);
    assert(crop.left >= 0 && crop.top >= 0 && crop.left + crop.width <= width && crop.top + crop.height <= height, guru.nama);
    assert.equal(crop.width / crop.height, 4 / 5);
    assert.equal(guruDetail[index].lead, guru.deskripsi);
    assert.equal(guruDetail[index].image, guru.image);
    assert.equal(guruDetail[index].body.length, 3, `Tiga paragraf penjelasan ${guru.nama}`);
    for (const paragraph of guruDetail[index].body) {
      assert(paragraph.trim().length > 0, `Penjelasan kosong ${guru.nama}`);
      assert.notEqual(translate(paragraph, 'en'), paragraph, `Terjemahan penjelasan ${guru.nama}`);
    }
    assert.notEqual(translate(guru.deskripsi, 'en'), guru.deskripsi, `Terjemahan deskripsi ${guru.nama}`);
    assert.notEqual(translate(guru.mapel, 'en'), guru.mapel, `Terjemahan mapel ${guru.nama}`);
    assert.doesNotMatch(guruDetail[index].lead, /arsip|Fisika|TIK|Belum tercantum/);
  }
  for (const name of ['Arif Muttakin, S.T.', 'Krisma Dwi Brata, S.Kom.']) {
    assert(!guruData.some(g => g.nama === name), `${name} dihapus dari daftar guru`);
    assert(!guruDetail.some(g => g.title === name), `${name} dihapus dari detail guru`);
  }
  assert(guruData.some(g => g.nama === 'Arif Munandar, S.Si.'), 'Arif Munandar tetap ditampilkan');
  console.log('13 profil guru: penjelasan tiga paragraf, penghapusan kesiswaan, mapel, slug, terjemahan, dan batas crop valid.');
} finally {
  await server.close();
}
