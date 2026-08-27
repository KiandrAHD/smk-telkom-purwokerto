import { ArrowLeft, Hammer } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

// Satu halaman singgah untuk semua tujuan yang tautannya sudah ada tapi halamannya
// belum dibangun. Judul dan jalur kembali diambil dari URL, jadi menambah tautan
// baru tidak perlu menambah komponen baru. Begitu halaman aslinya jadi, daftarkan
// route-nya di App.jsx di atas route "*" dan tautan yang sudah tersebar otomatis
// mengarah ke halaman asli itu.
// Singkatan yang muncul di URL ditulis kapital penuh, supaya judulnya terbaca
// "RPL" dan "Kembali ke BKK", bukan "Rpl" dan "Kembali ke Bkk".
const AKRONIM = new Set([
  'rpl', 'pg', 'tkj', 'tjat', 'bkk', 'ppdb', 'pkl', 'faq', 'lks',
  'iot', 'ict', 'ai', 'ui', 'ux', 'cv', 'it', 'mou', 'kri',
]);

const titleCase = (segment) =>
  segment
    .split('-')
    .map((word) =>
      AKRONIM.has(word) ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ');

const SegeraHadirPage = () => {
  const { pathname } = useLocation();
  const parts = pathname.split('/').filter(Boolean);

  const title = parts.length ? titleCase(parts[parts.length - 1]) : 'Halaman Ini';
  // Induk = segmen pertama. Kalau halaman induknya memang sudah ada, tombol
  // kembali mengarah ke sana; kalau tidak, ke beranda.
  const parentPath = parts.length > 1 ? `/${parts[0]}` : '/';
  const parentLabel = parts.length > 1 ? titleCase(parts[0]) : 'Beranda';

  return (
    <MainLayout>
      <section className="bg-white py-16 lg:py-24">
        <div className="max-w-2xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
            <Hammer className="h-6 w-6 text-primary" />
          </span>

          <p className="mt-6 text-[11px] font-bold text-primary">Segera Hadir</p>
          <h1 className="mt-2 font-heading text-2xl sm:text-3xl font-extrabold text-dark-900">
            {title}
          </h1>
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-dark-500">
            Halaman ini sedang kami siapkan. Navigasinya sudah terhubung, jadi begitu
            isinya selesai kamu akan langsung mendarat di halaman yang benar.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={parentPath}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke {parentLabel}
            </Link>
            <Link
              to="/"
              className="inline-flex items-center rounded-full border border-dark-200 bg-white px-6 py-3 text-sm font-semibold text-dark-700 transition-colors hover:border-primary hover:text-primary"
            >
              Ke Beranda
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default SegeraHadirPage;
