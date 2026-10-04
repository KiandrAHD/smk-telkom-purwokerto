import assert from 'node:assert/strict';
import { loadEdgeHandler, request, geminiReply } from './helpers/edge-handler.mjs';

const answers = ['activity', 'interest', 'project', 'learning', 'problem', 'tool', 'work', 'future'].map(questionId => ({ questionId, optionId: 'a' }));
const valid = { explanation: 'Rekomendasi sesuai hasil sistem.', strengths: ['Logika pemrograman'], learningSuggestions: ['Coba proyek sederhana.'] };
const env = {
  NEXTTEL_GEMINI_API_KEY: 'AIza' + 'x'.repeat(35), NEXTTEL_GROQ_API_KEY: 'gsk_' + 'x'.repeat(52),
  NEXTTEL_ALLOWED_ORIGINS: 'https://test.invalid',
  SUPABASE_URL: 'https://quota.test.invalid', SUPABASE_SERVICE_ROLE_KEY: 'server-fixture',
};
const originalFetch = globalThis.fetch;
let scenario = 'valid';
let calls = [];
globalThis.fetch = async (url) => {
  if (String(url) === 'https://quota.test.invalid/rest/v1/rpc/reserve_ai_attempt') return Response.json(true);
  const u = String(url); calls.push(u);
  assert.ok(u.startsWith('https://generativelanguage.googleapis.com/') || u.startsWith('https://api.groq.com/'), 'Unmocked network request');
  if (scenario === 'http') return new Response('Unavailable', { status: 503 });
  const output = scenario === 'malformed' || (scenario === 'second' && u.includes('googleapis')) ? 'broken JSON' : scenario === 'missing' ? JSON.stringify({ explanation: 'Missing required arrays' }) : JSON.stringify(valid);
  return u.includes('googleapis') ? geminiReply(output) : Response.json({ choices: [{ message: { content: output } }] });
};
try {
  const handler = await loadEdgeHandler('nexttel', env);
  for (const mode of ['valid', 'malformed', 'missing', 'http', 'second']) {
    scenario = mode; calls = [];
    const response = await handler(request('nexttel', { answers, language: 'id' }));
    assert.equal(response.status, 200, `${mode}: provider failure must not become a client error`);
    const body = await response.json();
    if (mode === 'valid' || mode === 'second') assert.deepEqual(body, valid);
    else assert.ok(body.explanation.includes('Rekayasa Perangkat Lunak'), `${mode}: deterministic fallback must retain the scored major`);
    if (mode === 'second') assert.ok(calls.some(url => url.includes('groq')), 'Malformed first provider must allow the next configured provider');
  }
  const before = calls.length;
  const invalid = await handler(request('nexttel', { answers: [], language: 'id' }));
  assert.equal(invalid.status, 400);
  assert.equal(calls.length, before, 'Invalid user answers must never call a provider');
  const brokenRequest = await handler(new Request('https://test.invalid/nexttel', { method: 'POST', headers: { origin: 'https://test.invalid' }, body: '{broken' }));
  assert.equal(brokenRequest.status, 400);
  console.log('NextTel handler: valid output, malformed/missing/HTTP fallback, next provider, invalid user input pass.');
} finally { globalThis.fetch = originalFetch; }
