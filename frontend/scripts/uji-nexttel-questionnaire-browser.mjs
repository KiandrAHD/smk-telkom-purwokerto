/* global document, getComputedStyle */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import { NEXTTEL_QUESTIONS as questions } from '../src/data/nexttelQuestions.js';
import { hitungHasilNextTel } from '../../supabase/functions/nexttel/scoring.mjs';

const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const base = process.env.QA_URL || 'http://127.0.0.1:5173';
const output = process.env.QA_OUTPUT || '../../qa-output/nexttel-2026-10-14';
await mkdir(output, { recursive: true });
const report = { viewports: [], requests: [], fonts: {}, errors: [] };
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => sessionStorage.setItem('smk-telkom-language', 'id'));
  const page = await context.newPage();
  page.on('pageerror', error => report.errors.push(error.message));
  await page.route('**/rest/v1/**', route => route.fulfill({ json: [] }));
  let responseMode = 'error';
  let releaseRequest;
  await page.route(/\/(functions\/v1|api)\/nexttel(?:\?|$)/, async route => {
    report.requests.push(route.request().postDataJSON());
    if (responseMode === 'hold') await new Promise(resolve => { releaseRequest = resolve; });
    if (responseMode === 'error') await route.fulfill({ status: 503, json: { error: 'QA unavailable' } });
    else await route.fulfill({ json: { explanation: 'Penjelasan uji NextTel.', strengths: ['Membuat karya'], learningSuggestions: ['Coba proyek sederhana'] } });
  });
  const start = async () => {
    await page.goto(`${base}/nexttel`);
    await page.getByRole('button', { name: 'Mulai sekarang', exact: true }).click();
    await page.locator('#nexttel-question').waitFor();
  };
  const overflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'No horizontal overflow');
  await page.goto(`${base}/nexttel`);
  await page.getByRole('button', { name: 'Mulai sekarang', exact: true }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('main')).opacity) >= 0.99);
  assert.ok(await page.locator('img[src="/assets/nexttel/robot.png"]').evaluate(image => image.complete && image.naturalWidth > 0));
  await page.screenshot({ path: `${output}/intro-desktop.png`, fullPage: true });
  await start();
  assert.equal(await page.getByRole('button', { name: 'Lanjut', exact: true }).isDisabled(), true);
  assert.equal(await page.getByRole('button', { name: 'Kembali', exact: true }).isDisabled(), true);
  assert.equal(await page.locator('#nexttel-question').evaluate(node => document.activeElement === node), true);
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('input[type="radio"]').first().evaluate(node => document.activeElement === node), true);
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowRight');
  assert.equal(await page.getByRole('radio', { name: questions[0].options[1].label, exact: true }).isChecked(), true);
  assert.equal(await page.locator('input:checked').count(), 1);
  await page.getByRole('button', { name: 'Lanjut', exact: true }).click();
  await page.getByRole('radio', { name: questions[1].options[2].label, exact: true }).locator('..').click();
  await page.getByRole('button', { name: 'Kembali', exact: true }).click();
  assert.equal(await page.getByRole('radio', { name: questions[0].options[1].label, exact: true }).isChecked(), true);
  await page.getByRole('radio', { name: questions[0].options[3].label, exact: true }).locator('..').click();
  await page.getByRole('button', { name: 'Lanjut', exact: true }).click();
  assert.equal(await page.getByRole('radio', { name: questions[1].options[2].label, exact: true }).isChecked(), true);
  await page.getByRole('button', { name: 'Kembali', exact: true }).click();
  const selected = [3, 2, 0, 1, 2, 3, 0, 1];
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    assert.equal(await page.locator('#nexttel-question').textContent(), question.prompt);
    assert.equal(await page.getByRole('radio').count(), 4);
    assert.equal(await page.getByRole('progressbar').getAttribute('value'), String(i + 1));
    for (const option of question.options) await page.getByRole('radio', { name: option.label, exact: true }).waitFor();
    await page.getByRole('radio', { name: question.options[selected[i]].label, exact: true }).locator('..').click();
    if (i === 2) await page.screenshot({ path: `${output}/question-desktop.png`, fullPage: true });
    if (i === 7) {
      const cdp = await context.newCDPSession(page);
      await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
      const { root } = await cdp.send('DOM.getDocument');
      for (const [name, selector] of [['heading', '#nexttel-question'], ['body', 'label span span:last-child']]) {
        const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
        report.fonts[name] = (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts.map(font => font.familyName);
      }
      assert.ok(report.fonts.heading.some(name => name.startsWith('Poppins')));
      assert.ok(report.fonts.body.some(name => name.startsWith('Inter')));
    }
    await overflow();
    await page.getByRole('button', { name: i === 7 ? 'Selesai' : 'Lanjut', exact: true }).click();
  }
  await page.getByRole('alert').waitFor();
  assert.equal(report.requests.length, 1);
  const expected = questions.map((question, i) => ({ questionId: question.id, optionId: question.options[selected[i]].id }));
  assert.deepEqual(report.requests[0].answers, expected);
  const result = hitungHasilNextTel(expected);
  assert.ok(await page.getByRole('img', { name: /Rekayasa Perangkat Lunak/ }).count());
  assert.deepEqual(await page.locator('tbody tr').evaluateAll(rows => rows.map(row => [row.cells[0].textContent, Number(row.cells[1].textContent)])), result.ranking);
  await page.screenshot({ path: `${output}/result-error-desktop.png`, fullPage: true });
  responseMode = 'success';
  await page.getByRole('button', { name: 'Coba lagi', exact: true }).click();
  await page.getByText('Penjelasan uji NextTel.', { exact: true }).waitFor();
  assert.equal(await page.getByRole('alert').count(), 0);
  await page.screenshot({ path: `${output}/result-success-desktop.png`, fullPage: true });
  await page.getByRole('button', { name: 'Mulai ulang', exact: true }).click();
  await page.getByRole('button', { name: 'Mulai sekarang', exact: true }).click();
  assert.equal(await page.locator('input:checked').count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Lanjut', exact: true }).isDisabled(), true);

  for (const width of [320, 375, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await start();
    for (let i = 0; i < 8; i++) {
      await overflow();
      await page.getByRole('radio').last().locator('..').click();
      await page.getByRole('button', { name: i === 7 ? 'Selesai' : 'Lanjut', exact: true }).click();
    }
    await page.getByText('Penjelasan uji NextTel.', { exact: true }).waitFor();
    await overflow();
    if (width === 375) await page.screenshot({ path: `${output}/result-mobile.png`, fullPage: true });
    report.viewports.push({ width, language: 'id', passed: true });
  }
  const enContext = await browser.newContext();
  await enContext.addInitScript(() => sessionStorage.setItem('smk-telkom-language', 'en'));
  const enPage = await enContext.newPage();
  enPage.on('pageerror', error => report.errors.push(error.message));
  await enPage.route('**/rest/v1/**', route => route.fulfill({ json: [] }));
  await enPage.route(/\/(functions\/v1|api)\/nexttel(?:\?|$)/, async route => {
    assert.equal(route.request().postDataJSON().language, 'en');
    await route.fulfill({ json: { explanation: 'English explanation.', strengths: ['Projects'], learningSuggestions: ['Practice'] } });
  });
  for (const width of [320, 768, 1440]) {
    await enPage.setViewportSize({ width, height: 900 });
    await enPage.goto(`${base}/nexttel`);
    await enPage.getByRole('button', { name: 'Start Now', exact: true }).click();
    for (let i = 0; i < 8; i++) {
      assert.equal(await enPage.locator('#nexttel-question').textContent(), questions[i].prompt);
      assert.ok(await enPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
      await enPage.getByRole('radio').last().locator('..').click();
      await enPage.getByRole('button', { name: i === 7 ? 'Complete' : 'Next', exact: true }).click();
    }
    await enPage.getByText('English explanation.', { exact: true }).waitFor();
    assert.ok(await enPage.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
    report.viewports.push({ width, language: 'en', passed: true });
  }
  await enContext.close();
  // Reduced motion and long copy on the smallest viewport.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 320, height: 844 });
  await start();
  assert.ok(await page.locator('.motion-filter-results').evaluate(node => parseFloat(getComputedStyle(node).animationDuration) <= 0.001));
  await page.screenshot({ path: `${output}/question-mobile.png`, fullPage: true });
  responseMode = 'hold';
  for (let i = 0; i < 8; i++) {
    await page.getByRole('radio').first().locator('..').click();
    await page.getByRole('button', { name: i === 7 ? 'Selesai' : 'Lanjut', exact: true }).click();
  }
  await page.getByRole('status').filter({ hasText: 'NextTel' }).waitFor();
  await page.getByRole('button', { name: 'Mulai ulang', exact: true }).click();
  releaseRequest();
  await page.getByRole('button', { name: 'Mulai sekarang', exact: true }).click();
  assert.equal(await page.locator('input:checked').count(), 0);
  assert.equal(await page.getByText('Penjelasan uji NextTel.', { exact: true }).count(), 0);
  assert.deepEqual(report.errors, []);
  report.passed = true;
  console.log(JSON.stringify({ passed: report.passed, viewports: report.viewports, fonts: report.fonts, errors: report.errors, requestCount: report.requests.length }, null, 2));
} finally {
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
}
