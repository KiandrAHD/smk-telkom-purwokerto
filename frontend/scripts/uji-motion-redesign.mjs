/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.QA_URL || 'http://127.0.0.1:5173';
const output = process.env.QA_OUTPUT || '../outputs/motion-redesign-2026-10-14';
const routes = ['/', '/jurusan', '/prestasi', '/fasilitas', '/profil-sekolah', '/bkk', '/berita', '/pengumuman', '/profil-sekolah/guru', '/ekstrakurikuler', '/kalender', '/spmb', ...['rpl', 'pg', 'tkj', 'tjat'].map(id => `/jurusan/${id}`)];
const baseline = process.argv.includes('--baseline');
const autoplay = process.argv.includes('--autoplay');
const originals = baseline ? [] : JSON.parse(await readFile(new URL('./fixtures/hero-geometry.json', import.meta.url), 'utf8'));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [], errors = [];
await mkdir(output, { recursive: true });
try {
  if (autoplay) {
    await Promise.all(routes.map(async route => {
      const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base + route, { waitUntil: 'domcontentloaded' });
      const root = page.locator('[data-hero-carousel]'); await root.waitFor();
      await root.scrollIntoViewIfNeeded();
      const count = await page.locator('[data-hero-slide]').count();
      const height = (await root.boundingBox()).height;
      for (let turn = 1; turn <= count * 3; turn++) {
        await page.waitForFunction(index => document.querySelector('[data-hero-carousel]')?.dataset.heroIndex === String(index), turn % count, { timeout: 15000 });
        assert.ok(Math.abs((await root.boundingBox()).height - height) < 1, `Autoplay stable height ${route}`);
      }
      results.push({ route, cycles: 3, transitions: count * 3, height });
      console.log(`Autoplay 3 cycles ${route}`); await page.close();
    }));
  } else await Promise.all([1440, 1024, 768, 390, 320].map(async width => {
    const page = await browser.newPage({ viewport: { width, height: 1100 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => errors.push(error.message));
    for (const route of routes) {
      for (const language of baseline ? ['id'] : ['id', 'en']) {
      await page.goto(base + route, { waitUntil: 'domcontentloaded' });
      await page.evaluate(language => sessionStorage.setItem('smk-telkom-language', language), language);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.locator('.school-hero .hero-panel').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      const record = await page.locator('.school-hero').evaluate(section => {
        const panel = section.querySelector('.hero-panel'), rect = panel.getBoundingClientRect();
        return { width: rect.width, height: rect.height, heading: panel.querySelector('h1').textContent, overflow: document.documentElement.scrollWidth > window.innerWidth };
      });
      if (!baseline) {
        assert.equal(await page.locator('[data-hero-carousel]').count(), 1, `Shared carousel ${route}`);
        assert.equal(record.overflow, false, `No overflow ${route} ${width}`);
        const root = page.locator('[data-hero-carousel]');
        assert.equal(await root.locator('button').count(), 0, 'No hero arrow/pause controls');
        const height = (await root.boundingBox()).height, count = await page.locator('[data-hero-slide]').count();
        if (language === 'id') {
          const original = originals.find(item => item.route === route && item.viewport === width);
          assert.ok(Math.abs(record.width - original.width) <= 2, 'Opening hero width preserved');
          assert.ok(Math.abs(record.height - original.height) <= 2, `Opening hero height preserved ${route} ${width}: ${record.height} vs ${original.height}`);
        }
        const slides = [];
        await root.locator('img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode(); })));
        for (let index = 0; index < count; index++) {
          const metrics = await page.locator('[data-hero-slide][data-active="true"]').evaluate(panel => {
            const box = panel.getBoundingClientRect(), copy = panel.querySelector('.hero-copy').getBoundingClientRect();
            const text = [...panel.querySelectorAll('.hero-copy h1,.hero-copy p,.hero-copy a,.hero-copy input')].map(element => {
              const rect = element.getBoundingClientRect();
              return { text: element.textContent, inside: rect.right <= copy.right + 1 && rect.bottom <= box.bottom + 1 && rect.top >= box.top - 1 };
            });
            const images = [...panel.querySelectorAll('.hero-image,.detail-hero-photo,.hero-background > img')];
            const crops = [...panel.querySelectorAll('.hero-profile-crop,.hero-carousel-profile-crop')].map(crop => {
              const rect = crop.getBoundingClientRect(), parent = crop.parentElement.getBoundingClientRect();
              return rect.top >= parent.top - 1 && rect.bottom <= parent.bottom + 1 && rect.left >= parent.left - 1 && rect.right <= parent.right + 1;
            });
            return { text, crops, images: images.map(img => ({ fit: getComputedStyle(img).objectFit, sameRatio: Math.abs(img.clientWidth / img.clientHeight - img.naturalWidth / img.naturalHeight) < 0.01, valid: img.complete && img.naturalWidth > 0 })), hrefs: [...panel.querySelectorAll('a')].map(a => a.getAttribute('href')) };
          });
          assert.ok(metrics.text.every(item => item.inside), `Text stays inside ${route} ${width} ${language} slide ${index}: ${JSON.stringify(metrics.text)}`);
          assert.ok(metrics.images.every(img => img.valid && (img.fit === 'contain' || img.sameRatio)), `Uncropped hero images ${route} ${index}`);
          assert.ok(metrics.crops.every(Boolean), `Crop stays inside artwork ${route} ${width} ${language} ${index}`);
          await page.waitForFunction(() => [...document.querySelectorAll('[data-hero-slide]')].filter(panel => !panel.inert && getComputedStyle(panel).visibility === 'visible').length === 1);
          assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1, `One accessible heading ${route} ${width} ${language} ${index}`);
          assert.equal(await root.locator('[inert]').count(), count - 1);
          assert.ok(Math.abs((await root.boundingBox()).height - height) < 1, 'All slides keep height');
          if (width === 1440 || width === 390) await page.screenshot({ path: `${output}/${route.replaceAll('/', '_') || 'home'}-${width}-${language}-${index}.png` });
          slides.push(metrics);
          await root.press('ArrowRight');
          await page.waitForFunction(next => document.querySelector('[data-hero-carousel]').dataset.heroIndex === String(next), (index + 1) % count);
        }
        for (let turn = 1; turn <= count * 3; turn++) {
          await root.press('ArrowLeft');
          await page.waitForFunction(next => document.querySelector('[data-hero-carousel]').dataset.heroIndex === String(next), (count - turn % count) % count);
        }
        record.slides = slides;
        const quick = page.locator('[data-facilities-quick-access] a');
        if (await quick.count()) assert.ok(await quick.evaluateAll(links => links.every(link => link.getBoundingClientRect().height >= 44)), 'Facility quick access stays touch friendly');
        // Same text/icons/spacing on both halves prevents an empty seam at wraparound.
        const marquee = page.locator('[data-hero-marquee]');
        if (await marquee.count()) {
          const groups = marquee.locator('.beranda-ribbon-group');
          assert.equal(await groups.nth(0).innerHTML(), await groups.nth(1).innerHTML());
          assert.equal(await marquee.locator('.beranda-ribbon-flower').count(), 0);
        }
      }
      results.push({ route, viewport: width, language, ...record });
      }
    }
    console.log(`Responsive ${width} complete`);
    await page.close();
  }));
  assert.deepEqual(errors, []);
  await writeFile(`${output}/${baseline ? 'baseline' : autoplay ? 'autoplay' : 'responsive'}.json`, JSON.stringify(results, null, 2));
  console.log(`${baseline ? 'Baseline' : 'Responsive'}: ${results.length} hero checks`);
} finally { await browser.close(); }
