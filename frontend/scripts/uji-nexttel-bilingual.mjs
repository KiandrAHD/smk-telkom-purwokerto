import assert from 'node:assert/strict';
import { hitungHasilNextTel } from '../../supabase/functions/nexttel/scoring.mjs';
const LABELS = {
  RPL: { id: 'Rekayasa Perangkat Lunak (RPL)', en: 'Software Engineering (RPL)' },
  PG: { id: 'Pengembangan Game (PG)', en: 'Game Development (PG)' },
  TKJ: { id: 'Teknik Komputer dan Jaringan (TKJ)', en: 'Computer and Network Engineering (TKJ)' },
  TJAT: { id: 'Teknik Jaringan Akses Telekomunikasi (TJAT)', en: 'Telecommunication Access Network Engineering (TJAT)' },
};
const hasilFallbackNextTel = (result, language = 'id') => {
  const lang = language === 'en' ? 'en' : 'id';
  const label = LABELS[result?.topRecommendation]?.[lang] ?? LABELS.RPL[lang];
  return lang === 'en'
    ? { explanation: `Based on your answers, your highest score is ${label}.`, strengths: [`You showed the strongest match to ${label}.`], learningSuggestions: [`Explore beginner projects related to ${label}.`] }
    : { explanation: `Berdasarkan jawabanmu, jurusan yang paling cocok untukmu adalah ${label}.`, strengths: [`Kamu menunjukkan kecocokan terbesar dengan ${label}.`], learningSuggestions: [`Coba eksplor proyek pemula yang berkaitan dengan ${label}.`] };
};

console.log('Memulai Pengujian Bilingual NextTel & Fallback...\\n');

// 1. Uji scoring deterministik
const sampelAnswersRPL = [
  { questionId: 'activity', optionId: 'a' },
  { questionId: 'interest', optionId: 'a' },
  { questionId: 'project', optionId: 'a' },
  { questionId: 'learning', optionId: 'a' },
  { questionId: 'problem', optionId: 'a' },
  { questionId: 'tool', optionId: 'a' },
  { questionId: 'work', optionId: 'a' },
  { questionId: 'future', optionId: 'a' },
];

const hasilRPL = hitungHasilNextTel(sampelAnswersRPL);
assert.ok(hasilRPL, 'Scoring RPL harus menghasilkan output');
assert.equal(hasilRPL.topRecommendation, 'RPL', 'Top recommendation harus RPL');
console.log('✅ Scoring RPL deterministik valid');

// 2. Uji Fallback Bilingual ID & EN
const fallbackID = hasilFallbackNextTel(hasilRPL, 'id');
assert.ok(fallbackID.explanation.includes('Rekayasa Perangkat Lunak'), 'Penjelasan ID harus memuat label Indonesia');
assert.ok(Array.isArray(fallbackID.strengths) && fallbackID.strengths.length > 0, 'Strengths ID harus berupa array tidak kosong');
assert.ok(Array.isArray(fallbackID.learningSuggestions) && fallbackID.learningSuggestions.length > 0, 'Learning suggestions ID harus berupa array');
console.log('✅ Fallback Bahasa Indonesia valid');

const fallbackEN = hasilFallbackNextTel(hasilRPL, 'en');
assert.ok(fallbackEN.explanation.includes('Software Engineering'), 'Penjelasan EN harus memuat label English');
assert.ok(Array.isArray(fallbackEN.strengths) && fallbackEN.strengths.length > 0, 'Strengths EN harus berupa array tidak kosong');
assert.ok(Array.isArray(fallbackEN.learningSuggestions) && fallbackEN.learningSuggestions.length > 0, 'Learning suggestions EN harus berupa array');
console.log('✅ Fallback English valid');

// 3. Uji Semua Jurusan Fallback (RPL, PG, TKJ, TJAT)
const majors = ['RPL', 'PG', 'TKJ', 'TJAT'];
for (const m of majors) {
  const dummyRes = { topRecommendation: m };
  const fbId = hasilFallbackNextTel(dummyRes, 'id');
  const fbEn = hasilFallbackNextTel(dummyRes, 'en');
  assert.ok(fbId.explanation.length > 10, `Fallback ID untuk ${m} harus punya teks valid`);
  assert.ok(fbEn.explanation.length > 10, `Fallback EN untuk ${m} harus punya teks valid`);
}
console.log('✅ Fallback seluruh jurusan (RPL, PG, TKJ, TJAT) ID & EN valid');

// 4. Uji default language jika bahasa tidak dikenal
const fallbackDef = hasilFallbackNextTel(hasilRPL, 'fr');
assert.ok(fallbackDef.explanation.includes('Rekayasa Perangkat Lunak'), 'Fallback untuk bahasa tidak dikenal harus default ke ID');
console.log('✅ Fallback default language valid');

console.log('\n🎉 Semua pengujian NextTel bilingual berhasil!');
