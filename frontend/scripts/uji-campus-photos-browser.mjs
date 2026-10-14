/* global document, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://localhost:5173';
const output = process.env.QA_OUTPUT || '../../qa-output/campus-photos-2026-10-14';
await mkdir(output, { recursive: true });
const server = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
const { campusFacilities, campusHotspots } = await server.ssrLoadModule('/src/data/campusData.js');
await server.close();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ reducedMotion: 'reduce' });
page.setDefaultTimeout(15000);
const errors = [], failedImages = [], results = [];
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.request().resourceType() === 'image' && response.status() >= 400) failedImages.push(response.url()); });
await page.route('**/rest/v1/**', route => route.fulfill({status:200,contentType:'application/json',body:'[]'}));
const verifyPhoto = async content => {
  const photo = content.locator('.campus-photo-main img.campus-preview-photo');
  await photo.waitFor();
  await photo.evaluate(img => img.decode());
  const state = await photo.evaluate(img => ({ width:img.naturalWidth, height:img.naturalHeight, fit:getComputedStyle(img).objectFit, src:img.currentSrc, box:img.getBoundingClientRect().toJSON() }));
  assert(state.width > 0 && state.height > 0);
  assert(state.box.width > 0 && state.box.height > 0);
  assert.equal(state.fit, 'cover');
  assert.equal(await content.locator('[data-campus-photo-fallback]').count(), 0);
  return state.src;
};
try {
  for (const width of [1440, 1018, 390]) {
    await page.setViewportSize({width,height:900});
    for (const language of ['id','en']) {
      await page.goto(base+'/fasilitas?kategori=Perpustakaan');
      await page.locator('[data-campus-hotspot]').first().waitFor();
      const english = (await page.locator('#fasilitas-title').innerText()).includes('School');
      if ((language === 'en') !== english) await page.locator('header').getByRole('button',{name:language === 'en'?'Switch to English':'Switch to Indonesian',exact:true}).click();
      for (const hotspot of campusHotspots) {
        const facility = campusFacilities[hotspot.facilityId];
        await page.locator('.campus-viewport').scrollIntoViewIfNeeded();
        await page.locator(`[data-campus-hotspot="${hotspot.id}"]`).focus();
        await page.keyboard.press('Enter');
        const preview = page.locator(`[data-campus-preview="${facility.content.id}"]`);
        await preview.waitFor();
        const content = preview.locator('.campus-preview-content[data-outgoing="false"]');
        const sources = [];
        if (facility.rooms) {
          for (const room of facility.rooms) {
            await content.locator('select').selectOption(room.id);
            await page.waitForFunction(name => document.querySelector('.campus-preview-content[data-outgoing="false"] select')?.selectedOptions[0].textContent.includes(name), room.name.replace('Kelas ',''));
            sources.push(await verifyPhoto(content));
          }
        } else {
          const indicators = content.locator('[role="group"] button[aria-pressed]');
          assert.equal(await indicators.count(), facility.photos.length > 1 ? facility.photos.length : 0);
          for (let index = 0; index < facility.photos.length; index++) {
            if (facility.photos.length > 1) {
              await indicators.nth(index).click();
              await page.waitForFunction(index => Number(document.querySelector('.campus-preview-content[data-outgoing="false"] [data-photo-index]')?.dataset.photoIndex) === index, index);
            }
            sources.push(await verifyPhoto(content));
          }
          assert.equal(new Set(sources).size, facility.photos.length, `${hotspot.label}: gallery must show each supplied photo`);
        }
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth));
        if (language === 'id' && ['gor','parkiran','dlg','lapangan-apel','aula','perpustakaan'].includes(hotspot.facilityId)) await preview.screenshot({path:`${output}/${hotspot.facilityId}-${width}.png`,animations:'disabled'});
        await page.keyboard.press('Escape');
        await preview.waitFor({state:'hidden'});
        results.push({width,language,id:hotspot.id,photos:sources.length});
      }
      console.log(`PASS ${width} ${language}: all 12 hotspots, 16 classroom selections, 43 non-classroom photos, no empty slots or overflow`);
    }
  }
  assert.deepEqual(errors,[]);
  assert.deepEqual(failedImages,[]);
  await writeFile(output+'/results.json',JSON.stringify({results,errors,failedImages},null,2));
  console.log('PASS campus photo regression; no runtime or failed image responses');
} finally { await browser.close(); }
