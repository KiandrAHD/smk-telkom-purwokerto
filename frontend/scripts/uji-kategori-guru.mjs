import assert from 'node:assert/strict';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';
import path from 'node:path';
import sharp from 'sharp';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const data = await server.ssrLoadModule('/src/data/profilGuruData.js');
  const { pengawakanGuruData } = await server.ssrLoadModule('/src/data/pengawakanGuruData.js');
  assert.ok(Array.isArray(data.kesiswaanData), 'Kategori Kesiswaan harus tersedia.');
  assert.ok(Array.isArray(data.tenagaPendidikData));
  assert.equal(data.kesiswaanData.length, 15);
  assert.equal(data.tenagaPendidikData.length, 33);
  const all = [...data.kesiswaanData, ...data.tenagaPendidikData];
  assert.equal(all.length, data.profilGuruData.length);
  assert.equal(new Set(all.map(guru => guru.nama)).size, all.length);
  for (const guru of all) {
    const name = guru.nama.split(',')[0];
    assert.notEqual(name, name.toUpperCase(), guru.nama);
    assert(guru.image && guru.jabatanOrganisasi, guru.nama);
    const detail = data.profilGuruDetail.find(item => item.title === guru.nama);
    assert(detail, guru.nama);
    assert.equal(detail.image, guru.image, guru.nama);
    assert.equal(detail.subtitle, guru.jabatanOrganisasi);
    assert.equal(detail.kategori, guru.kategori === 'kesiswaan' ? 'Bidang Kesiswaan & Karakter' : 'Profil Guru & Tenaga Pendidik');
  }
  for (const name of ['Dewi Arimbi Suprobowati, S.Pd.', 'Bekti Abriyanti Dwi Laksani, S.Psi.', 'Irfan Nur Aziz, S.Psi.']) {
    assert(data.kesiswaanData.some(guru => guru.nama === name), name);
  }
  assert(!all.some(guru => guru.nama.startsWith('Sagita Mondesya')), 'Jabatan belum dikonfirmasi tidak dipublikasikan.');
  const sourcePhotos = pengawakanGuruData.filter(guru => guru.image);
  assert.equal(sourcePhotos.length, 27);
  for (const assignment of pengawakanGuruData) {
    const guru = all.find(guru => guru.nama === assignment.nama);
    assert.equal(guru.jabatanOrganisasi, assignment.jabatanOrganisasi);
    assert.equal(guru.kategori, assignment.kategori);
    assert(data.profilGuruTranslations[guru.jabatanOrganisasi], guru.nama);
    assert([2, 3].includes(guru.sourcePage), guru.nama);
  }
  for (const guru of sourcePhotos) {
    const { crop, width, height } = guru.sourcePhoto;
    assert(crop.left >= 0 && crop.top >= 0 && crop.left + crop.width <= width && crop.top + crop.height <= height);
    assert.equal(crop.width / crop.height, 4 / 5);
    for (const [url, expectedWidth] of [[guru.image, 480], [guru.thumbnail, 240]]) {
      const file = path.resolve(import.meta.dirname, '..', url.split('?')[0].replace(/^\//, ''));
      const metadata = await sharp(file).metadata();
      assert.equal(metadata.format, 'webp'); assert.equal(metadata.width, expectedWidth);
      assert.equal(metadata.width / metadata.height, 4 / 5);
    }
  }
  assert.equal(all.find(guru => guru.nama.startsWith('Anna Durrotul')).sourcePhotoLabel, 'Ana Durrotul Isma');
  assert.equal(all.find(guru => guru.nama.startsWith('Anggita Laras')).sourcePhotoLabel, 'Gita Laras Pratama');
  assert(all.some(guru => guru.nama === 'Fendi Riawan, S.Kom.'));
  const { default: GuruPage } = await server.ssrLoadModule('/src/pages/GuruPage.jsx');
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  for (const language of ['id', 'en']) {
    const html = renderToStaticMarkup(h(MemoryRouter, null, h(LanguageContext.Provider, {
      value: { language, t: (text, vars) => translate(text, language, vars) },
    }, h(GuruPage))));
    assert.equal((html.match(/data-teacher-card=/g) || []).length, 16);
    for (const id of ['kesiswaan-list-title', 'guru-list-title', 'kesiswaan-grid', 'guru-grid']) assert(html.includes(`id="${id}"`), id);
    assert.equal((html.match(/data-teacher-pagination/g) || []).length, 2);
    assert.equal((html.match(/data-teacher-pill/g) || []).length, 2);
    assert(html.includes(translate('Bidang Kesiswaan & Karakter', language).replaceAll('&', '&amp;')));
  }
  console.log('PASS 15 Kesiswaan + 33 Guru/Tenaga Pendidik; unique profiles, roles, photos, detail, two accessible ID/EN sections.');
} finally { await server.close(); }
