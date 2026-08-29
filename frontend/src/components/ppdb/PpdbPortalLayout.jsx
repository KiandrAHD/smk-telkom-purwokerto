import { Link } from 'react-router-dom';
import Logo from '../Logo';
import { ppdbAkunContoh, ppdbMeta } from '../../data/dummyData';

const inisial = (nama) =>
  nama
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((k) => k[0])
    .join('')
    .toUpperCase();

// Kerangka halaman setelah calon siswa masuk: header portal + isi.
const PpdbPortalLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-dark-50">
    <header className="sticky top-0 z-30 border-b border-dark-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 p-1.5">
            <Logo className="h-full w-full" />
          </span>
          <span className="font-heading text-sm font-extrabold text-dark-900">{ppdbMeta.portal}</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-heading text-xs font-bold leading-tight text-dark-900">
              {ppdbAkunContoh.nama}
            </p>
            <p className="text-[10px] text-dark-500">NISN: {ppdbAkunContoh.nisn}</p>
          </div>
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary font-heading text-xs font-bold text-white">
            {inisial(ppdbAkunContoh.nama)}
          </span>
        </div>
      </div>
    </header>

    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">{children}</main>

    <footer className="py-6 text-center text-[11px] text-dark-400">{ppdbMeta.hakCipta}</footer>
  </div>
);

export default PpdbPortalLayout;
