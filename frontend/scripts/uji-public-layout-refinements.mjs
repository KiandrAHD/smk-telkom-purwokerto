import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
const layout = read('layouts/MainLayout.jsx');
const landing = read('pages/LandingPage.jsx');
const facilities = read('pages/FasilitasPage.jsx');
const styles = read('styles/fasilitas.css');
const hero = read('styles/hero.css');

assert.equal((layout.match(/<WaveMarquee\s*\/>/g) || []).length, 1);
assert.equal((layout.match(/<InnovationReveal\s*\/>/g) || []).length, 1);
assert.ok(layout.indexOf('{opening}') < layout.indexOf('<WaveMarquee />'));
assert.ok(layout.indexOf('{content}') < layout.indexOf('<InnovationReveal />'));
assert.doesNotMatch(landing, /<WaveMarquee|<InnovationReveal/);
assert.match(facilities, /<MainLayout>\s*<section/);
assert.doesNotMatch(facilities, /filterWidths|rotate-180/);
assert.match(styles, /repeat\(7, minmax\(0, 1fr\)\)/);
assert.match(styles, /100% auto repeat-y/);
assert.match(styles, /scaleX\(-1\)/);
assert.match(hero, /\.hero-panel--departments \.hero-image\s*\{\s*mask-image: linear-gradient/);
const profileHero = read('components/tentang/TentangHeroSection.jsx');
assert.doesNotMatch(profileHero, /lg:top-1\/2|lg:-translate-y-1\/2/);
assert.match(read('components/HeroCarousel.css'), /\.hero-profile-crop \{ position: absolute; inset: 0; width: 100%; height: 100%;/);
const profile = read('pages/TentangPage.jsx');
assert.match(profile, /<>\s*<TentangHeroSection\s*\/>\s*<TentangStatsSection\s*\/>\s*<\/>/);
assert.doesNotMatch(read('components/RibbonDivider.jsx'), /MarqueeBadge|beranda-ribbon-track/);
assert.match(read('components/RibbonDivider.jsx'), /h-full w-full select-none object-cover/);
assert.match(read('pages/JurusanPage.jsx'), /<JurusanListSection\s*\/>\s*<\/Reveal>\s*<RibbonDivider className="min-h-12 sm:min-h-16"\s*\/>\s*<Reveal>\s*<JurusanQuizSection/);
for (const name of ['Berita', 'Bkk', 'Prestasi', 'Pengumuman', 'Jurusan', 'JurusanDetail', 'Tentang', 'Kalender', 'Spmb', 'Ekstrakurikuler', 'Guru', 'Fasilitas']) {
  assert.doesNotMatch(read(`pages/${name}Page.jsx`), /<RibbonDivider animated/);
}
for (const name of ['jurusan/Jurusan', 'prestasi/Prestasi', 'bkk/Bkk', 'pengumuman/Pengumuman']) {
  assert.match(read(`components/${name}HeroSection.jsx`), /<HeroStatsBar items=/);
}
assert.match(read('components/HeroQuickAccess.jsx'), /hero-floating hero-floating--quick/);
assert.match(read('components/HeroSection.jsx'), /<HeroQuickAccess links=/);
for (const path of ['components/berita/BeritaHeroSection.jsx', 'pages/KalenderPage.jsx', 'pages/EkstrakurikulerPage.jsx', 'pages/GuruPage.jsx']) {
  assert.match(read(path), /<\/div><\/PageHeroCarousel>\s*<HeroQuickAccess\s*\/>/);
}
assert.match(facilities, /hero-floating hero-floating--quick/);
assert.match(read('pages/GuruPage.jsx'), /hero-panel hero-grid hero-panel--floating/);
assert.match(hero, /\.school-hero--teachers \{ --hero-height: 36rem; \}/);
console.log('Public layout refinements: one wave, no legacy marquee, preserved floating cards, hero fade, filters and mirrored chains passed.');
