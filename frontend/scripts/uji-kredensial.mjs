import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const root = path.resolve(import.meta.dirname, '..');
// Fingerprints only: never reintroduce the previously exposed values into tests.
const forbidden = new Set([
  '47deb508a53039ef6ff8c7f324145822263e58b0b200f33126fa0c7a510a162c',
  '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
]);
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const server = await createServer({
  root, logLevel: 'error', server: { middlewareMode: true },
  plugins: [{
    name: 'qa-login-auth', enforce: 'pre',
    resolveId(id, importer) {
      if (id.endsWith('/context/AuthContext') && importer?.endsWith('/Login.jsx')) return '\0qa-login-auth';
    },
    load(id) {
      if (id === '\0qa-login-auth') return 'export const useAuth = () => ({ loading: false, user: null, isAdmin: false, signIn: async () => {} });';
    },
  }],
});
try {
  const { default: Login } = await server.ssrLoadModule('/src/page/Login/Login.jsx');
  const html = renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Login)));
  assert.ok(html.includes('Login Admin') && html.includes('type="password"'), 'Admin login form must remain available');
  assert.ok(!html.includes('Informasi Login Demo'), 'Public login still renders the demo credential card');
  for (const text of html.matchAll(/>([^<>]+)</g)) {
    assert.ok(!forbidden.has(hash(text[1].trim())), 'Public login exposes an old credential');
  }
} finally { await server.close(); }

function scan(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) { scan(file); continue; }
    if (!/\.(?:jsx?|mjs|ts|html)$/.test(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const match of text.matchAll(/["']([^"'\r\n]*)["']|<p>([^<>]+)<\/p>/g)) {
      assert.ok(!forbidden.has(hash(match[1] ?? match[2])), `Old credential literal found in ${path.relative(root, file)}`);
    }
  }
}
scan(path.join(root, 'src'));
const demoVariable = ['VITE', 'DEMO', 'ADMIN'].join('_');
assert.ok(!fs.readFileSync(path.join(root, '.env.example'), 'utf8').includes(demoVariable), 'Environment example still encourages browser-exposed demo credentials');
if (process.argv.includes('--build')) scan(path.join(root, 'dist'));
console.log(`Credential regression: login form retained, demo removed, source${process.argv.includes('--build') ? ' and production bundle' : ''} fingerprints clean.`);
