import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Router tidak mengembalikan posisi scroll saat berpindah halaman. Tanpa ini,
// klik dari tengah halaman mendarat di tengah halaman berikutnya.
// Perpindahan yang membawa hash dilewati supaya tautan ke section dalam satu
// halaman tetap bisa menggulir ke targetnya.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    // behavior 'instant' dipaksa karena html memakai scroll-behavior: smooth —
    // tanpa ini pindah halaman terlihat menggulir naik pelan-pelan, bukan langsung
    // mendarat di atas.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
