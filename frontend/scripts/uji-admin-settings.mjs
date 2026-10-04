import assert from 'node:assert/strict';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

const server = await createServer({
  root: path.resolve(import.meta.dirname, '..'), logLevel: 'error', server: { middlewareMode: true },
  plugins: [{
    name: 'qa-settings-auth', enforce: 'pre',
    resolveId(id, importer) {
      if (id.endsWith('/context/AuthContext') && importer?.endsWith('/PengaturanPage.jsx')) return '\0qa-settings-auth';
    },
    load(id) {
      if (id === '\0qa-settings-auth') return 'export const useAuth = () => globalThis.__settingsAuthFixture;';
    },
  }],
});
try {
  const module = await server.ssrLoadModule('/src/pages/dashboard/PengaturanPage.jsx');
  assert.equal(typeof module.AkunAdmin, 'function', 'Settings need a testable actual-auth account view');
  const render = Component => renderToStaticMarkup(React.createElement(MemoryRouter, null, React.createElement(Component)));
  for (const [name, email] of [['Admin Fixture A', 'a@example.invalid'], ['Admin Fixture B', 'b@example.invalid']]) {
    globalThis.__settingsAuthFixture = { user: { email, user_metadata: { full_name: name } }, isAdmin: true };
    const html = render(module.AkunAdmin);
    assert.ok(html.includes(name) && html.includes(email), 'Account view must reflect current authenticated user');
    assert.ok(!html.includes('admin@smktelkom-pwt.sch.id'), 'Dummy account must not be presented as live');
  }
  globalThis.__settingsAuthFixture = { user: { email: 'empty@example.invalid', user_metadata: { full_name: { invalid: true } } }, isAdmin: false };
  const missing = render(module.AkunAdmin);
  assert.ok(missing.includes('Belum tersedia'));
  assert.ok(!missing.includes('value="Administrator"'), 'Role cannot come from a static admin label');
  const config = render(module.PengaturanUmum);
  assert.ok(config.includes('2027/2028') && config.includes('Pratinjau'));
  assert.ok(!config.includes('2025/2026') && !config.includes('value="Dibuka"'));
  console.log('Settings: current Auth identity, missing metadata, role and truthful configuration preview pass.');
} finally { await server.close(); delete globalThis.__settingsAuthFixture; }
