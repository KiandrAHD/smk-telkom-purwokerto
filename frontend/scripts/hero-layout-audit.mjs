// In a Vite browser console: (await import('/scripts/hero-layout-audit.mjs')).auditHeroLayout(document)
export function auditHeroLayout(document) {
  const view = document.defaultView;
  const issues = [];
  const slides = [...document.querySelectorAll('[data-hero-slide]')];
  for (const slide of slides) {
    const index = slide.getAttribute('data-hero-slide');
    const panel = slide.firstElementChild.getBoundingClientRect();
    for (const node of slide.querySelectorAll('.hero-copy h1,.hero-copy h2,.hero-copy p,.hero-copy a')) {
      const bounds = node.getBoundingClientRect();
      if (bounds.top < panel.top - 2 || bounds.bottom > panel.bottom + 2) issues.push({ index, kind: 'copy-clipped', text: node.textContent });
    }
    for (const image of slide.querySelectorAll('.hero-media > .hero-image')) {
      if (!image.naturalWidth) { issues.push({ index, kind: 'image-not-loaded' }); continue; }
      if (view.innerWidth < 1024 || image.closest('.hero-media--photo')) continue;
      const bounds = image.getBoundingClientRect();
      const paintedHeight = Math.min(bounds.height, bounds.width * image.naturalHeight / image.naturalWidth);
      if (bounds.height - paintedHeight > 2) issues.push({ index, kind: 'top-letterbox', gap: bounds.height - paintedHeight });
    }
  }
  if (document.documentElement.scrollWidth > view.innerWidth) issues.push({ kind: 'page-horizontal-overflow' });
  return { path: view.location.pathname, language: document.documentElement.lang, width: view.innerWidth, slides: slides.length, issues };
}
