import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createContext, runInContext } from 'node:vm';

const source = await readFile(new URL('../src/components/ScrollToTop.jsx', import.meta.url), 'utf8');
const component = source.slice(source.indexOf('const positions ='), source.indexOf('export default ScrollToTop'));

// Execute the real component; simulate only hooks and browser/Lenis boundaries.
const createHarness = () => {
  const hooks = [];
  const frames = new Map();
  const observers = [];
  const calls = [];
  const layout = { main: true, busy: false, childrenBusy: [], status: false, targets: [] };
  const heading = {
    getClientRects: () => [1], setAttribute() {},
    focus: (options) => calls.push({ kind: 'focus', options }),
  };
  const main = {
    getClientRects: () => [1],
    querySelector: () => heading,
    getAttribute: () => layout.busy ? 'true' : null,
    querySelectorAll: () => layout.childrenBusy,
  };
  const root = {};
  const browser = Object.assign(new EventTarget(), {
    history: { state: { key: 'a' }, scrollRestoration: 'auto' },
    scrollY: 600,
    scrollTo(options) {
      calls.push({ kind: 'native', top: options.top, options });
      this.scrollY = options.top;
      this.dispatchEvent(new Event('scroll'));
    },
  });
  const document = Object.assign(new EventTarget(), {
    getElementById: () => root,
    querySelectorAll: (selector) => {
      if (selector === 'main') return layout.main ? [main] : [];
      if (selector === '[id]') return layout.targets;
      if (selector === '[role="status"]') return layout.status ? [{ getClientRects: () => [1] }] : [];
      throw new Error('Unexpected selector: ' + selector);
    },
  });
  const lenis = {
    resize() {},
    scrollTo(top, options) {
      calls.push({ kind: 'lenis', top, options });
      browser.scrollY = top;
      browser.dispatchEvent(new Event('scroll'));
    },
  };
  class Observer {
    constructor(callback) { this.callback = callback; this.connected = false; observers.push(this); }
    observe() { this.connected = true; }
    disconnect() { this.connected = false; }
  }
  let location;
  let navigationType;
  let activeLenis = null;
  let cursor;
  let pending;
  let nextFrame = 0;
  const context = createContext({
    window: browser, document,
    useLocation: () => location,
    useNavigationType: () => navigationType,
    useLenis: () => activeLenis,
    useRef: (value) => {
      const slot = cursor++;
      hooks[slot] ??= { current: value };
      return hooks[slot];
    },
    useEffect: (callback, deps) => {
      const slot = cursor++;
      const old = hooks[slot];
      if (!old || deps.some((value, index) => !Object.is(value, old.deps[index]))) {
        pending.push({ slot, callback, deps, cleanup: old?.cleanup });
      }
    },
    MutationObserver: Observer, ResizeObserver: Observer,
    requestAnimationFrame: (callback) => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: (id) => frames.delete(id),
  });
  runInContext(component, context);
  const render = (next = { key: 'a', pathname: '/berita' }, type = 'PUSH', smooth = false) => {
    location = { search: '', hash: '', ...next };
    navigationType = type;
    activeLenis = smooth ? lenis : null;
    browser.history.state = { key: location.key };
    cursor = 0;
    pending = [];
    runInContext('ScrollToTop();', context);
    // Changed effects clean up before the next setups, as in React.
    pending.forEach(({ cleanup }) => cleanup?.());
    pending.forEach(({ slot, callback, deps }) => {
      hooks[slot] = { callback, deps, cleanup: callback() };
    });
  };
  const flush = () => {
    const callbacks = [...frames.values()];
    frames.clear();
    callbacks.forEach((callback) => callback());
  };
  const notify = () => observers.filter((observer) => observer.connected).forEach((observer) => observer.callback());
  const unmount = () => hooks.forEach((hook) => hook.cleanup?.());
  const replayEffects = () => {
    unmount();
    hooks.filter((hook) => hook.callback).forEach((hook) => { hook.cleanup = hook.callback(); });
  };
  const scrolls = () => calls.filter(({ kind }) => kind === 'native' || kind === 'lenis');
  const scrollUser = (top) => {
    browser.scrollY = top;
    browser.dispatchEvent(new Event('scroll'));
  };
  return { render, flush, notify, unmount, replayEffects, scrolls, scrollUser, browser, calls, layout, frames, observers };
};

const target = (id, offsetTop, offsetParent = null, visible = true) => ({
  id, offsetTop, offsetParent, getClientRects: () => visible ? [1] : [],
});
const assertReleased = (h) => {
  assert.equal(h.frames.size, 0, 'No stale frame may keep controlling scroll.');
  assert.equal(h.observers.some((observer) => observer.connected), false, 'Observers must disconnect when finished.');
};
const tests = [];
const test = (name, callback) => tests.push({ name, callback });

test('Native navigation resets the viewport after content is ready', () => {
  const h = createHarness();
  h.render();
  assert.equal(h.scrolls().length, 0, 'Scroll waits for the animation frame.');
  h.flush();
  const scroll = h.scrolls().at(-1);
  assert.equal(scroll.kind, 'native');
  assert.equal(scroll.top, 0);
  assert.equal(scroll.options.left, 0);
  assert.equal(scroll.options.behavior, 'instant');
  assertReleased(h);
  h.unmount();
});

test('Lenis receives an immediate forced reset without stale momentum', () => {
  const h = createHarness();
  h.render(undefined, 'PUSH', true); h.flush();
  const scroll = h.scrolls().at(-1);
  assert.equal(scroll.kind, 'lenis');
  assert.equal(scroll.top, 0);
  assert.equal(scroll.options.immediate, true);
  assert.equal(scroll.options.force, true);
  assertReleased(h);
  h.unmount();
});

test('A new page resets scroll and focuses its heading only once', () => {
  const h = createHarness();
  h.render(); h.flush(); h.scrollUser(420);
  h.render({ key: 'b', pathname: '/jurusan' }); h.flush();
  assert.equal(h.scrolls().at(-1).top, 0);
  assert.equal(h.calls.filter(({ kind }) => kind === 'focus').length, 1);
  assert.equal(h.calls.find(({ kind }) => kind === 'focus').options.preventScroll, true);
  h.notify(); h.flush();
  assert.equal(h.calls.filter(({ kind }) => kind === 'focus').length, 1);
  h.unmount();
});

test('Search-only updates preserve scroll and focus', () => {
  const h = createHarness();
  h.render(); h.flush(); h.scrollUser(375);
  h.render({ key: 'b', pathname: '/berita', search: '?q=telkom' }); h.flush();
  assert.equal(h.scrolls().length, 1);
  assert.equal(h.browser.scrollY, 375);
  assert.equal(h.calls.filter(({ kind }) => kind === 'focus').length, 0);
  h.unmount();
});

test('Encoded anchors use visible layout offsets, not transformed bounds', () => {
  const h = createHarness();
  h.layout.targets = [target('profil sekolah', 900, null, false), target('profil sekolah', 350, target('parent', 250))];
  h.render({ key: 'a', pathname: '/profil-sekolah', hash: '#profil%20sekolah' }, 'PUSH', true); h.flush();
  assert.equal(h.scrolls().at(-1).top, 504);
  assert.equal(h.scrolls().at(-1).options.offset, undefined, 'Do not count CSS margin twice.');
  assertReleased(h);
  h.unmount();
});

test('Native anchors and malformed fragments remain safe', () => {
  const h = createHarness();
  h.layout.targets = [target('bad%', 45)];
  h.render({ key: 'a', pathname: '/profil-sekolah', hash: '#bad%' }); h.flush();
  assert.equal(h.scrolls().at(-1).kind, 'native');
  assert.equal(h.scrolls().at(-1).top, 0, 'An anchor above the header cannot produce negative scroll.');
  h.unmount();
});

test('An absent anchor scrolls after lazy content arrives', () => {
  const h = createHarness();
  h.render({ key: 'a', pathname: '/profil-sekolah', hash: '#fasilitas' }); h.flush();
  assert.equal(h.scrolls().length, 0);
  h.layout.targets = [target('fasilitas', 800)];
  h.notify(); h.flush();
  assert.equal(h.scrolls().at(-1).top, 704);
  assertReleased(h);
  h.unmount();
});

for (const mode of ['main', 'child', 'fallback']) {
  test('Loading ' + mode + ' delays scroll until content becomes ready', () => {
    const h = createHarness();
    if (mode === 'main') h.layout.busy = true;
    if (mode === 'child') h.layout.childrenBusy = [{ getClientRects: () => [1] }];
    if (mode === 'fallback') { h.layout.main = false; h.layout.status = true; }
    h.render(); h.flush();
    assert.equal(h.scrolls().length, 0);
    h.layout.busy = false; h.layout.childrenBusy = []; h.layout.main = true; h.layout.status = false;
    h.notify(); h.notify();
    assert.equal(h.frames.size, 1, 'Observer bursts are coalesced into one frame.');
    h.flush();
    assert.equal(h.scrolls().length, 1);
    assert.equal(h.scrolls()[0].top, 0);
    assertReleased(h);
    h.unmount();
  });
}

test('Hidden loading indicators do not block the visible page', () => {
  const h = createHarness();
  h.layout.childrenBusy = [{ getClientRects: () => [] }];
  h.render(); h.flush();
  assert.equal(h.scrolls().length, 1);
  h.unmount();
});

for (const smooth of [false, true]) {
  test('Back and Forward restore entry positions with ' + (smooth ? 'Lenis' : 'native scroll'), () => {
    const h = createHarness();
    h.render(undefined, 'POP', smooth); h.flush(); h.scrollUser(420);
    // A route commit can clamp the viewport before old effect cleanup.
    h.browser.scrollY = 0;
    h.render({ key: 'b', pathname: '/jurusan' }, 'PUSH', smooth); h.flush(); h.scrollUser(155);
    h.layout.busy = true;
    h.render({ key: 'a', pathname: '/berita', hash: '#old-anchor' }, 'POP', smooth); h.flush();
    assert.equal(h.scrolls().length, 2, 'Back must wait for async data.');
    h.layout.busy = false; h.notify(); h.flush();
    assert.equal(h.scrolls().at(-1).top, 420, 'Saved history position wins over the URL anchor.');
    h.render({ key: 'b', pathname: '/jurusan' }, 'POP', smooth); h.flush();
    assert.equal(h.scrolls().at(-1).top, 155);
    assert.equal(h.calls.filter(({ kind }) => kind === 'focus').length, 1, 'POP must not steal focus.');
    h.unmount();
  });
}

test('Lenis becoming available while loading uses the latest instance', () => {
  const h = createHarness();
  h.layout.busy = true; h.render(); h.flush();
  h.render(undefined, 'PUSH', true);
  h.layout.busy = false; h.notify(); h.flush();
  assert.equal(h.scrolls().length, 1);
  assert.equal(h.scrolls()[0].kind, 'lenis');
  h.unmount();
});

for (const event of ['wheel', 'pointerdown', 'touchstart', 'keydown']) {
  test('User ' + event + ' cancels pending anchor alignment', () => {
    const h = createHarness();
    h.render({ key: 'a', pathname: '/profil-sekolah', hash: '#fasilitas' }); h.flush();
    h.layout.targets = [target('fasilitas', 800)]; h.notify();
    h.browser.dispatchEvent(new Event(event));
    h.flush(); h.notify(); h.flush();
    assert.equal(h.scrolls().length, 0, 'User control must win over deferred scroll.');
    assertReleased(h);
    h.unmount();
  });
}

test('Navigating away cancels an old anchor frame', () => {
  const h = createHarness();
  h.render({ key: 'a', pathname: '/profil-sekolah', hash: '#fasilitas' }); h.flush();
  h.layout.targets = [target('fasilitas', 800)]; h.notify();
  h.render({ key: 'b', pathname: '/jurusan' }); h.flush();
  assert.equal(h.scrolls().length, 1);
  assert.equal(h.scrolls()[0].top, 0);
  h.unmount();
});

test('StrictMode effect replay and unmount release pending work', () => {
  const h = createHarness();
  h.render(); h.replayEffects(); h.flush();
  assert.equal(h.scrolls().length, 1, 'StrictMode replay must not duplicate queued scrolling.');
  assert.equal(h.browser.history.scrollRestoration, 'manual');
  h.layout.busy = true; h.render({ key: 'b', pathname: '/jurusan' });
  h.unmount(); h.flush(); h.notify(); h.flush();
  assert.equal(h.scrolls().length, 1);
  assert.equal(h.browser.history.scrollRestoration, 'auto');
  assertReleased(h);
});

for (const { name, callback } of tests) {
  try { callback(); } catch (error) { throw new Error(name, { cause: error }); }
}
console.log('Animasi: ' + tests.length + ' skenario scroll native/Lenis, history, anchor lazy, fokus, pembatalan, dan cleanup lulus.');
