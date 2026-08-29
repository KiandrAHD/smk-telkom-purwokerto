import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import HalamanHeader from '../components/HalamanHeader';
import Reveal from '../components/Reveal';
import StatusBadge from '../components/dashboard/StatusBadge';
import { jurusanCompare, perbandinganLengkap } from '../data/dummyData';

// Nilai bintang bisa pecahan (4.5), jadi bintang terakhir digambar setengah
// lewat pembungkus selebar 50% yang memotong ikon penuh di dalamnya.
const Bintang = ({ nilai }) => (
  <span className="flex items-center justify-center gap-0.5" aria-label={`${nilai} dari 5`}>
    {Array.from({ length: 5 }).map((_, i) => {
      const penuh = i + 1 <= Math.floor(nilai);
      const separuh = !penuh && i < nilai;
      return (
        <span key={i} className="relative inline-flex h-3.5 w-3.5">
          <Star className="absolute h-3.5 w-3.5 text-dark-200" fill="currentColor" />
          {(penuh || separuh) && (
            <span className={`absolute overflow-hidden ${separuh ? 'w-1/2' : 'w-full'}`}>
              <Star className="h-3.5 w-3.5 text-primary" fill="currentColor" />
            </span>
          )}
        </span>
      );
    })}
  </span>
);

const JurusanPerbandinganPage = () => (
  <MainLayout>
    <HalamanHeader {...perbandinganLengkap} />

    <section className="bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="overflow-x-auto rounded-2xl border border-dark-100 bg-white p-5 shadow-card sm:p-6">
            <table className="w-full min-w-[42rem] border-collapse text-left">
              <thead>
                <tr className="bg-dark-50">
                  <th scope="col" className="rounded-l-xl px-4 py-4 text-[11px] font-bold text-dark-600">
                    Aspek
                  </th>
                  {jurusanCompare.columns.map((kolom, i) => (
                    <th
                      key={kolom}
                      scope="col"
                      className={`px-4 py-4 text-center text-[11px] font-bold text-dark-600 ${
                        i === jurusanCompare.columns.length - 1 ? 'rounded-r-xl' : ''
                      }`}
                    >
                      {kolom}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jurusanCompare.rows.map((baris) => (
                  <tr key={baris.aspek} className="border-b border-dark-100 last:border-b-0">
                    <th scope="row" className="px-4 py-4 text-xs font-bold text-dark-800">
                      {baris.aspek}
                    </th>
                    {baris.values.map((nilai, i) => (
                      <td key={i} className="px-4 py-4 text-center text-xs text-dark-600">
                        {baris.type === 'stars' ? (
                          <Bintang nilai={nilai} />
                        ) : baris.type === 'badge' ? (
                          <StatusBadge nilai={nilai} nada={nilai === 'Tinggi' ? 'oranye' : 'biru'} />
                        ) : (
                          nilai
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <h2 className="mt-12 font-heading text-lg font-extrabold text-dark-900">
          Mana yang cocok untukmu?
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          {perbandinganLengkap.cocokUntuk.map((j, i) => (
            <Reveal key={j.kode} className={i % 2 ? 'delay-100' : ''}>
              <Link
                to={`/jurusan/${j.slug}`}
                className="flex h-full flex-col rounded-2xl border border-dark-100 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary"
              >
                <span className="w-fit rounded-full bg-primary-50 px-3 py-1 text-[10px] font-bold text-primary">
                  {j.kode}
                </span>
                <h3 className="mt-3 font-heading text-sm font-extrabold text-dark-900">{j.judul}</h3>
                <p className="mt-2 text-xs leading-relaxed text-dark-500">{j.teks}</p>
                <span className="mt-auto pt-4 text-[11px] font-bold text-primary">
                  Lihat Detail Jurusan
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 rounded-2xl bg-dark-50 px-6 py-5 text-xs leading-relaxed text-dark-600">
          {perbandinganLengkap.catatan}
        </p>
      </div>
    </section>
  </MainLayout>
);

export default JurusanPerbandinganPage;
