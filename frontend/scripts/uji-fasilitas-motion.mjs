/* global document, getComputedStyle, requestAnimationFrame, innerWidth */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    await page.goto(process.env.QA_URL || 'http://127.0.0.1:5173/');
    const next = page.getByRole('button', { name: 'Fasilitas berikutnya', exact: true });
    await next.scrollIntoViewIfNeeded();
    await next.hover();
    await page.locator('#fasilitas [data-slide] img').evaluateAll(images => Promise.allSettled(images.map(image => { image.loading = 'eager'; return image.decode(); })));
    await page.waitForTimeout(1200);
    const devtools = await page.context().newCDPSession(page);
    await devtools.send('Performance.enable');
    for (const direction of [1, -1]) {
      const beforeMetrics = Object.fromEntries((await devtools.send('Performance.getMetrics')).metrics.map(metric => [metric.name, metric.value]));
      const frames = await page.evaluate(async direction => {
        const buttons = [...document.querySelectorAll('#fasilitas ol button')];
        const before = buttons.findIndex(button => button.getAttribute('aria-pressed') === 'true');
        const entering = (before + direction * (innerWidth >= 640 ? 2 : 1) + 6) % 6;
        const leaving = (before - direction * (innerWidth >= 640 ? 1 : 0) + 6) % 6;
        const sample = time => ({ time, entering, leaving, cards: [...document.querySelectorAll('#fasilitas [data-slide]')].map(card => {
          const rect = card.getBoundingClientRect();
          const style = getComputedStyle(card);
          return { id: Number(card.dataset.flipId.split('-')[1]), x: rect.x, width: rect.width, opacity: Number(style.opacity), display: style.display };
        }) });
        const frames = [sample(performance.now())];
        document.querySelector(`#fasilitas button[aria-label="Fasilitas ${direction === 1 ? 'berikutnya' : 'sebelumnya'}"]`).click();
        await new Promise(resolve => {
          const start = performance.now();
          const tick = time => {
            frames.push(sample(time));
            if (time - start < 650) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        });
        return frames;
      }, direction);
      const incoming = frames.slice(1).map(frame => frame.cards.find(card => card.id === frame.entering)).filter(card => card.display !== 'none');
      const outgoing = frames.map(frame => frame.cards.find(card => card.id === frame.leaving)).filter(card => card.display !== 'none');
      const travel = cards => Math.max(...cards.map(card => card.x)) - Math.min(...cards.map(card => card.x));
      const gaps = frames.slice(2).map((frame, index) => frame.time - frames[index + 1].time);
      const afterMetrics = Object.fromEntries((await devtools.send('Performance.getMetrics')).metrics.map(metric => [metric.name, metric.value]));
      console.log(JSON.stringify({ width, direction, incomingTravel: travel(incoming), outgoingTravel: travel(outgoing), frameMedian: [...gaps].sort((a, b) => a - b)[Math.floor(gaps.length / 2)], framesOver25ms: gaps.filter(gap => gap > 25).length, frames: frames.length, layouts: afterMetrics.LayoutCount - beforeMetrics.LayoutCount, layoutMs: (afterMetrics.LayoutDuration - beforeMetrics.LayoutDuration) * 1000 }));
      assert.ok(travel(incoming) > incoming.at(-1).width * 0.6, 'Card baru harus masuk dari samping, bukan muncul di posisi akhir.');
      assert.ok(travel(outgoing) > outgoing[0].width * 0.6, 'Card keluar harus bergerak ke samping, bukan hanya menghilang.');
      // The previous matrix-fitting transition needed over 50 layouts at startup.
      assert.ok(afterMetrics.LayoutCount - beforeMetrics.LayoutCount < 30, 'Transisi harus tetap di bawah anggaran layout, tanpa fitting matriks berulang.');
      for (const id of [0, 1, 2, 3, 4, 5]) {
        const final = frames.at(-1).cards.find(card => card.id === id);
        const settled = frames.at(-2).cards.find(card => card.id === id);
        if (final.display !== 'none') assert.ok(Math.abs(final.x - settled.x) < 1, 'Akhir transisi tidak boleh snap.');
      }
    }
    for (const direction of [1, -1]) {
      const activeIndex = () => page.locator('#fasilitas ol button').evaluateAll(buttons => buttons.findIndex(button => button.getAttribute('aria-pressed') === 'true'));
      const before = await activeIndex();
      await page.getByRole('button', { name: direction === 1 ? 'Fasilitas berikutnya' : 'Fasilitas sebelumnya', exact: true }).evaluate(button => {
        for (let click = 0; click < 15; click++) button.click();
      });
      await page.waitForTimeout(650);
      assert.equal(await activeIndex(), (before + direction + 6) % 6, 'Klik berulang selama satu transisi tidak boleh bertabrakan atau skip.');
    }
    await page.close();
  }
  console.log('PASS: continuous card entry/exit and settled positions on desktop/mobile, both directions, loop boundary, 15 rapid clicks advance once.');
} finally {
  await browser.close();
}
