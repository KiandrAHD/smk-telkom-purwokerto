import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

let cleanup;
globalThis.__settingsEffect = effect => { cleanup = effect(); };
globalThis.window = Object.assign(new EventTarget(), { history: { state: { idx: 0 } }, location: { href: 'https://example.invalid/dashboard/pengaturan' } });
globalThis.document = new EventTarget();
const { window, document } = globalThis;
try {
  const source = (await readFile(new URL('../src/hooks/useUnsavedSettings.js', import.meta.url), 'utf8')).replace("import { useEffect } from 'react';", 'const useEffect = globalThis.__settingsEffect;');
  const { default: useUnsavedSettings, canLeaveSettings } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
  window.confirm = () => false;
  useUnsavedSettings(true);
  assert.equal(canLeaveSettings(), false, 'Programmatic search/logout must respect cancel');
  const click = new Event('click', { cancelable: true });
  Object.defineProperty(click, 'target', { value: { closest: () => ({ href: 'https://example.invalid/dashboard', target: '' }) } });
  document.dispatchEvent(click);
  assert.equal(click.defaultPrevented, true, 'Links must preserve drafts on cancel');
  window.confirm = () => true;
  assert.equal(canLeaveSettings(), true);
  cleanup();
  useUnsavedSettings(true, true);
  window.confirm = () => { throw new Error('Busy navigation must stay blocked'); };
  assert.equal(canLeaveSettings(), false);
  cleanup();
  assert.equal(canLeaveSettings(), true, 'Unmount must remove the guard');
  console.log('Settings navigation: link and programmatic cancellation, busy lock and cleanup passed.');
} finally {
  cleanup?.();
  delete globalThis.window; delete globalThis.document; delete globalThis.__settingsEffect;
}
