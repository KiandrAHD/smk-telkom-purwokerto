import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import GaleriFoto from '../GaleriFoto';
import Reveal from '../Reveal';

// Bagian khas halaman detail Prestasi: yang ditonjolkan adalah momen juaranya —
// angka sorotan, tahapan menuju podium, lalu foto-fotonya. Seluruh isinya datang
// dari objek `item`, jadi tiap prestasi menampilkan datanya sendiri.
const PrestasiDetailKonten = ({ item, relatedItems = [] }) => {
  const lainnya = relatedItems.slice(0, 3);

  return (
    <>
      {item.sorotan && (
        <div className="mt-8 grid grid-cols-3 gap-3">
          {item.sorotan.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-primary px-3 py-4 text-center text-white transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="font-heading text-lg font-extrabold leading-none sm:text-2xl">
                {s.angka}
              </p>
              <p className="mt-1.5 text-[9px] leading-tight text-white/85 sm:text-[10px]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {item.perjalanan && (
        <section className="mt-10">
          <h2 className="font-heading text-lg font-extrabold text-dark-900 sm:text-xl">
            Perjalanan Menuju Podium
          </h2>
          <ol className="mt-5 space-y-4 border-l-2 border-primary-100 pl-6">
            {item.perjalanan.map((tahap, i) => (
              <Reveal key={tahap.tahap} as="li" className="relative">
                <span className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full bg-primary font-heading text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="font-heading text-xs font-bold text-dark-900 sm:text-sm">
                  {tahap.tahap}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-dark-500">{tahap.isi}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      <GaleriFoto
        items={item.galeri}
        title="Momen Juara"
        description="Dokumentasi kegiatan dan hasil karya di balik prestasi ini."
      />

      {lainnya.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading text-lg font-extrabold text-dark-900 sm:text-xl">
            Prestasi Lainnya
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {lainnya.map((p) => (
              <Link
                key={p.slug}
                to={`/prestasi/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-dark-100 bg-white shadow-card transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="aspect-[16/9] w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="px-4 py-3">
                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-primary">
                    <Trophy className="h-3 w-3" />
                    {p.kategori}
                  </span>
                  <h3 className="mt-1 font-heading text-[11px] font-bold leading-snug text-dark-900">
                    {p.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default PrestasiDetailKonten;
