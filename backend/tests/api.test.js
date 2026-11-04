import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { app } from '../src/app.js';
import { prisma, closeDatabase } from '../src/db.js';

let server;
let baseUrl;
const cookieJar = new Map();

function getCookie(name) {
  return cookieJar.get(name);
}

async function request(path, options = {}) {
  const headers = { 'content-type': 'application/json', ...(options.headers || {}) };
  const csrf = getCookie('csrf_token');
  if (csrf && options.method && options.method !== 'GET') headers['x-csrf-token'] = csrf;
  const cookies = [...cookieJar.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
  if (cookies) headers.cookie = cookies;
  const res = await fetch(baseUrl + path, { ...options, headers });
  for (const raw of res.headers.getSetCookie?.() ?? []) {
    const [pair] = raw.split(';');
    const [k, v] = pair.split('=');
    if (v === '' || /Max-Age=0/i.test(raw)) cookieJar.delete(k);
    else cookieJar.set(k, v);
  }
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : null };
}

before(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  await prisma.user.deleteMany({ where: { email: { startsWith: 'test-' } } });
});

after(async () => {
  await prisma.user.deleteMany({ where: { email: { startsWith: 'test-' } } });
  await prisma.berita.deleteMany({ where: { slug: { startsWith: 'test-' } } });
  await new Promise((r) => server.close(r));
  await closeDatabase();
});

test('health endpoint responds', async () => {
  const res = await request('/health');
  assert.equal(res.status, 200);
  assert.equal(res.body.ok, true);
});

test('CSRF token is issued', async () => {
  const res = await request('/api/auth/csrf');
  assert.equal(res.status, 200);
  assert.ok(res.body.csrfToken);
});

test('login without CSRF is rejected', async () => {
  const res = await fetch(baseUrl + '/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'x@y.z', password: 'password123' }) });
  assert.equal(res.status, 400);
});

test('admin mutation is forbidden for guests', async () => {
  const res = await request('/api/berita', { method: 'POST', body: JSON.stringify({ judul: 'x', slug: 'test-x', konten: 'x', status: 'draft' }) });
  assert.equal(res.status, 401);
});

test('public berita list never exposes drafts', async () => {
  const res = await request('/api/berita');
  assert.equal(res.status, 200);
  assert.ok(res.body.data.every((row) => row.status === 'published'));
});

test('nexttel scoring validates answers and returns ranking', async () => {
  const answers = ['activity', 'interest', 'project', 'learning', 'problem', 'tool', 'work', 'future'].map((questionId) => ({ questionId, optionId: 'a' }));
  const ok = await request('/api/ai/nexttel', { method: 'POST', body: JSON.stringify({ answers }) });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.data.topRecommendation, 'RPL');
  const bad = await request('/api/ai/nexttel', { method: 'POST', body: JSON.stringify({ answers: [] }) });
  assert.equal(bad.status, 400);
});
