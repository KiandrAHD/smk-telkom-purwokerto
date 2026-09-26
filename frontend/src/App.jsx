import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Outlet, Navigate, useParams } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import LandingPage from './pages/LandingPage';
const ProfileSekolahPage = lazy(() => import('./pages/TentangPage'));
const JurusanPage = lazy(() => import('./pages/JurusanPage'));
const PrestasiPage = lazy(() => import('./pages/PrestasiPage'));
const BkkPage = lazy(() => import('./pages/BkkPage'));
const BeritaPage = lazy(() => import('./pages/BeritaPage'));
const PengumumanPage = lazy(() => import('./pages/PengumumanPage'));
const JurusanDetailPage = lazy(() => import('./pages/JurusanDetailPage'));
const PrestasiDetailPage = lazy(() => import('./pages/PrestasiDetailPage'));
const BeritaDetailPage = lazy(() => import('./pages/BeritaDetailPage'));
const PengumumanDetailPage = lazy(() => import('./pages/PengumumanDetailPage'));
const StelaPage = lazy(() => import('./pages/StelaPage'));
const DetailPelengkapPage = lazy(() => import('./pages/DetailPelengkapPage'));
const KoleksiPage = lazy(() => import('./pages/KoleksiPage'));
const GaleriPage = lazy(() => import('./pages/GaleriPage'));
const PanduanPage = lazy(() => import('./pages/PanduanPage'));
const JurusanFaqPage = lazy(() => import('./pages/JurusanFaqPage'));
const JurusanPerbandinganPage = lazy(() => import('./pages/JurusanPerbandinganPage'));
const KetentuanPpdbPage = lazy(() => import('./pages/KetentuanPpdbPage'));
const LupaSandiPage = lazy(() => import('./pages/ppdb/LupaSandiPage'));
const AturSandiPage = lazy(() => import('./pages/ppdb/AturSandiPage'));
const DokumenPesertaPage = lazy(() => import('./pages/ppdb/DokumenPesertaPage'));
const SegeraHadirPage = lazy(() => import('./pages/SegeraHadirPage'));
const Login = lazy(() => import('./page/Login/Login'));
const AuthProvider = lazy(() => import('./context/AuthContext').then(({ AuthProvider: Provider }) => ({ default: Provider })));
const PpdbProvider = lazy(() => import('./context/PpdbContext').then(({ PpdbProvider: Provider }) => ({ default: Provider })));
const PpdbRegisterPage = lazy(() => import('./pages/ppdb/RegisterPage'));
const PpdbLoginPage = lazy(() => import('./pages/ppdb/LoginPage'));
const VerifyEmailPage = lazy(() => import('./pages/ppdb/VerifyEmailPage'));
const RegistrationFormPage = lazy(() => import('./pages/ppdb/RegistrationFormPage'));
const UploadDocumentsPage = lazy(() => import('./pages/ppdb/UploadDocumentsPage'));
const SubmitSuccessPage = lazy(() => import('./pages/ppdb/SubmitSuccessPage'));
const PpdbStatusPage = lazy(() => import('./pages/ppdb/PpdbStatusPage'));
const AdminDataProvider = lazy(() => import('./context/AdminDataContext').then(({ AdminDataProvider: Provider }) => ({ default: Provider })));
const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'));
const DashboardHomePage = lazy(() => import('./pages/dashboard/DashboardHomePage'));
const DashboardJurusanPage = lazy(() => import('./pages/dashboard/JurusanPage'));
const PengaturanPage = lazy(() => import('./pages/dashboard/PengaturanPage'));
const AdminBeritaPage = lazy(() => import('./pages/admin/berita/BeritaPage'));
const AdminPengumumanPage = lazy(() => import('./pages/admin/pengumuman/PengumumanPage'));
const AdminPrestasiPage = lazy(() => import('./pages/admin/prestasi/PrestasiPage'));
const AdminBkkPage = lazy(() => import('./pages/admin/bkk/BkkPage'));
const AdminPpdbPage = lazy(() => import('./pages/admin/ppdb/PPDBPage'));
const ProtectedRoute = lazy(() => import('./router/ProtectedRoute'));
const NextTelPage = lazy(() => import('./pages/NextTelPage'));
const EkstrakurikulerPage = lazy(() => import('./pages/EkstrakurikulerPage'));

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
  '/ekstrakurikuler': ['Ekstrakurikuler | SMK Telkom Purwokerto', 'Kegiatan pengembangan minat, bakat, dan karakter siswa.'],
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
      <Suspense fallback={<div role="status" className="grid min-h-screen place-items-center bg-white text-sm text-dark-600">Memuat halaman...</div>}>
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
          <Route path="/ppdb/atur-sandi" element={<AturSandiPage />} />
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
        <Route path="/ekstrakurikuler" element={<EkstrakurikulerPage />} />

        <Route element={<AuthProvider><Outlet /></AuthProvider>}>
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
              {/* Tambah/edit berita dan detail PPDB kini memakai modal di dalam
                  halamannya masing-masing, jadi tidak ada rute terpisah lagi. */}
              <Route path="berita" element={<AdminBeritaPage />} />
              <Route path="pengumuman" element={<AdminPengumumanPage />} />
              <Route path="ppdb" element={<AdminPpdbPage />} />
              <Route path="jurusan" element={<DashboardJurusanPage />} />
              <Route path="prestasi" element={<AdminPrestasiPage />} />
              <Route path="bkk" element={<AdminBkkPage />} />
              <Route path="pengaturan" element={<PengaturanPage />} />
            </Route>
          </Route>
        </Route>

        {/* Tujuan yang belum memiliki route khusus mendarat di halaman ini. */}
        <Route path="*" element={<SegeraHadirPage />} />
      </Routes>
      </Suspense>
    </>
  );
};

export default App;
