import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { jawabanFaqCepat, tanyaAI } from '../../supabase/functions/stela/inti.mjs';

assert.equal(jawabanFaqCepat('Jurusan apa yang cocok kalau saya suka membuat game?'), null);
const greeting = await tanyaAI({ pesan: [{ role: 'user', content: 'halo' }], language: 'en' });
assert.equal(greeting.modelDipakai, 'fast-sapaan');
assert.ok(greeting.teks.startsWith('Hello!'));

const originalFetch = globalThis.fetch;
let calls = 0;
globalThis.fetch = async () => {
  calls++;
  return new Response(JSON.stringify({ choices: [{ message: { content: 'A contextual response.' } }], usage: { prompt_tokens: 1, completion_tokens: 1 } }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
try {
  const config = { penyedia: 'ninerouter', apiKey: 'sk-test', model: 'test', baseUrl: 'https://example.invalid/v1' };
  await tanyaAI({ ...config, pesan: [{ role: 'user', content: 'halo' }], instruksiKustom: 'Answer this custom request.' });
  await tanyaAI({ ...config, pesan: [{ role: 'user', content: 'Explain Python' }, { role: 'assistant', content: 'Python is a language.' }, { role: 'user', content: 'hello' }], language: 'en' });
  assert.equal(calls, 2, 'Custom instructions and follow-up messages must reach the provider.');
} finally {
  globalThis.fetch = originalFetch;
}

const confirmation = await readFile(new URL('../src/pages/ppdb/ConfirmEmailPage.jsx', import.meta.url), 'utf8');
assert.ok(confirmation.includes('onClick={confirmEmail}'));
assert.ok(confirmation.includes('disabled={confirming}'));
assert.ok(confirmation.includes("navigate(nextPath, { replace: true })"));
assert.ok(confirmation.includes("{t(confirming ? 'Mengonfirmasi...' : 'Konfirmasi Email')}"));
console.log('Merge checks passed: bilingual responses, conversation context, and manual email confirmation.');
