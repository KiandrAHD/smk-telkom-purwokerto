import assert from 'node:assert/strict';
import test from 'node:test';
import { tanyaAI } from '../../supabase/functions/stela/inti.mjs';
import { buatPenjaga } from '../../supabase/functions/stela/penjaga-biaya.mjs';
import { jelaskanHasilNextTel } from '../../supabase/functions/nexttel/inti.mjs';
import { buatReservasiKuota } from '../../supabase/functions/ai-quota.mjs';
import { geminiReply, loadEdgeHandler, request } from './helpers/edge-handler.mjs';

const provider = { penyedia: 'gemini', apiKey: 'offline-fixture' };
const pesan = [{ role: 'user', content: 'Jelaskan latihan jaringan komputer dengan rinci.' }];
const realFetch = globalThis.fetch;

await test('one request has a bounded number of provider attempts', async () => {
  let attempts = 0;
  globalThis.fetch = async () => { attempts++; return new Response('Unavailable', { status: 503 }); };
  try {
    await assert.rejects(() => tanyaAI({ ...provider, pesan }));
    assert.equal(attempts, 3, 'Failover must stop after three attempts');
  } finally { globalThis.fetch = realFetch; }
});

await test('a denied reservation never calls a provider', async () => {
  let attempts = 0;
  globalThis.fetch = async () => { attempts++; return geminiReply('Jawaban aman.'); };
  try {
    await assert.rejects(() => tanyaAI({ ...provider, pesan, sebelumPanggilan: async () => { throw Object.assign(new Error('Quota exhausted'), { status: 429 }); } }), error => error.status === 429);
    assert.equal(attempts, 0);
  } finally { globalThis.fetch = realFetch; }
});

await test('the total deadline aborts the provider', async () => {
  let aborted = false;
  globalThis.fetch = async (_url, { signal }) => new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve(geminiReply('Jawaban aman.')), 100);
    signal.addEventListener('abort', () => { aborted = true; clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); }, { once: true });
  });
  try {
    await assert.rejects(() => tanyaAI({ ...provider, pesan, timeoutMs: 10 }), error => error.status === 504);
    assert.ok(aborted);
  } finally { globalThis.fetch = realFetch; }
});

await test('local concurrent reservations cannot use the same final unit', async () => {
  const guard = buatPenjaga({ maksPerHari: 1 });
  const results = await Promise.allSettled([Promise.resolve().then(() => guard.catatPanggilan()), Promise.resolve().then(() => guard.catatPanggilan())]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  assert.equal(guard.statistik().terpakaiHariIni, 1);
});

await test('two Edge instances use the same shared quota reservation', async () => {
  let reserved = 0, attempts = 0;
  globalThis.fetch = async (url, options) => {
    const u = String(url);
    if (u === 'https://quota.test.invalid/rest/v1/rpc/reserve_ai_attempt') {
      const body = JSON.parse(options.body);
      assert.equal(body.p_limit, 1);
      const allowed = reserved < 1;
      if (allowed) reserved++;
      return Response.json(allowed);
    }
    if (u.startsWith('https://quota.test.invalid/rest/v1/')) return Response.json([]);
    assert.ok(u.startsWith('https://generativelanguage.googleapis.com/'), 'Unmocked network request');
    attempts++; return geminiReply('Jawaban latihan jaringan yang aman.');
  };
  try {
    const env = { GEMINI_API_KEY: 'offline-fixture', STELA_ALLOWED_ORIGINS: 'https://test.invalid', STELA_MAKS_PER_HARI: '1', SUPABASE_URL: 'https://quota.test.invalid', SUPABASE_ANON_KEY: 'public-fixture', SUPABASE_SERVICE_ROLE_KEY: 'server-fixture' };
    const first = await loadEdgeHandler('stela', env), second = await loadEdgeHandler('stela', env);
    const responses = await Promise.all([first(request('stela', { messages: pesan })), second(request('stela', { messages: [{ role: 'user', content: 'Jelaskan praktik konfigurasi jaringan lainnya.' }] }))]);
    assert.deepEqual(responses.map(r => r.status).sort(), [200, 429]);
    assert.equal(attempts, 1);
    assert.equal(reserved, 1);
  } finally { globalThis.fetch = realFetch; }
});

await test('NextTel shares the attempt ceiling across all configured providers', async () => {
  let attempts = 0, reservations = 0;
  globalThis.fetch = async () => { attempts++; return new Response('Unavailable', { status: 503 }); };
  try {
    const output = await jelaskanHasilNextTel({ hasil: { topRecommendation: 'RPL' }, daftarPenyedia: [provider, { penyedia: 'groq', apiKey: 'offline-fixture' }, { penyedia: 'anthropic', apiKey: 'offline-fixture' }, provider], sebelumPanggilan: async () => { reservations++; } });
    assert.ok(output.explanation.includes('Rekayasa Perangkat Lunak'));
    assert.equal(attempts, 3);
    assert.equal(reservations, 3, 'Each attempt must reserve independently');
  } finally { globalThis.fetch = realFetch; }
});

await test('shared quota fails closed for missing config, failed HTTP and malformed RPC', async () => {
  let attempts = 0;
  for (const result of [undefined, new Response('Unavailable', { status: 503 }), Response.json({ allowed: true })]) {
    globalThis.fetch = async (url) => {
      if (String(url).startsWith('https://quota.test.invalid/')) return result;
      attempts++; return geminiReply('Jawaban aman.');
    };
    const reserve = buatReservasiKuota({ url: result ? 'https://quota.test.invalid' : undefined, serviceKey: 'server-fixture', fitur: 'stela' });
    try {
      await assert.rejects(() => tanyaAI({ ...provider, pesan, sebelumPanggilan: reserve }), error => error.status === 503);
      assert.equal(attempts, 0);
    } finally { globalThis.fetch = realFetch; }
  }
});

await test('provider failover retains one total deadline rather than resetting it', async () => {
  let attempts = 0;
  const realNow = Date.now;
  let now = realNow();
  Date.now = () => now;
  globalThis.fetch = async (_url, { signal }) => {
    attempts++;
    if (attempts === 1) { now += 150; return new Response('Unavailable', { status: 503 }); }
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => resolve(geminiReply('Jawaban aman.')), 100);
      signal.addEventListener('abort', () => { clearTimeout(timer); reject(new DOMException('Aborted', 'AbortError')); }, { once: true });
    });
  };
  try {
    await assert.rejects(() => tanyaAI({ daftarPenyedia: [provider, { penyedia: 'groq', apiKey: 'offline-fixture' }], pesan, timeoutMs: 200, cobaModelCadangan: false }), error => error.status === 504);
    assert.equal(attempts, 2);
  } finally { globalThis.fetch = realFetch; Date.now = realNow; }
});

await test('an aborted request cannot reserve or call a provider', async () => {
  let reservations = 0, attempts = 0;
  globalThis.fetch = async () => { attempts++; return geminiReply('Jawaban aman.'); };
  try {
    await assert.rejects(() => tanyaAI({ ...provider, pesan, signal: AbortSignal.abort(), sebelumPanggilan: async () => { reservations++; } }), error => error.name === 'AbortError');
    assert.equal(reservations, 0); assert.equal(attempts, 0);
  } finally { globalThis.fetch = realFetch; }
});
