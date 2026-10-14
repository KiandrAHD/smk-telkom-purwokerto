import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { NEXTTEL_QUESTIONS as questions } from '../src/data/nexttelQuestions.js';
import { hitungHasilNextTel } from '../../supabase/functions/nexttel/scoring.mjs';

// Snapshot of the requested copy: an accidental wording change must fail.
const copy = [
  "Aktivitas apa yang paling kamu sukai?",
  "Mencoba hal baru",
  "Membuat sesuatu yang menarik",
  "Memecahkan masalah",
  "Mengatur suatu kegiatan",
  "Hal apa yang paling menarik perhatianmu?",
  "Teknologi dan perkembangannya",
  "Seni dan kreativitas",
  "Cara kerja suatu benda",
  "Ide dan peluang baru",
  "Saat menghadapi kesulitan, apa yang kamu lakukan?",
  "Mencoba cara lain",
  "Mencari ide baru",
  "Mencari penyebabnya",
  "Meminta pendapat orang lain",
  "Kegiatan apa yang paling ingin kamu coba?",
  "Membuat karya yang bermanfaat",
  "Menghasilkan karya kreatif",
  "Mencoba alat atau hal baru",
  "Merencanakan sebuah kegiatan",
  "Bagaimana cara belajar yang paling kamu sukai?",
  "Langsung mencoba sendiri",
  "Melihat contoh dan berkreasi",
  "Memahami cara kerjanya",
  "Berdiskusi bersama teman",
  "Apa yang membuatmu semangat mempelajari sesuatu?",
  "Bisa menghasilkan sesuatu",
  "Bisa menyalurkan kreativitas",
  "Bisa memahami hal baru",
  "Bisa mencapai target",
  "Dalam sebuah kelompok, kamu biasanya lebih suka?",
  "Mengerjakan bagian utama",
  "Memberikan ide kreatif",
  "Mencari solusi saat ada masalah",
  "Mengatur tugas kelompok",
  "Hal apa yang ingin kamu kembangkan untuk masa depan?",
  "Kemampuan membuat sesuatu",
  "Kreativitas dan ide",
  "Kemampuan memahami teknologi",
  "Kemampuan mengelola dan berkomunikasi"
];
assert.deepEqual(questions.flatMap(question => [question.prompt, ...question.options.map(option => option.label)]), copy);
assert.deepEqual(questions.map(question => question.id), ['activity', 'interest', 'project', 'learning', 'problem', 'tool', 'work', 'future']);
for (const question of questions) assert.deepEqual(question.options.map(option => option.id), ['a', 'b', 'c', 'd']);
assert.ok(hitungHasilNextTel(questions.map(question => ({ questionId: question.id, optionId: 'a' }))));
assert.equal(hitungHasilNextTel(questions.slice(1).map(question => ({ questionId: question.id, optionId: 'a' }))), null);

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { default: Questionnaire } = await server.ssrLoadModule('/src/components/nexttel/NextTelQuestionnaire.jsx');
  const render = (index, answers) => renderToStaticMarkup(createElement(LanguageContext.Provider, { value: { language: 'id', t: value => value } },
    createElement(Questionnaire, { questions, currentIndex: index, answers, onAnswer() {}, onNext() {}, onBack() {} })));
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const unanswered = render(i, {});
    assert.equal((unanswered.match(/type="radio"/g) || []).length, 4);
    assert.ok(unanswered.includes(question.prompt));
    assert.ok(unanswered.includes('aria-labelledby="nexttel-question"'));
    const selected = render(i, { [question.id]: 'b' });
    assert.equal((selected.match(/aria-checked="true"/g) || []).length, 1);
    assert.ok(selected.includes(i === 7 ? '>Selesai' : '>Lanjut'));
    const buttons = unanswered.match(/<button[^>]*>/g);
    assert.ok(buttons[1].includes('disabled=""'));
    assert.ok(!selected.match(/<button[^>]*>/g)[1].includes('disabled=""'));
  }
  console.log('NextTel questionnaire: exact 40 copy entries, stable IDs, eight radio groups, single selection and guarded navigation pass.');
} finally {
  await server.close();
}
