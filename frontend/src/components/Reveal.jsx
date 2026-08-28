import { useEffect, useRef, useState } from 'react';

// Pembungkus "muncul saat discroll". Memakai IntersectionObserver bawaan browser
// supaya tidak perlu pustaka animasi tambahan, dan observernya langsung dilepas
// begitu elemen tampil — halaman panjang tidak meninggalkan puluhan pengamat.
//
// Jeda antar kartu diatur pemanggil lewat utility Tailwind (`delay-100`,
// `delay-200`, ...) yang dioper via className, jadi tidak ada style inline.
const Reveal = ({ children, className = '', as: Tag = 'div' }) => {
  const ref = useRef(null);
  const [tampil, setTampil] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    // Elemen yang sudah kelihatan sejak awal (hero) tidak boleh menunggu scroll.
    const observer = new IntersectionObserver(
      ([entri]) => {
        if (!entri.isIntersecting) return;
        setTampil(true);
        observer.disconnect();
      },
      // Margin bawah negatif: animasi baru jalan setelah elemennya benar-benar
      // masuk layar, bukan saat ujung atasnya baru menyentuh tepi bawah.
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${tampil ? 'visible' : ''} ${className}`}>
      {children}
    </Tag>
  );
};

export default Reveal;
