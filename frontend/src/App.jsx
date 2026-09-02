import { useEffect } from 'react';
import { Routes, Route, useLocation, Outlet, Navigate, useParams } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPage';
import ProfileSekolahPage from './pages/TentangPage';
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
import DetailPelengkapPage from './pages/DetailPelengkapPage';
import KoleksiPage from './pages/KoleksiPage';
import GaleriPage from './pages/GaleriPage';
import PanduanPage from './pages/PanduanPage';
import JurusanFaqPage from './pages/JurusanFaqPage';
import JurusanPerbandinganPage from './pages/JurusanPerbandinganPage';
import KetentuanPpdbPage from './pages/KetentuanPpdbPage';
import LupaSandiPage from './pages/ppdb/LupaSandiPage';
import DokumenPesertaPage from './pages/ppdb/DokumenPesertaPage';
import SegeraHadirPage from './pages/SegeraHadirPage';
import Login from './page/Login/Login';
import { PpdbProvider } from './context/PpdbContext';
import PpdbRegisterPage from './pages/ppdb/RegisterPage';
import PpdbLoginPage from './pages/ppdb/LoginPage';
import VerifyEmailPage from './pages/ppdb/VerifyEmailPage';
import RegistrationFormPage from './pages/ppdb/RegistrationFormPage';
import UploadDocumentsPage from './pages/ppdb/UploadDocumentsPage';
import SubmitSuccessPage from './pages/ppdb/SubmitSuccessPage';
import PpdbStatusPage from './pages/ppdb/PpdbStatusPage';
import { AdminDataProvider } from './context/AdminDataContext';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import DashboardJurusanPage from './pages/dashboard/JurusanPage';
import PengaturanPage from './pages/dashboard/PengaturanPage';
import AdminBeritaPage from './pages/admin/berita/BeritaPage';
import AdminPengumumanPage from './pages/admin/pengumuman/PengumumanPage';
import AdminPrestasiPage from './pages/admin/prestasi/PrestasiPage';
import AdminBkkPage from './pages/admin/bkk/BkkPage';
import AdminPpdbPage from './pages/admin/ppdb/PPDBPage';
import ProtectedRoute from './router/ProtectedRoute';
import NextTelPage from './pages/NextTelPage';

const PAGE_META = {
  '/': ['SMK Telkom Purwokerto', 'SMK Telkom Purwokerto, sekolah vokasi teknologi di Purwokerto.'],
  '/profil-sekolah': ['Profil Sekolah | SMK Telkom Purwokerto', 'Kenali profil, visi misi, dan fasilitas SMK Telkom Purwokerto.'],
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

const LegacyProfileGuruRedirect = () => {
  const { slug } = useParams();
  return <Navigate to={`/profil-sekolah/guru/${slug}`} replace />;
};

const App = () => {
  return (
    <>
      <ScrollToTop />
      <PageMetadata />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profil-sekolah" element={<ProfileSekolahPage />} />
        <Route path="/tentang" element={<Navigate to="/profil-sekolah" replace />} />
        <Route path="/jurusan" element={<JurusanPage />} />
        <Route path="/prestasi" element={<PrestasiPage />} />
        <Route path="/bkk" element={<BkkPage />} />
        <Route path="/berita" element={<BeritaPage />} />
        <Route path="/pengumuman" element={<PengumumanPage />} />
        {/* Delapan tautan di seluruh situs (footer, CTA, hero Tentang/Jurusan/
            Pengumuman) masih menunjuk ke /ppdb. Daripada menyunting satu per satu
            dan berisiko ada yang terlewat, rutenya sendiri yang dialihkan ke
            portal baru — jadi tautan lama maupun yang dibuat nanti sama-sama
            mendarat di desain terbaru. `replace` dipakai supaya alamat lama tidak
            tertinggal di riwayat dan menjebak tombol Back. */}
        <Route path="/ppdb" element={<Navigate to="/ppdb/masuk" replace />} />

        {/* Halaman pelengkap. Slug-nya mengikuti hasil slugify() pada kartu
            asal, karena tautannya dirakit dari judul kartu. */}
        <Route path="/galeri" element={<GaleriPage />} />
        <Route path="/galeri/:slug" element={<DetailPelengkapPage jenis="galeri" />} />
        <Route path="/berita/agenda/:slug" element={<DetailPelengkapPage jenis="agenda" />} />
        <Route path="/bkk/panduan" element={<PanduanPage />} />
        <Route path="/bkk/panduan/:slug" element={<DetailPelengkapPage jenis="panduan" />} />
        <Route path="/bkk/pkl/:slug" element={<DetailPelengkapPage jenis="pkl" />} />
        <Route path="/bkk/roadmap/:slug" element={<DetailPelengkapPage jenis="roadmap" />} />
        <Route path="/jurusan/faq" element={<JurusanFaqPage />} />
        <Route path="/jurusan/perbandingan" element={<JurusanPerbandinganPage />} />
        <Route path="/jurusan/project/:slug" element={<DetailPelengkapPage jenis="project" />} />
        <Route path="/profil-sekolah/guru/:slug" element={<DetailPelengkapPage jenis="guru" />} />
        <Route path="/tentang/guru/:slug" element={<LegacyProfileGuruRedirect />} />
        <Route path="/ketentuan-ppdb" element={<KetentuanPpdbPage />} />
        <Route path="/lupa-sandi" element={<LupaSandiPage />} />

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
          <Route path="/ppdb/status" element={<PpdbStatusPage />} />
          <Route path="/ppdb/dokumen-peserta" element={<DokumenPesertaPage />} />
        </Route>

        {/* Halaman detail: isinya dicari dari slug, satu komponen per kategori. */}
        <Route path="/jurusan/:slug" element={<JurusanDetailPage />} />
        {/* Halaman "Lihat Semua". WAJIB berada sebelum rute :slug di bawah:
            tanpa ini /pengumuman/populer cocok dengan /pengumuman/:slug dan
            "populer" dicari sebagai slug artikel -- halaman jadi kosong. */}
        <Route path="/pengumuman/populer" element={<KoleksiPage jenis="pengumuman-populer" />} />
        <Route path="/pengumuman/semua" element={<KoleksiPage jenis="pengumuman-semua" />} />
        <Route path="/pengumuman/timeline" element={<KoleksiPage jenis="pengumuman-timeline" />} />
        <Route path="/pengumuman/informasi-penting" element={<KoleksiPage jenis="pengumuman-informasi-penting" />} />
        <Route path="/berita/trending" element={<KoleksiPage jenis="berita-trending" />} />
        <Route path="/berita/agenda" element={<KoleksiPage jenis="berita-agenda" />} />
        <Route path="/prestasi/galeri" element={<KoleksiPage jenis="prestasi-galeri" />} />

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
            <Route path="berita" element={<AdminBeritaPage />} />
            <Route path="berita/tambah" element={<Navigate to="/dashboard/berita" replace />} />
            <Route path="berita/:id/edit" element={<Navigate to="/dashboard/berita" replace />} />
            <Route path="pengumuman" element={<AdminPengumumanPage />} />
            <Route path="ppdb" element={<AdminPpdbPage />} />
            <Route path="ppdb/:id" element={<Navigate to="/dashboard/ppdb" replace />} />
            <Route path="jurusan" element={<DashboardJurusanPage />} />
            <Route path="prestasi" element={<AdminPrestasiPage />} />
            <Route path="bkk" element={<AdminBkkPage />} />
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
