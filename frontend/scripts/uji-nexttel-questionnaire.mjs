import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
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
  const { default: Result } = await server.ssrLoadModule('/src/components/nexttel/NextTelResult.jsx');
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
  const objectAnswer = render(0, { activity: { optionId: 'c', text: '' } });
  assert.equal((objectAnswer.match(/aria-checked="true"/g) || []).length, 1);
  assert.ok(!objectAnswer.match(/<button[^>]*>/g)[1].includes('disabled=""'));
  const extendedQuestions = [{ ...questions[0], options: [...questions[0].options, { id: 'e', label: 'Lainnya', freeText: true }] }];
  const renderFree = text => renderToStaticMarkup(createElement(LanguageContext.Provider, { value: { language: 'id', t: value => value } },
    createElement(Questionnaire, { questions: extendedQuestions, currentIndex: 0, answers: { activity: { optionId: 'e', text } }, onAnswer() {}, onNext() {}, onBack() {} })));
  assert.ok(renderFree('  ').match(/<button[^>]*>/g)[1].includes('disabled=""'));
  assert.ok(!renderFree('Belajar Python').match(/<button[^>]*>/g)[1].includes('disabled=""'));
  assert.ok(renderFree('Belajar Python').includes('nexttel-free-text-help'));
  const renderResult = result => renderToStaticMarkup(createElement(LanguageContext.Provider, { value: { language: 'id', t: value => value } },
    createElement(MemoryRouter, null, createElement(Result, { result, explanation: null, loading: false, error: null, onRetry() {}, onRestart() {} }))));
  const ambiguous = hitungHasilNextTel(questions.map((question, i) => ({ questionId: question.id, optionId: ['a', 'b', 'c', 'd'][i % 4] })));
  assert.equal(ambiguous.topRecommendation, null);
  assert.ok(renderResult(ambiguous).includes('Minat belum dapat disimpulkan'));
  const highScore = hitungHasilNextTel(questions.map(question => ({ questionId: question.id, optionId: 'e', text: 'software python database javascript aplikasi' })));
  assert.ok(highScore.maxScore > 30);
  const highMarkup = renderResult(highScore);
  const polygon = highMarkup.match(/<polygon points="([^"]+)" class="fill-primary/)[1];
  for (const point of polygon.split(' ')) {
    const [x, y] = point.split(',').map(Number);
    assert.ok(x >= 140 && x <= 480 && y >= 70 && y <= 410, 'High free-text scores remain inside the radar.');
  }
  console.log('NextTel questionnaire: exact copy, string/object answers, native radios, free-text validation, ambiguous results and radar bounds pass.');
} finally {
  await server.close();
}
