import { Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPage';
import TentangPage from './pages/TentangPage';
import JurusanPage from './pages/JurusanPage';
import PrestasiPage from './pages/PrestasiPage';
import BkkPage from './pages/BkkPage';
import BeritaPage from './pages/BeritaPage';
import PengumumanPage from './pages/PengumumanPage';
import JurusanDetailPage from './pages/JurusanDetailPage';
import PrestasiDetailPage from './pages/PrestasiDetailPage';
import BeritaDetailPage from './pages/BeritaDetailPage';
import PengumumanDetailPage from './pages/PengumumanDetailPage';
import StelaPage from './pages/StelaPage';
import SegeraHadirPage from './pages/SegeraHadirPage';
import Login from './page/Login/Login';
import ProtectedRoute from './router/ProtectedRoute';
import DashboardPage from './pages/admin/DashboardPage';
import AdminHomePage from './pages/admin/AdminHomePage';
import AdminBeritaPage from './pages/admin/berita/BeritaPage';
import AdminPengumumanPage from './pages/admin/pengumuman/PengumumanPage';
import AdminPrestasiPage from './pages/admin/prestasi/PrestasiPage';
import AdminBkkPage from './pages/admin/bkk/BkkPage';
import PPDBPage from './pages/PPDBPage';
import AdminPPDBPage from './pages/admin/ppdb/PPDBPage';

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/jurusan" element={<JurusanPage />} />
        <Route path="/prestasi" element={<PrestasiPage />} />
        <Route path="/bkk" element={<BkkPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/pengumuman" element={<PengumumanPage />} />
        <Route path="/ppdb" element={<PPDBPage />} />

        {/* Halaman detail: isinya dicari dari slug, satu komponen per kategori. */}
        <Route path="/jurusan/:slug" element={<JurusanDetailPage />} />
        <Route path="/prestasi/:slug" element={<PrestasiDetailPage />} />
        <Route path="/berita/:slug" element={<BeritaDetailPage />} />
        <Route path="/pengumuman/:slug" element={<PengumumanDetailPage />} />

        <Route path="/stela" element={<StelaPage />} />

        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />}>
            <Route index element={<AdminHomePage />} />
            <Route path="berita" element={<AdminBeritaPage />} />
            <Route path="pengumuman" element={<AdminPengumumanPage />} />
            <Route path="prestasi" element={<AdminPrestasiPage />} />
            <Route path="bkk" element={<AdminBkkPage />} />
            <Route path="ppdb" element={<AdminPPDBPage />} />
          </Route>
        </Route>

        {/* Semua tujuan yang halamannya belum dibangun (/ppdb, /stela, /pengumuman,
            /galeri, dan seluruh halaman detail seperti /jurusan/rpl atau
            /berita/<slug>) mendarat di sini. Tambahkan route halaman aslinya
            DI ATAS baris ini saat halaman itu sudah jadi. */}
        <Route path="*" element={<SegeraHadirPage />} />
      </Routes>
    </>
  );
};

export default App;
