import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
try {
  const { LanguageContext } = await server.ssrLoadModule('/src/context/LanguageContext.js');
  const { translate } = await server.ssrLoadModule('/src/utils/language.js');
  const { PpdbProvider } = await server.ssrLoadModule('/src/context/PpdbContext.jsx');
  const { default: RegisterPage } = await server.ssrLoadModule('/src/pages/ppdb/RegisterPage.jsx');
  const { default: NextTelQuestionnaire } = await server.ssrLoadModule('/src/components/nexttel/NextTelQuestionnaire.jsx');
  const { default: NextTelResult } = await server.ssrLoadModule('/src/components/nexttel/NextTelResult.jsx');
  const { default: StelaChat } = await server.ssrLoadModule('/src/components/stela/StelaChat.jsx');
  const { ppdbJurusanPilihan } = await server.ssrLoadModule('/src/data/ppdbFormOptions.js');
  const { stelaData } = await server.ssrLoadModule('/src/data/dummyData.js');
  const value = { language: 'en', locale: 'en-US', t: (text, variables) => translate(text, 'en', variables), setLanguage: () => {} };
  const render = (element, path = '/') => renderToStaticMarkup(
    createElement(LanguageContext.Provider, { value }, createElement(MemoryRouter, { initialEntries: [path] }, element)),
  );

  // Translated option labels must keep the backend's original values.
  const registration = render(createElement(PpdbProvider, null, createElement(RegisterPage)), '/ppdb/daftar');
  assert.ok(registration.includes('Create a New Account'));
  assert.ok(registration.includes('Preferred Study Program'));
  assert.ok(registration.includes('Back to Home'));
  for (const program of ppdbJurusanPilihan) {
    assert.ok(registration.includes(`value="${program}"`), `Nilai jurusan ${program} tidak berubah.`);
    assert.ok(registration.includes(`>${value.t(program)}</option>`), `Label jurusan ${program} diterjemahkan.`);
  }

  const questions = [{ id: 'activity', prompt: 'Aktivitas yang paling kamu sukai?', options: [{ id: 'a', label: 'Membuat aplikasi' }] }];
  const questionnaire = render(createElement(NextTelQuestionnaire, { questions, currentIndex: 0, answers: { activity: 'a' }, onAnswer: () => {}, onNext: () => {}, onBack: () => {} }));
  assert.ok(questionnaire.includes('Choose one answer'));
  assert.ok(questionnaire.includes('Question 1 of 1'));
  assert.ok(questionnaire.includes('aria-checked="true"'));
  assert.ok(questionnaire.includes('View Results'));
  assert.ok(questionnaire.includes('Building applications'));

  // AI output stays in its source language even if it matches a catalog key.
  const result = render(createElement(NextTelResult, {
    result: { topRecommendation: 'RPL', ranking: [['RPL', 8]], maxScore: 8 },
    explanation: { explanation: 'Rekomendasi utama', strengths: ['Ringkasan skor'], learningSuggestions: ['Mulai ulang'] },
    loading: false, error: '', onRetry: () => {}, onRestart: () => {},
  }));
  assert.ok(result.includes('Software Engineering (RPL)'));
  assert.ok(result.includes('Score Summary'));
  assert.ok(result.includes('>Rekomendasi utama</p>'));
  assert.ok(result.includes('>Ringkasan skor</li>'));
  assert.ok(result.includes('>Mulai ulang</li>'));

  const chat = render(createElement(StelaChat));
  assert.ok(chat.includes(value.t(stelaData.sapaan)));
  assert.ok(chat.includes('placeholder="Type your question here..."'));
  assert.ok(chat.includes('aria-label="Send question"'));

  const form = await readFile(new URL('../src/pages/ppdb/RegistrationFormPage.jsx', import.meta.url), 'utf8');
  assert.ok(form.includes('value={pilihan}'), 'Nilai jenis kelamin tetap sumber, bukan hasil terjemahan.');
  assert.ok(form.includes('nilai[`${mapel.nama}|${s}`]'), 'Key nilai rapor tetap sama saat bahasa berubah.');
  assert.ok(!form.includes('key={t('), 'Pergantian bahasa tidak mengganti key input formulir.');
  console.log('Bahasa portal: label Inggris, nilai pilihan/rapor tetap, greeting lokal, serta respons AI sumber terverifikasi.');
} finally {
  await server.close();
}
