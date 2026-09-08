import assert from 'node:assert/strict';
import {
  ANGGARAN_KONTEKS,
  MODEL_BAWAAN,
  MODEL_CADANGAN,
  buatAlamatPenyedia,
  pilihPenyedia,
  tanyaAI,
} from '../../supabase/functions/stela/inti.mjs';

assert.equal(pilihPenyedia({ ninerouterKey: 'sk-test' }), 'ninerouter');
assert.equal(pilihPenyedia({ ninerouterKey: 'token-lain' }), null);
assert.equal(buatAlamatPenyedia('ninerouter', 'https://router.example/'), 'https://router.example/v1/chat/completions');
assert.equal(buatAlamatPenyedia('ninerouter', 'https://router.example/v1/'), 'https://router.example/v1/chat/completions');
assert.throws(() => buatAlamatPenyedia('ninerouter', ''), /NINEROUTER_URL/);
assert.equal(ANGGARAN_KONTEKS.ninerouter, 0);
assert.equal(MODEL_BAWAAN.ninerouter, 'kr/claude-haiku-4.5');
assert.deepEqual(MODEL_CADANGAN.ninerouter, [
  'kr/claude-haiku-4.5',
  'kr/claude-sonnet-4.5',
]);

const fetchAsli = globalThis.fetch;
try {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'http://127.0.0.1:20128/v1/chat/completions');
    assert.equal(options.headers.Authorization, 'Bearer sk-test');
    assert.equal(JSON.parse(options.body).stream, false);
    return Response.json({ choices: [{ message: { content: 'SIAP' } }], usage: { prompt_tokens: 10, completion_tokens: 2 } });
  };
  const hasil = await tanyaAI({
    penyedia: 'ninerouter', apiKey: 'sk-test', model: 'test-model',
    baseUrl: 'http://127.0.0.1:20128/v1',
    pesan: [{ role: 'user', content: 'Tes' }], instruksiKustom: 'Jawab singkat.',
  });
  assert.equal(hasil.teks, 'SIAP');
  assert.equal(hasil.tokenKeluar, 2);
} finally {
  globalThis.fetch = fetchAsli;
}

console.log('uji-ninerouter: semua cek lulus');
