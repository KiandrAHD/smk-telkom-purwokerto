import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StelaWidget from '../components/stela/StelaWidget';

export default function MainLayout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* key={pathname} memaksa <main> dipasang ulang tiap pindah route, supaya
          animasi masuknya ikut jalan saat berpindah antar halaman detail yang
          memakai komponen yang sama (mis. /berita/a -> /berita/b). */}
      <main key={pathname} className="animate-masuk-halaman">
        {children}
      </main>
      <Footer />
      <StelaWidget />
    </div>
  );
}
