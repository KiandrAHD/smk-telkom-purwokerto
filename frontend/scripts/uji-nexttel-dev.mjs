import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createServer } from 'vite';
import { stelaDevPlugin } from '../vite-plugin-stela.js';
import { geminiReply } from './helpers/edge-handler.mjs';

const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'nexttel-test-'));
fs.writeFileSync(path.join(fixture, '.env'), `GEMINI_API_KEY=${'AIza' + 'x'.repeat(35)}\n`);
const originalFetch = globalThis.fetch;
const answers = ['activity', 'interest', 'project', 'learning', 'problem', 'tool', 'work', 'future'].map(questionId => ({ questionId, optionId: 'a' }));
let text = '{broken';
globalThis.fetch = async url => {
  assert.ok(String(url).startsWith('https://generativelanguage.googleapis.com/'), 'Unmocked provider request');
  return geminiReply(text);
};
const server = await createServer({ configFile: false, root: path.resolve(import.meta.dirname, '..'), envDir: fixture, logLevel: 'silent', plugins: [stelaDevPlugin()], server: { host: '127.0.0.1', port: 5216, strictPort: true } });
try {
  await server.listen();
  const call = body => originalFetch('http://127.0.0.1:5216/api/nexttel', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  for (const invalidModel of ['{broken', JSON.stringify({ explanation: 'Missing fields' })]) {
    text = invalidModel;
    const response = await call({ answers, language: 'en' });
    assert.equal(response.status, 200, 'Dev model failure must use the same deterministic fallback as production');
    const body = await response.json();
    assert.ok(body.explanation.includes('Software Engineering'));
    assert.ok(body.strengths.length && body.learningSuggestions.length);
  }
  const valid = { explanation: 'Good explanation', strengths: ['Programming'], learningSuggestions: ['Build a project'] };
  text = '```json\n' + JSON.stringify(valid) + '\n```';
  assert.deepEqual(await (await call({ answers })).json(), valid);
  assert.equal((await call({ answers: [] })).status, 400);
  console.log('NextTel dev: malformed/missing fallback, fenced JSON and invalid input match production.');
} finally {
  await server.close(); globalThis.fetch = originalFetch;
  assert.equal(path.dirname(path.resolve(fixture)), path.resolve(os.tmpdir()));
  assert.ok(path.basename(fixture).startsWith('nexttel-test-'));
  fs.rmSync(fixture, { recursive: true, force: true });
}
