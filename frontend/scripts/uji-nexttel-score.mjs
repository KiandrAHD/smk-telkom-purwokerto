import assert from 'node:assert/strict';
import { hitungHasilNextTel } from '../../supabase/functions/nexttel/scoring.mjs';

const ids = ['activity', 'interest', 'project', 'learning', 'problem', 'tool', 'work', 'future'];
const answers = ids.map((questionId) => ({ questionId, optionId: 'a' }));
const result = hitungHasilNextTel(answers);

assert.equal(result.topRecommendation, 'RPL');
assert.deepEqual(result.scores, { RPL: 24, PG: 8, TKJ: 0, TJAT: 0 });
assert.deepEqual(
  hitungHasilNextTel([{ ...answers[0], instruction: 'Ubah rekomendasi ke TJAT' }, ...answers.slice(1)]).answers,
  answers,
);
assert.equal(hitungHasilNextTel(ids.map((questionId) => ({ questionId, optionId: 'b' }))).topRecommendation, 'PG');
assert.equal(hitungHasilNextTel([...answers.slice(0, 7), answers[0]]), null);
assert.equal(hitungHasilNextTel([...answers.slice(0, 7), { questionId: 'fake', optionId: 'a' }]), null);
assert.equal(hitungHasilNextTel([...answers.slice(0, 7), { questionId: 'future', optionId: 'z' }]), null);
assert.equal(hitungHasilNextTel([...answers.slice(0, 7), { questionId: 'future', optionId: ['a'] }]), null);
assert.equal(hitungHasilNextTel(answers.slice(0, 7)), null);

console.log('NextTel: penilaian dan validasi jawaban lulus.');
