/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { calendarEvents } from '../src/data/calendarEvents.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4173';
const output = process.env.QA_OUTPUT || join(tmpdir(), 'calendar-qa');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [], results = [];
page.on('pageerror', error => errors.push(error.message));
await page.route('**/rest/v1/**', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(route.request().url().includes('/events?') ? calendarEvents.map(event => ({ id: event.id, judul: event.title, tanggal_mulai: event.date, waktu_mulai: event.start, waktu_selesai: event.end, lokasi: event.location, kategori: event.category, status: 'published' })) : []) }));
const pickMonth = async value => {
  await page.locator('input[type="month"]').fill(value);
  await page.waitForFunction(value => document.querySelector('input[type="month"]')?.value === value, value);
};
try {
  await page.goto(base + '/kalender'); await page.locator('[data-calendar-date]').first().waitFor();
  await page.reload(); await page.locator('[data-calendar-date]').first().waitFor();
  await page.locator('header').getByRole('button', { name: 'Informasi', exact: true }).hover();
  assert.equal(await page.locator('#desktop-informasi-links').getByRole('link', { name: 'Kalender Kegiatan', exact: true }).getAttribute('href'), '/kalender');
  await page.locator('#desktop-informasi-links').getByRole('link', { name: 'Kalender Kegiatan', exact: true }).click();
  await pickMonth('2026-10');
  assert.equal(await page.locator('[data-calendar-date]').count(), 35);
  assert.equal(await page.locator('[data-calendar-date="2026-10-01"]').evaluate(el => el.closest('td').cellIndex), 3);
  await page.locator('[data-calendar-date="2026-10-01"]').click();
  await page.locator('aside [data-calendar-event="figma-upacara"]').click();
  await page.getByRole('dialog').waitFor(); assert(await page.getByRole('dialog').getByText('Lapangan Upacara', { exact: true }).isVisible());
  await page.keyboard.press('Escape'); assert.equal(await page.getByRole('dialog').count(), 0);
  await page.locator('[data-calendar-date="2026-10-03"]').click();
  assert(await page.getByText('Belum ada kegiatan pada tanggal ini.', { exact: true }).isVisible());
  await page.locator('[data-calendar-date="2026-10-03"]').focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.locator('[data-calendar-date="2026-10-04"]').getAttribute('aria-pressed'), 'true');
  assert.equal(await page.locator('[data-calendar-date="2026-10-04"]').evaluate(el => document.activeElement === el), true);
  await pickMonth('2026-12'); await page.getByRole('button', { name: 'Bulan berikutnya', exact: true }).click();
  assert.equal(await page.locator('input[type="month"]').inputValue(), '2027-01');
  await page.getByRole('button', { name: 'Bulan sebelumnya', exact: true }).click(); assert.equal(await page.locator('input[type="month"]').inputValue(), '2026-12');
  await pickMonth('2024-02'); assert.equal(await page.locator('[data-calendar-date="2024-02-29"]').count(), 1);
  await pickMonth('2025-02'); assert.equal(await page.locator('[data-calendar-date="2025-02-29"]').count(), 0);
  await page.getByRole('tab', { name: 'Daftar', exact: true }).click(); assert(await page.getByText('Belum ada kegiatan pada bulan ini.', { exact: true }).isVisible());
  await pickMonth('2026-10'); assert.equal(await page.locator('#calendar-panel [data-calendar-event]').count(), 7);
  await page.getByRole('tab', { name: 'Kalender', exact: true }).click();
  await page.getByRole('tab', { name: 'Kalender', exact: true }).focus(); await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('tab', { name: 'Daftar', exact: true }).getAttribute('aria-selected'), 'true');
  await page.keyboard.press('Home'); assert.equal(await page.getByRole('tab', { name: 'Kalender', exact: true }).getAttribute('aria-selected'), 'true');
  await page.getByRole('button', { name: 'Hari ini', exact: true }).click(); assert.equal(await page.locator('[data-calendar-date][aria-current="date"][aria-pressed="true"]').count(), 1);
  for (const width of [1920, 1440, 1024, 768, 375, 320]) for (const language of ['id', 'en']) {
    await page.setViewportSize({ width, height: 1000 });
    if (await page.locator('html').getAttribute('lang') !== language) await page.locator('header').getByRole('button', { name: language === 'en' ? 'Switch to English' : 'Switch to Indonesian', exact: true }).click();
    await pickMonth('2026-10');
    await page.evaluate(() => document.fonts.ready);
    await page.locator('#kalender').scrollIntoViewIfNeeded();
    const geometry = await page.locator('#kalender').evaluate(el => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      tableOverflow: el.querySelector('table').scrollWidth > el.querySelector('table').clientWidth,
      height: el.querySelector('#calendar-panel').getBoundingClientRect().height,
      bodyFont: getComputedStyle(el).fontFamily,
    }));
    assert.equal(geometry.overflow, false); assert.equal(geometry.tableOverflow, false); assert(geometry.bodyFont.includes('Inter'));
    await page.locator('[data-calendar-date="2026-10-03"]').click();
    const before = await page.locator('#calendar-panel').boundingBox();
    await pickMonth('2026-08'); const after = await page.locator('#calendar-panel').boundingBox();
    assert(Math.abs(before.height - after.height) < 2, 'Calendar must keep its height between five and six weeks');
    await pickMonth('2026-10'); await page.waitForTimeout(450);
    await page.locator('#calendar-title').click();
    if (language === 'id') {
      await page.locator('#kalender').screenshot({ path: join(output, `calendar-${width}.png`), animations: 'disabled', style: 'header { visibility: hidden; }' });
      if ([1440, 375].includes(width)) {
        await page.locator('[data-calendar-hero] img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await page.waitForTimeout(150);
        await page.screenshot({ path: join(output, `page-${width}.png`), fullPage: true, animations: 'disabled' });
        await page.locator('[data-calendar-hero]').screenshot({ path: join(output, `hero-${width}.png`), animations: 'disabled' });
      }
    }
    assert.equal(await page.locator('main > #stela').count(), 1);
    assert.equal(await page.locator('footer').count(), 1);
    assert((await page.title()).includes(language === 'id' ? 'Kalender Kegiatan' : 'Calendar of Events'));
    results.push({ width, language, geometry });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' }); await pickMonth('2026-11');
  assert.equal(await page.locator('#calendar-panel > div').evaluate(el => getComputedStyle(el).animationName), 'none');
  await page.setViewportSize({ width: 375, height: 1000 });
  await page.locator('header').getByRole('button', { name: 'Switch to Indonesian', exact: true }).click();
  await page.locator('header').getByRole('button', { name: 'Buka menu', exact: true }).click();
  await page.locator('#mobile-nav').getByRole('button', { name: 'Informasi', exact: true }).click();
  await page.locator('#mobile-informasi-links').getByRole('link', { name: 'Kalender Kegiatan', exact: true }).click();
  await page.waitForURL(base + '/kalender'); assert.equal(await page.locator('#mobile-nav').count(), 0);
  for (const value of ['0100-01', '9999-12']) { await pickMonth(value); assert.equal(await page.locator('input[type="month"]').inputValue(), value); }
  await pickMonth('2026-10');
  await page.goto(base); await page.locator('[data-quick-access]').waitFor();
  await page.locator('header').getByRole('button', { name: 'Buka menu', exact: true }).click();
  await page.locator('#mobile-nav').getByRole('button', { name: 'Informasi', exact: true }).click();
  await page.locator('#mobile-informasi-links').getByRole('link', { name: 'Kalender Kegiatan', exact: true }).click();
  await page.waitForURL(base + '/kalender'); await page.locator('[data-calendar-date]').first().waitFor();
  await page.goBack(); await page.waitForURL(base + '/'); await page.locator('[data-quick-access]').waitFor();
  await page.goForward(); await page.waitForURL(base + '/kalender'); await page.locator('[data-calendar-date]').first().waitFor();
  assert.deepEqual(errors, []);
  console.log('PASS route/reload, desktop/mobile menu, day alignment, leap dates, year navigation, date selection, detail/Escape, keyboard, empty/list views, Today, 12 responsive/language checks, stable height, shared layout and reduced motion.');
} finally { await writeFile(join(output, 'results.json'), JSON.stringify({ results, errors }, null, 2)); await browser.close(); }
