import assert from 'node:assert/strict';
import {
  ANGGARAN_KONTEKS,
  MODEL_BAWAAN,
  MODEL_CADANGAN,
  buatAlamatPenyedia,
  pilihPenyedia,
} from '../../supabase/functions/stela/inti.mjs';

assert.equal(pilihPenyedia({ ninerouterKey: 'sk-test' }), 'ninerouter');
assert.equal(pilihPenyedia({ ninerouterKey: 'token-lain' }), null);
assert.equal(buatAlamatPenyedia('ninerouter', 'https://router.example/'), 'https://router.example/v1/chat/completions');
assert.equal(buatAlamatPenyedia('ninerouter'), 'https://9router.com/v1/chat/completions');
assert.equal(ANGGARAN_KONTEKS.ninerouter, 0);
assert.equal(MODEL_BAWAAN.ninerouter, 'cc/claude-haiku-4-20250514');
assert.deepEqual(MODEL_CADANGAN.ninerouter, [
  'cc/claude-haiku-4-20250514',
  'cc/claude-sonnet-4-20250514',
]);

console.log('uji-ninerouter: semua cek lulus');
