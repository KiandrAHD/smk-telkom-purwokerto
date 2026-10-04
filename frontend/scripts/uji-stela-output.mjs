import assert from 'node:assert/strict';
import { BATAS, keluaranAman, periksaPesan, tanyaAI } from '../../supabase/functions/stela/inti.mjs';
import { buatPenjaga } from '../../supabase/functions/stela/penjaga-biaya.mjs';
import { geminiReply, loadEdgeHandler, request } from './helpers/edge-handler.mjs';

const originalFetch = globalThis.fetch;
const conversation = [{ role: 'user', content: 'Jelaskan cara belajar jaringan komputer secara rinci.' }];
let response = 'Belajar jaringan dimulai dengan memahami perangkat dan koneksinya.';
let calls = 0;
globalThis.fetch = async (url) => {
  if (String(url) === 'https://quota.test.invalid/rest/v1/rpc/reserve_ai_attempt') return Response.json(true);
  assert.ok(String(url).startsWith('https://generativelanguage.googleapis.com/'), 'Unmocked network request');
  calls++;
  return geminiReply(response);
};
try {
  const cache = buatPenjaga();
  cache.simpanCache(conversation, 'password = SYNTHETIC_FORBIDDEN_VALUE');
  assert.equal(cache.ambilCache(conversation), null, 'Unsafe output must not enter the shared chat cache');
  for (const value of [response, 'x'.repeat(BATAS.MAKS_PANJANG_ASISTEN + 1), 'password = SYNTHETIC_FORBIDDEN_VALUE', '<data-private>hidden</data-private>']) {
    response = value;
    const result = await tanyaAI({ penyedia: 'gemini', apiKey: 'offline-fixture', pesan: conversation, bahasa: 'id' });
    assert.ok(keluaranAman(result.teks), 'Provider output must satisfy the runtime output guard');
    if (keluaranAman(value)) assert.equal(result.teks, value, 'Acceptable answer should remain unchanged');
    else assert.notEqual(result.teks, value, 'Forbidden or oversized output must not be returned');
    const next = periksaPesan([...conversation, { role: 'assistant', content: result.teks }, { role: 'user', content: 'Berikan contoh berikutnya.' }]);
    assert.ok(next.pesan, 'The returned answer must permit a valid next turn');
  }
  const handler = await loadEdgeHandler('stela', { GEMINI_API_KEY: 'offline-fixture', STELA_ALLOWED_ORIGINS: 'https://test.invalid', SUPABASE_URL: 'https://quota.test.invalid', SUPABASE_SERVICE_ROLE_KEY: 'server-fixture' });
  response = 'x'.repeat(BATAS.MAKS_PANJANG_ASISTEN + 1);
  const first = await handler(request('stela', { messages: conversation, language: 'id' }));
  assert.equal(first.status, 200);
  const answer = (await first.json()).reply;
  assert.ok(keluaranAman(answer), 'Handler must guard before response/cache');
  const beforeCached = calls;
  const cached = await handler(request('stela', { messages: conversation, language: 'id' }));
  assert.equal((await cached.json()).reply, answer);
  assert.equal(calls, beforeCached, 'Safe cached response should avoid provider calls');
  const continued = await handler(request('stela', { messages: [...conversation, { role: 'assistant', content: answer }, { role: 'user', content: 'Lanjutkan pembahasan.' }], language: 'id' }));
  assert.equal(continued.status, 200, 'Handler must accept its own previous answer');
  response = 'password = SYNTHETIC_FORBIDDEN_VALUE';
  const english = await tanyaAI({ penyedia: 'gemini', apiKey: 'offline-fixture', pesan: conversation, bahasa: 'en' });
  assert.ok(keluaranAman(english.teks));
  assert.ok(/please|sorry/i.test(english.teks), 'Fallback should respect English selection');
  console.log('STELA output: normal, oversized, forbidden, cache and continuation pass; no live requests.');
} finally { globalThis.fetch = originalFetch; }
