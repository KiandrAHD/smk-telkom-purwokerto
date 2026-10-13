/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:4174';
const output = process.env.QA_OUTPUT || '../outputs/refinements-2026-10-14';
await mkdir(output, { recursive: true });
const manifest = JSON.parse(await readFile('src/data/classroomPhotoManifest.json', 'utf8'));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'no-preference' });
await context.route('**/rest/v1/**', route => route.fulfill({ contentType: 'application/json', body: '[]' }));
const page = await context.newPage();
const errors = [], failedAssets = [], results = { rooms: [], responsive: [], teachers: [] };
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400 && response.url().includes('/assets/')) failedAssets.push(response.url()); });
const card = () => page.locator('[data-campus-preview]');
const currentContent = () => card().locator('.campus-preview-content[data-outgoing="false"]');
const gallery = () => currentContent().locator('[data-facility-carousel]');
const pan = () => page.locator('.campus-viewport').evaluate(node => Number(node.dataset.pan));
const close = async () => {
  await card().getByRole('button', { name: /Tutup informasi fasilitas|Close.*facilit/i }).click();
  await card().waitFor({ state: 'hidden' });
};
async function openHotspot(id) {
  const pin = page.locator(`[data-campus-hotspot="${id}"]`);
  await pin.focus();
  await pin.press('Enter');
  await card().waitFor();
  await page.waitForTimeout(300);
}
async function waitPhoto(name, index = 0) {
  const photos = manifest[name];
  if (!photos) {
    await currentContent().locator('.campus-photo-deck:not([data-motion-outgoing]) .campus-photo-main [data-campus-photo-fallback]').waitFor();
    assert.equal(await currentContent().getByRole('button', { name: /Foto fasilitas (sebelumnya|berikutnya)/ }).count(), 0);
    return;
  }
  await page.waitForFunction(({ count, index }) => {
    const root = document.querySelector('.campus-preview-content[data-outgoing="false"] [data-facility-carousel]');
    return root?.querySelectorAll('[aria-pressed]').length === count && Number(root.dataset.photoIndex) === index;
  }, { count: photos.length, index });
  const image = currentContent().locator('.campus-photo-deck:not([data-motion-outgoing]) .campus-photo-main img');
  await image.evaluate(node => node.decode());
  assert.ok((await image.getAttribute('src')).includes(photos[index].id), `${name}: photo must match the selected room and slide`);
}
try {
  await page.goto(base + '/fasilitas');
  await page.locator('.campus-viewport').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.campus-viewport')?.dataset.mapReady === 'true');
  await openHotspot('gedung-a');
  await waitPhoto('Kelas A 1.4');
  assert.equal(await page.locator('#campus-preview-title').count(), 1);
  assert.equal(await card().getAttribute('aria-modal'), 'false');
  const beforePan = await pan();
  await currentContent().getByRole('button', { name: 'Foto fasilitas berikutnya', exact: true }).click();
  await waitPhoto('Kelas A 1.4', 1);
  await page.waitForTimeout(600);
  await currentContent().getByRole('button', { name: 'Foto fasilitas sebelumnya', exact: true }).click();
  await waitPhoto('Kelas A 1.4', 0);
  await page.waitForTimeout(600);
  await currentContent().getByRole('button', { name: 'Lihat foto 3 untuk Kelas A 1.4', exact: true }).click();
  await waitPhoto('Kelas A 1.4', 2);
  await page.waitForTimeout(600);
  assert.equal(await currentContent().locator('[aria-pressed="true"]').count(), 1);
  await currentContent().getByRole('button', { name: 'Foto fasilitas berikutnya', exact: true }).click({ clickCount: 5 });
  await page.waitForTimeout(900);
  assert.equal(await gallery().locator('[data-motion-outgoing]').count(), 0);
  assert.equal(await currentContent().locator('[aria-pressed="true"]').count(), 1);
  assert.ok(Number(await gallery().getAttribute('data-photo-index')) < manifest['Kelas A 1.4'].length);
  assert.ok(Math.abs(await pan() - beforePan) < 1, 'Photo carousel must not move the map.');
  await close();
  await page.waitForTimeout(1000);
  assert.equal(await card().count(), 0);
  await page.locator('.campus-viewport').scrollIntoViewIfNeeded();
  const bounds = await page.locator('.campus-viewport').boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height * .85);
  await page.mouse.down(); await page.mouse.move(bounds.x + bounds.width / 2 - 90, bounds.y + bounds.height * .85, { steps: 8 }); await page.mouse.up();
  await page.locator('.campus-slider').press('End');
  await page.waitForTimeout(400);
  assert.equal(await card().count(), 0, 'Dragging or using the slider cannot reopen a closed card.');
  await openHotspot('gedung-b');
  await waitPhoto('Kelas B 1.4');
  await card().getByRole('button', { name: 'Tutup informasi fasilitas', exact: true }).click();
  await openHotspot('gedung-c');
  await page.waitForTimeout(350);
  assert.equal(await card().getAttribute('data-campus-preview'), 'kelas-c', 'An old close timer cannot hide a newly selected hotspot.');
  assert.equal(await page.locator('#campus-preview-title').count(), 1);
  for (const [id, building] of [['gedung-a','A'],['gedung-b','B'],['gedung-c','C'],['gedung-d-1','D']]) {
    await openHotspot(id);
    const select = currentContent().getByLabel('Pilih ruang kelas');
    const options = await select.locator('option').evaluateAll(nodes => nodes.map(node => ({ id: node.value, name: node.textContent })));
    assert.equal(options.length, 4);
    for (const option of options) {
      assert.ok(option.name.startsWith('Kelas ' + building + ' '));
      await select.selectOption(option.id);
      await waitPhoto(option.name);
      assert.equal(await gallery().getAttribute('data-photo-index'), '0');
      results.rooms.push({ name: option.name, photos: manifest[option.name]?.length || 0 });
    }
  }
  assert.equal(results.rooms.filter(room => room.photos > 0).length, 13);
  assert.ok(manifest['Kelas C 2.2'].every(photo => photo.source.endsWith('.jpeg')));
  await openHotspot('perpustakaan');
  assert.equal(await currentContent().getByRole('button', { name: /Foto fasilitas (sebelumnya|berikutnya)/ }).count(), 0);
  await currentContent().locator('.campus-photo-main img').evaluate(node => node.decode());
  await openHotspot('aula');
  await currentContent().locator('.campus-photo-main [data-campus-photo-fallback]').waitFor();
  await close();
  await page.getByRole('button', { name: 'Kelas', exact: true }).click();
  await page.locator('[data-facility-card]').filter({ has: page.getByRole('heading', { name: 'Kelas A 3.4', exact: true }) }).getByRole('button').click();
  await page.getByRole('button', { name: 'Lihat lokasi di peta', exact: true }).click();
  await card().waitFor();
  await waitPhoto('Kelas A 3.4');
  assert.match(await currentContent().getByLabel('Pilih ruang kelas').locator('option:checked').innerText(), /A 3.4/);
  await close();
  await page.getByRole('button', { name: 'Switch to English' }).click();
  await page.waitForTimeout(400);
  assert.equal(await card().count(), 0, 'Changing language cannot replay a consumed map request.');
  await page.getByRole('button', { name: 'Switch to Indonesian' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [1920,1440,1024,768,390,360]) for (const language of ['id','en']) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(language => sessionStorage.setItem('smk-telkom-language', language), language);
    await page.goto(base + '/fasilitas');
    await page.locator('.campus-viewport').scrollIntoViewIfNeeded();
    await page.waitForFunction(() => document.querySelector('.campus-viewport')?.dataset.mapReady === 'true');
    await openHotspot('gedung-a');
    await page.waitForTimeout(250);
    const layout = await page.evaluate(() => {
      const card = document.querySelector('[data-campus-preview]');
      const content = card.querySelector('[data-outgoing="false"]');
      const map = document.querySelector('.campus-viewport');
      const stage = document.querySelector('[data-campus-stage]');
      const motifs = [...document.querySelectorAll('[data-campus-motif]')];
      return { overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        columns: getComputedStyle(content).gridTemplateColumns.split(' ').length,
        mapWidth: map.clientWidth, mapHeight: map.clientHeight, stageWidth: stage.getBoundingClientRect().width,
        mirror: getComputedStyle(motifs[1]).scale,
        sameMotif: motifs[0].src === motifs[1].src,
        sameSize: Math.abs(motifs[0].getBoundingClientRect().width - motifs[1].getBoundingClientRect().width) < 1,
        cardAnimation: getComputedStyle(card).animationName,
        headingFont: getComputedStyle(document.querySelector('#campus-preview-title')).fontFamily,
      };
    });
    assert.equal(layout.overflow, false);
    assert.equal(layout.columns, width >= 768 ? 2 : 1);
    assert.ok(layout.mapWidth <= 1280 && layout.mapHeight <= 550 && layout.stageWidth <= 1600.1);
    assert.equal(layout.sameMotif, true); assert.equal(layout.sameSize, true);
    assert.equal(layout.mirror, '-1 1');
    assert.equal(layout.cardAnimation, 'none');
    assert.match(layout.headingFont, /^Poppins/);
    await card().screenshot({ path: `${output}/facility-card-${width}-${language}.png` });
    await close();
    await page.locator('#school-tour').screenshot({ path: `${output}/school-tour-${width}-${language}.png` });
    results.responsive.push({ width, language, ...layout });
  }
  // Real touch events exercise swipe direction and preserve native vertical scrolling.
  const touchContext = await browser.newContext({ viewport: { width:390, height:844 }, isMobile:true, hasTouch:true, reducedMotion:'reduce' });
  const touch = await touchContext.newPage();
  await touch.goto(base + '/fasilitas');
  await touch.locator('.campus-viewport').scrollIntoViewIfNeeded();
  await touch.waitForFunction(() => document.querySelector('.campus-viewport')?.dataset.mapReady === 'true');
  await touch.locator('[data-campus-hotspot="gedung-a"]').focus(); await touch.keyboard.press('Enter');
  await touch.waitForFunction(() => document.querySelector('[data-facility-carousel]')?.querySelectorAll('[aria-pressed]').length > 1);
  const deck = touch.locator('.campus-gallery-viewport'); await deck.scrollIntoViewIfNeeded();
  const touchPan = await touch.locator('.campus-viewport').getAttribute('data-pan');
  const box = await deck.boundingBox(), x = box.x + box.width * .7, y = box.y + box.height / 2;
  const cdp = await touchContext.newCDPSession(touch);
  await cdp.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[{x,y}] });
  for (let step=1;step<=8;step++) await cdp.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[{x:x-step*12,y}] });
  await cdp.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
  await touch.waitForFunction(() => document.querySelector('[data-facility-carousel]').dataset.photoIndex === '1');
  assert.equal(await touch.locator('.campus-viewport').getAttribute('data-pan'), touchPan, 'Photo swipe cannot move the campus map.');
  const pageY = await touch.evaluate(() => window.scrollY);
  await cdp.send('Input.dispatchTouchEvent', { type:'touchStart', touchPoints:[{x,y}] });
  for (let step=1;step<=8;step++) await cdp.send('Input.dispatchTouchEvent', { type:'touchMove', touchPoints:[{x,y:y-step*12}] });
  await cdp.send('Input.dispatchTouchEvent', { type:'touchEnd', touchPoints:[] });
  await touch.waitForFunction(before => window.scrollY > before + 20, pageY);
  assert.equal(await touch.locator('[data-facility-carousel]').getAttribute('data-photo-index'),'1');
  await cdp.detach(); await touchContext.close();
  await page.setViewportSize({ width:1440, height:1000 });
  await page.evaluate(() => sessionStorage.setItem('smk-telkom-language','id'));
  await page.goto(base + '/profil-sekolah');
  await page.locator('#guru').scrollIntoViewIfNeeded();
  const seen = [];
  for (let index=0;index<4;index++) {
    await page.locator('#guru [data-sliding-page] img').evaluateAll(nodes => Promise.all(nodes.map(node => node.decode())));
    const teachers = await page.locator('#guru [data-sliding-page] article').evaluateAll(nodes => nodes.map(node => ({ name:node.querySelector('h3').textContent.trim(), image:node.querySelector('img').src })));
    seen.push(...teachers);
    if(index<3){await page.getByRole('button',{name:'Guru berikutnya',exact:true}).click();await page.waitForFunction(() => !document.querySelector('#guru [data-motion-outgoing]'));}
  }
  assert.equal(seen.length,13);
  assert.equal(new Set(seen.map(teacher=>teacher.name)).size,13);
  assert.equal(seen.filter(teacher=>teacher.image.endsWith('.webp')).length,9);
  assert.match(seen[12].name,/Reza Aditya/);
  results.teachers = seen;
  await page.getByRole('button',{name:'Guru sebelumnya',exact:true}).click();await page.waitForTimeout(650);
  await page.locator('#guru').screenshot({path:`${output}/teachers-after.png`});
  assert.deepEqual(errors,[]);assert.deepEqual(failedAssets,[]);
  await writeFile(`${output}/refinement-results.json`,JSON.stringify({ ...results,errors,failedAssets },null,2));
  console.log(JSON.stringify({ rooms:results.rooms.length,verifiedRooms:13,responsiveCases:results.responsive.length,teachers:seen.length,swipe:'pass',errors,failedAssets },null,2));
} finally {
  await browser.close();
}
