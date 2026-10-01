import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

// Jalankan helper asli tanpa menambah export non-komponen ke modul React.
const source = await readFile(new URL('../src/components/PrestasiCarousel.jsx', import.meta.url), 'utf8');
const helpers = source.slice(source.indexOf('const getCarouselMetrics ='), source.indexOf('const PrestasiCarousel ='));
const { getCarouselMetrics, getCarouselIndex } = runInNewContext(`${helpers}\n({ getCarouselMetrics, getCarouselIndex });`);

for (const width of [390, 768, 1000, 976.8]) {
  for (const perPage of [1, 2, 4]) {
    for (const count of [1, 3, 5, 8, 9]) {
      const gap = 20;
      const card = (width - (perPage - 1) * gap) / perPage;
      const { groups, step } = getCarouselMetrics(width, card, gap, count);
      const maxScroll = Math.max(0, count * (card + gap) - gap - width);
      assert.equal(groups, Math.ceil(count / perPage));
      assert.equal(getCarouselIndex(0, maxScroll, step, groups), 0);
      assert.equal(getCarouselIndex(maxScroll, maxScroll, step, groups), groups - 1);
      for (let i = 0; i < groups; i++) {
        assert.equal(getCarouselIndex(Math.min(i * step, maxScroll), maxScroll, step, groups), i);
      }
      if (groups > 1) {
        const previous = (groups - 2) * step;
        const midpoint = (previous + maxScroll) / 2;
        assert.equal(getCarouselIndex(midpoint - 0.1, maxScroll, step, groups), groups - 2);
        assert.equal(getCarouselIndex(midpoint + 0.1, maxScroll, step, groups), groups - 1);
      }
    }
  }
}
console.log('Carousel prestasi: jumlah dot, seluruh tujuan slide, dan halaman terakhir lulus pada 1/2/4 kolom, termasuk ukuran pecahan.');
