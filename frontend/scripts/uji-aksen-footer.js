// Jalankan isi berkas ini di Console DevTools pada setiap viewport/zoom yang diuji.
(() => {
  const footer = document.querySelector('footer');
  if (!footer) throw new Error('Footer belum dimuat.');

  const accents = [...footer.querySelectorAll('.footer-accent')];
  const content = footer.querySelector('.footer-content');
  const bottomBar = footer.querySelector('.footer-bottom-bar');
  const left = footer.querySelectorAll('.footer-accent-side-left .footer-accent');
  const right = footer.querySelectorAll('.footer-accent-side-right .footer-accent');
  const bottom = footer.querySelectorAll('.footer-accent-band .footer-accent');
  if (accents.length !== 9 || left.length !== 2 || right.length !== 1 || bottom.length !== 6 || !content || !bottomBar) {
    throw new Error('Footer harus menyediakan 9 layer Figma: 2 kiri, 1 kanan, dan 6 di canvas bawah.');
  }
  if (accents.some((element) => element.querySelector('img')?.naturalWidth === 0)) {
    throw new Error('Tunggu gambar aksen selesai dimuat; periksa Network jika gagal.');
  }

  const intersects = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  const visibleBounds = (element) => {
    const bounds = element.getBoundingClientRect().toJSON();
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      const style = getComputedStyle(parent);
      const clip = parent.getBoundingClientRect();
      if (['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowX)) {
        bounds.left = Math.max(bounds.left, clip.left);
        bounds.right = Math.min(bounds.right, clip.right);
      }
      if (['hidden', 'clip', 'auto', 'scroll'].includes(style.overflowY)) {
        bounds.top = Math.max(bounds.top, clip.top);
        bounds.bottom = Math.min(bounds.bottom, clip.bottom);
      }
    }
    return bounds;
  };

  const areas = accents.map((element) => visibleBounds(element.querySelector('img')));
  const protectedAreas = [content.firstElementChild, bottomBar].map((element) => element.getBoundingClientRect());
  areas.forEach((area, index) => {
    if (area.right <= area.left || area.bottom <= area.top) {
      if (accents[index].dataset.figmaNode === '90:523') return; // Intentionally outside the original Figma canvas.
      throw new Error(`Aksen ${index + 1} hilang.`);
    }
    if (protectedAreas.some((protectedArea) => intersects(area, protectedArea))) {
      throw new Error(`Aksen ${index + 1} bertabrakan dengan konten footer.`);
    }
    if (areas.slice(index + 1).some((other) => other.right > other.left && other.bottom > other.top && intersects(area, other))) {
      throw new Error(`Aksen ${index + 1} bertabrakan dengan aksen lain.`);
    }
  });

  if (document.documentElement.scrollWidth > innerWidth) throw new Error('Halaman memiliki overflow horizontal.');
  const sectionCounts = {
    departments: 8, achievements: 4, schoolTeachers: 7,
    headmaster: 3, teachers: 3, departmentsQuiz: 6, activities: 7,
  };
  document.querySelectorAll('[data-accent-section]').forEach((layer) => {
    const images = [...layer.querySelectorAll('img')];
    const variant = layer.dataset.accentSection;
    const style = getComputedStyle(layer);
    if (images.length !== sectionCounts[variant] || style.position !== 'absolute'
      || style.pointerEvents !== 'none' || layer.getAttribute('aria-hidden') !== 'true') {
      throw new Error(`Lapisan aksen ${variant} tidak sesuai jumlah atau batas dekorasi.`);
    }
    if (images.some((image) => !image.complete || !image.naturalWidth || image.getBoundingClientRect().width <= 0)) {
      throw new Error(`Aksen ${variant} gagal dimuat atau berukuran nol.`);
    }
  });
  console.log(`Lulus: ${innerWidth}px, DPR ${devicePixelRatio}; 9 layer aksen dengan clipping Figma tanpa overlap.`);
})();
