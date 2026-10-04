import assert from 'node:assert/strict';
import * as validation from '../src/utils/ppdbSubmission.js';
import { ppdbMataPelajaran, ppdbSemester } from '../src/data/ppdbFormOptions.js';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

assert.equal(typeof validation.validatePpdbForm, 'function', 'UI and submission must share field validation');
const biodata = { namaLengkap: 'Siswa Uji', nisn: '1234567890', whatsapp: '081234567890', jurusan: 'Rekayasa Perangkat Lunak (RPL)', nik: '1234567890123456', agama: 'Islam', tempatLahir: 'Purwokerto', tanggalLahir: '2010-01-01', jenisKelamin: 'Laki-laki', alamat: 'Alamat Uji', namaSmp: 'SMP Uji', tahunLulus: '2027' };
const nilai = Object.fromEntries(ppdbMataPelajaran.flatMap(({ nama }) => ppdbSemester.map((s) => [`${nama}|${s}`, '85.5'])));
assert.deepEqual(validation.validatePpdbForm(biodata, nilai), []);
assert.equal(validation.validatePpdbForm({ ...biodata, namaSmp: '' }, nilai)[0].field, 'namaSmp');
assert.equal(validation.validatePpdbForm({ ...biodata, nisn: '123' }, nilai)[0].field, 'nisn');
const key = 'Ilmu Pengetahuan Alam|Semester 1';
assert.deepEqual(validation.validatePpdbForm(biodata, { ...nilai, [key]: 0 }), [], 'Zero is a valid grade');
for (const bad of ['', null, Infinity, '85abc', -1, 101]) {
  assert.equal(validation.validatePpdbForm(biodata, { ...nilai, [key]: bad })[0].field, key);
}
assert.equal(validation.preparePpdbSubmission(biodata, nilai).asal_sekolah, 'SMP Uji');
assert.equal(Object.keys(validation.preparePpdbSubmission(biodata, nilai).nilai_rapor).length, 25);
console.log('SPMB QOL: school identity, canonical 25 grades, field errors, and numeric boundaries pass.');

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const { default: Review } = await server.ssrLoadModule('/src/components/ppdb/RegistrationReview.jsx');
  const { default: PasswordInput } = await server.ssrLoadModule('/src/components/ppdb/PasswordInput.jsx');
  const { dokumenPeserta } = await server.ssrLoadModule('/src/data/dummyData.js');
  assert.deepEqual(dokumenPeserta.tahapan, [], 'Unavailable official dates must never show old active dates');
  for (const language of ['id', 'en']) {
    const t = (text, variables) => translate(text, language, variables);
    const wrap = (element) => renderToStaticMarkup(createElement(LanguageContext.Provider, { value: { language, t } }, createElement(MemoryRouter, null, element)));
    const html = wrap(createElement(Review, { biodata, nilai, berkas: { name: 'qa.pdf', size: 1024 } }));
    assert.ok(html.includes(t('Periksa Pendaftaran')));
    assert.ok(html.includes('SMP Uji'));
    assert.ok(html.includes('/spmb/formulir'));
    assert.equal((html.match(/<td /g) || []).length, 25, 'Review displays all canonical grades');
    assert.ok(html.includes(t('Alamat Lengkap')));
    assert.ok(wrap(createElement(PasswordInput, { label: t('Kata Sandi') })).includes(t('Tampilkan sandi: {label}', { label: t('Kata Sandi') })));
    assert.notEqual(t('Jadwal resmi 2027/2028 belum tersedia'), '02 Juli 2026');
  }
  console.log('SPMB QOL: bilingual review, original values, password labels, 25-grade summary, unavailable schedule pass.');
} finally { await server.close(); }
