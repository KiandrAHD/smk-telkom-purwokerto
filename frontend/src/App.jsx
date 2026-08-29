import { useEffect } from 'react';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
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
import { PpdbProvider } from './context/PpdbContext';
import PpdbRegisterPage from './pages/ppdb/RegisterPage';
import PpdbLoginPage from './pages/ppdb/LoginPage';
import VerifyEmailPage from './pages/ppdb/VerifyEmailPage';
import RegistrationFormPage from './pages/ppdb/RegistrationFormPage';
import UploadDocumentsPage from './pages/ppdb/UploadDocumentsPage';
import SubmitSuccessPage from './pages/ppdb/SubmitSuccessPage';
import { AdminDataProvider } from './context/AdminDataContext';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import DashboardBeritaPage from './pages/dashboard/BeritaPage';
import BeritaFormPage from './pages/dashboard/BeritaFormPage';
import DashboardPPDBPage from './pages/dashboard/PPDBPage';
import PPDBDetailPage from './pages/dashboard/PPDBDetailPage';
import DashboardJurusanPage from './pages/dashboard/JurusanPage';
import DashboardPrestasiPage from './pages/dashboard/PrestasiPage';
import BKKPage from './pages/dashboard/BKKPage';
import PengaturanPage from './pages/dashboard/PengaturanPage';
import ProtectedRoute from './router/ProtectedRoute';
import PPDBPage from './pages/PPDBPage';
import NextTelPage from './pages/NextTelPage';

const PAGE_META = {
  '/': ['SMK Telkom Purwokerto', 'SMK Telkom Purwokerto, sekolah vokasi teknologi di Purwokerto.'],
  '/tentang': ['Tentang SMK Telkom Purwokerto', 'Kenali profil, visi misi, dan fasilitas SMK Telkom Purwokerto.'],
  '/jurusan': ['Jurusan SMK Telkom Purwokerto', 'Pilih program keahlian teknologi sesuai minat dan bakatmu.'],
  '/prestasi': ['Prestasi SMK Telkom Purwokerto', 'Lihat prestasi dan pencapaian siswa SMK Telkom Purwokerto.'],
  '/bkk': ['BKK SMK Telkom Purwokerto', 'Informasi lowongan kerja dan career center SMK Telkom Purwokerto.'],
  '/berita': ['Berita SMK Telkom Purwokerto', 'Berita terbaru dari SMK Telkom Purwokerto.'],
  '/pengumuman': ['Pengumuman SMK Telkom Purwokerto', 'Pengumuman resmi SMK Telkom Purwokerto.'],
  '/ppdb': ['PPDB Online SMK Telkom Purwokerto', 'Daftar PPDB online SMK Telkom Purwokerto.'],
  '/stela': ['STELA AI | SMK Telkom Purwokerto', 'Asisten informasi umum SMK Telkom Purwokerto.'],
  '/nexttel': ['NextTel AI | SMK Telkom Purwokerto', 'Cari jurusan yang sesuai dengan minatmu.'],
  '/login': ['Login Admin | SMK Telkom Purwokerto', 'Halaman login administrator website sekolah.'],
  '/dashboard': ['Dashboard Admin | SMK Telkom Purwokerto', 'Kelola konten dan data website sekolah.'],
};

const PageMetadata = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const key = Object.keys(PAGE_META).find((path) => pathname === path || (path === '/dashboard' && pathname.startsWith('/dashboard/')));
    const [title, description] = PAGE_META[key] || ['SMK Telkom Purwokerto', 'Website resmi SMK Telkom Purwokerto.'];
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <>
      <ScrollToTop />
      <PageMetadata />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/jurusan" element={<JurusanPage />} />
        <Route path="/prestasi" element={<PrestasiPage />} />
        <Route path="/bkk" element={<BkkPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/pengumuman" element={<PengumumanPage />} />
        <Route path="/ppdb" element={<PPDBPage />} />

        {/* Alur portal PPDB. PpdbProvider membungkus keenam langkah supaya isian
            formulir tetap ada saat berpindah langkah. */}
        <Route
          element={
            <PpdbProvider>
              <Outlet />
            </PpdbProvider>
          }
        >
          <Route path="/ppdb/daftar" element={<PpdbRegisterPage />} />
          <Route path="/ppdb/masuk" element={<PpdbLoginPage />} />
          <Route path="/ppdb/verifikasi" element={<VerifyEmailPage />} />
          <Route path="/ppdb/formulir" element={<RegistrationFormPage />} />
          <Route path="/ppdb/berkas" element={<UploadDocumentsPage />} />
          <Route path="/ppdb/selesai" element={<SubmitSuccessPage />} />
        </Route>

        {/* Halaman detail: isinya dicari dari slug, satu komponen per kategori. */}
        <Route path="/jurusan/:slug" element={<JurusanDetailPage />} />
        <Route path="/prestasi/:slug" element={<PrestasiDetailPage />} />
        <Route path="/berita/:slug" element={<BeritaDetailPage />} />
        <Route path="/pengumuman/:slug" element={<PengumumanDetailPage />} />

        <Route path="/stela" element={<StelaPage />} />
        <Route path="/nexttel" element={<NextTelPage />} />

        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          {/* Panel admin. AdminDataProvider dipasang di sini, bukan di main.jsx,
              supaya halaman publik tidak ikut menanggung state-nya. */}
          <Route
            path="/dashboard"
            element={
              <AdminDataProvider>
                <DashboardLayout />
              </AdminDataProvider>
            }
          >
            <Route index element={<DashboardHomePage />} />
            <Route path="berita" element={<DashboardBeritaPage />} />
            <Route path="berita/tambah" element={<BeritaFormPage />} />
            <Route path="berita/:id/edit" element={<BeritaFormPage />} />
            <Route path="ppdb" element={<DashboardPPDBPage />} />
            <Route path="ppdb/:id" element={<PPDBDetailPage />} />
            <Route path="jurusan" element={<DashboardJurusanPage />} />
            <Route path="prestasi" element={<DashboardPrestasiPage />} />
            <Route path="bkk" element={<BKKPage />} />
            <Route path="pengaturan" element={<PengaturanPage />} />
          </Route>
        </Route>

        {/* Tujuan yang belum memiliki route khusus mendarat di halaman ini. */}
        <Route path="*" element={<SegeraHadirPage />} />
      </Routes>
    </>
  );
};

export default App;
