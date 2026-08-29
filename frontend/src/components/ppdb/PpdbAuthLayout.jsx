import { Link, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import ribbon from '../../assets/landing/ribbon.png';
import { ppdbMeta } from '../../data/dummyData';

// Kerangka halaman sebelum calon siswa masuk (Daftar, Masuk, Verifikasi).
// Pita merah di atas dibuat lebih tinggi dari isinya supaya kartu putih di
// tengah terlihat mengambang di atasnya, seperti pada desain.
const PpdbAuthLayout = ({ aksiLabel, aksiTo = '/', tinggiPita = 'h-44', children }) => {
  const { pathname } = useLocation();

  return (
  <div className="flex min-h-screen flex-col bg-dark-50">
    <div className={`relative ${tinggiPita} bg-gradient-to-r from-primary-700 via-primary to-primary-600`}>
      {/* Revisi tim: pita bermotif logo dari beranda dipakai sebagai tekstur
          header supaya tidak sekadar blok merah polos. */}
      <img
        src={ribbon}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full opacity-20 mix-blend-overlay"
      />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          {/* Revisi tim: inisial "T" diganti logo resmi sekolah. */}
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-card">
            <Logo className="h-full w-full" />
          </span>
          <span className="min-w-0">
            <span className="block font-heading text-sm font-extrabold leading-tight text-white">
              {ppdbMeta.namaSekolah}
            </span>
            <span className="block text-[11px] text-white/75">{ppdbMeta.sistem}</span>
          </span>
        </Link>

        <Link
          to={aksiTo}
          className="flex-shrink-0 rounded-full bg-white px-5 py-2.5 text-[11px] font-bold text-dark-900 shadow-card transition-transform hover:-translate-y-0.5"
        >
          {aksiLabel}
        </Link>
      </header>
    </div>

    {/* Margin negatif menarik kartu naik menimpa pita merah */}
    {/* key={pathname} memicu animasi masuk tiap berpindah antar Daftar, Masuk,
        dan Verifikasi. */}
    <main
      key={pathname}
      className="animate-masuk-halaman relative mx-auto -mt-24 w-full max-w-6xl flex-1 px-4 pb-10 sm:px-6"
    >
      {children}
    </main>

    <footer className="py-6 text-center text-[11px] text-dark-400">{ppdbMeta.hakCipta}</footer>
    </div>
  );
};

export default PpdbAuthLayout;
