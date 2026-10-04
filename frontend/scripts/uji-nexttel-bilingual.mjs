import assert from 'node:assert/strict';
import { hitungHasilNextTel } from '../../supabase/functions/nexttel/scoring.mjs';
import { deterministicFallback } from '../../supabase/functions/nexttel/inti.mjs';
const hasilFallbackNextTel = (result, language) => deterministicFallback(result?.topRecommendation, language);

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
