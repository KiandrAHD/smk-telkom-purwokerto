import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../src/components/ScrollToTop.jsx', import.meta.url), 'utf8');
const component = source.slice(source.indexOf('const ScrollToTop ='), source.indexOf('export default ScrollToTop'));

const checkRoute = ({ hash = '', lenis = null, target = null } = {}) => {
  const calls = [];
  const listeners = new Map();
  const instance = lenis && {
    stop: () => calls.push(['stop']),
    start: () => calls.push(['start']),
    scrollTo: (...args) => calls.push(['lenis', ...args]),
    resize: () => calls.push(['resize']),
  };
  runInNewContext(`${component}\nScrollToTop();`, {
    useLocation: () => ({ pathname: '/berita', hash }),
    useLenis: () => instance,
    useEffect: (callback) => callback(),
    window: {
      scrollTo: (options) => calls.push(['native', options]),
      addEventListener: (name, callback) => listeners.set(name, callback),
      removeEventListener: (name) => listeners.delete(name),
    },
    document: { getElementById: (id) => { calls.push(['id', id]); return target; } },
    ResizeObserver: class {
      constructor(callback) { calls.resizeLayout = callback; }
      observe() {}
      disconnect() { calls.disconnected = true; }
    },
  });
  calls.listeners = listeners;
  return calls;
};

const native = checkRoute();
assert.equal(native[0][0], 'native');
assert.equal(native[0][1].top, 0);
assert.equal(native[0][1].behavior, 'instant');

const smooth = checkRoute({ lenis: true });
assert.deepEqual(smooth.map(([name]) => name), ['stop', 'start', 'lenis']);
assert.equal(smooth[2][1], 0);
assert.equal(smooth[2][2].immediate, true);
assert.equal(smooth[2][2].force, true);

const target = { clientHeight: 100, closest: () => target, scrollIntoView: (options) => { target.options = options; } };
const hash = checkRoute({ hash: '#profil%20sekolah', lenis: true, target });
assert.equal(hash[0][1], 'profil sekolah');
assert.equal(hash.at(-1)[1], target);
assert.equal(hash.at(-1)[2].offset, undefined, 'Margin CSS tidak boleh dihitung dua kali.');
assert.equal(typeof hash.resizeLayout, 'function', 'Hash mengikuti perubahan ukuran konten yang dimuat belakangan.');
target.clientHeight = 200;
hash.resizeLayout();
assert.equal(hash.at(-1)[1], target);
assert.equal(hash.at(-1)[2].immediate, true);
hash.listeners.get('wheel')();
assert.equal(hash.disconnected, true);
assert.equal(hash.listeners.size, 0, 'Interaksi pengguna menghentikan penguncian anchor.');

checkRoute({ hash: '#profil', target });
assert.equal(target.options.block, 'start');
assert.equal(checkRoute({ hash: '#bad%', lenis: true })[0][1], 'bad%');
assert.equal(checkRoute({ hash: '#belum-terpasang', lenis: true }).some(([name]) => name === 'lenis'), false);

console.log('Animasi: reset native/Lenis, pembatalan momentum, hash terenkode/rusak, target lazy, dan margin anchor lulus.');
