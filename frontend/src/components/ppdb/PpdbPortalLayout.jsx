import { Link, Navigate, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import PpdbProgress from './PpdbProgress';
import { ppdbMeta } from '../../data/dummyData';
import { usePpdb } from '../../context/PpdbContext';

const inisial = (nama) =>
  nama
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();

// Kerangka halaman setelah calon siswa masuk: header portal, indikator langkah,
// lalu isi halamannya.
const PpdbPortalLayout = ({ children }) => {
  const { pathname } = useLocation();
  const { currentUser, authLoading, logout } = usePpdb();

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-dark-50 text-sm text-dark-500">Memeriksa sesi PPDB...</div>;
  }

  if (!currentUser) return <Navigate to="/ppdb/masuk" replace />;

  return (
    <div className="flex min-h-screen flex-col bg-dark-50">
      <header className="sticky top-0 z-30 border-b border-dark-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 p-1.5 transition-transform hover:scale-105">
              <Logo className="h-full w-full" />
            </span>
            <span className="font-heading text-sm font-extrabold text-dark-900">{ppdbMeta.portal}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="max-w-48 truncate font-heading text-xs font-bold leading-tight text-dark-900 sm:max-w-none">
                {currentUser.email}
              </p>
              <button type="button" onClick={() => void logout()} className="text-[10px] font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">Keluar</button>
            </div>
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xs font-bold text-white">
              {inisial(currentUser.email || 'PPDB')}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <PpdbProgress />

        {/* key={pathname} memaksa isi dipasang ulang tiap pindah langkah supaya
            animasi masuknya benar-benar jalan — pola yang sama dipakai
            MainLayout dan DashboardLayout. */}
        <div key={pathname} className="animate-masuk-halaman">
          {children}
        </div>
      </main>

      <footer className="py-6 text-center text-[11px] text-dark-400">{ppdbMeta.hakCipta}</footer>
    </div>
  );
};

export default PpdbPortalLayout;
