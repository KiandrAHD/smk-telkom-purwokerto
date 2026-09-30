// Jalankan isi berkas ini di Console DevTools pada setiap viewport/zoom yang diuji.
(() => {
  const footer = document.querySelector('footer');
  if (!footer) throw new Error('Footer belum dimuat.');

  const accents = [...footer.querySelectorAll('img[alt=""]')];
  const content = footer.querySelector('.footer-content');
  const bottomBar = footer.querySelector('.footer-bottom-bar');
  if (accents.length !== 10 || !content || !bottomBar) {
    throw new Error('Sepuluh aksen dan area konten/footer bawah harus tersedia.');
  }
  if (accents.some((image) => !image.complete || image.naturalWidth === 0)) {
    throw new Error('Tunggu gambar aksen selesai dimuat; periksa Network jika gagal.');
  }

  const intersects = (a, b) => (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );

  const center = footer.getBoundingClientRect();
  const mirrorPairs = [
    ['.footer-accent-side-left', '.footer-accent-side-right', 2],
    ['.footer-accent-band > div:first-child', '.footer-accent-band > div:last-child', 3],
  ];
  mirrorPairs.forEach(([leftSelector, rightSelector, count]) => {
    const left = [...footer.querySelectorAll(`${leftSelector} img`)];
    const right = [...footer.querySelectorAll(`${rightSelector} img`)];
    if (left.length !== count || right.length !== count) {
      throw new Error(`Jumlah aksen ${leftSelector} dan ${rightSelector} tidak simetris.`);
    }
    left.forEach((image, index) => {
      const a = image.getBoundingClientRect();
      const b = right[count === 3 ? count - 1 - index : index].getBoundingClientRect();
      const differences = [
        a.left + b.right - center.left - center.right,
        a.top - b.top, a.width - b.width, a.height - b.height,
      ];
      if (differences.some((value) => Math.abs(value) > 0.5)) {
        throw new Error(`Posisi/ukuran pasangan aksen ${leftSelector} ${index + 1} tidak simetris.`);
      }
    });
    if (count === 3) {
      [left, right].forEach((images) => {
        const row = images.map((image) => image.getBoundingClientRect()).sort((a, b) => a.left - b.left);
        if (Math.abs((row[1].left - row[0].right) - (row[2].left - row[1].right)) > 0.5) {
          throw new Error('Jarak antaraksen bawah tidak merata.');
        }
      });
    }
  });

  // Ukur area gambar yang benar-benar tidak terpotong ancestor overflow.
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

  const areas = accents.map(visibleBounds);
  const protectedAreas = [content, bottomBar].map((element) => element.getBoundingClientRect());
  const chatButton = document.querySelector('button[aria-label="Buka obrolan dengan STELA"]');
  const chatArea = chatButton?.getBoundingClientRect();
  areas.forEach((area, index) => {
    if (area.right <= area.left || area.bottom <= area.top) {
      throw new Error(`Aksen ${index + 1} hilang pada lebar ${innerWidth}px.`);
    }
    const full = accents[index].getBoundingClientRect();
    if (['left', 'right', 'top', 'bottom'].some((edge) => Math.abs(area[edge] - full[edge]) > 0.5)) {
      throw new Error(`Aksen ${index + 1} terpotong pada lebar ${innerWidth}px.`);
    }
    if (protectedAreas.some((protectedArea) => intersects(area, protectedArea))) {
      throw new Error(`Aksen ${index + 1} bertabrakan dengan konten footer.`);
    }
    if (areas.slice(index + 1).some((other) => intersects(area, other))) {
      throw new Error(`Aksen ${index + 1} bertabrakan dengan aksen lain.`);
    }
    if (chatArea && accents[index].closest('.footer-accent-band') && intersects(area, chatArea)) {
      throw new Error(`Aksen bawah ${index + 1} tertutup tombol STELA.`);
    }
  });

  if (document.documentElement.scrollWidth > innerWidth) {
    throw new Error('Halaman memiliki overflow horizontal.');
  }
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
    if (images.some((image) => !image.complete || !image.naturalWidth
      || image.getBoundingClientRect().width <= 0)) {
      throw new Error(`Aksen ${variant} gagal dimuat atau berukuran nol.`);
    }
    if (images.some((image) => intersects(visibleBounds(image), footer.getBoundingClientRect()))) {
      throw new Error(`Lapisan aksen ${variant} keluar ke footer.`);
    }
  });
  console.log(`Lulus: ${innerWidth}px, DPR ${devicePixelRatio}; 10 aksen simetris, utuh tanpa overlap.`);
})();
