import { Link } from 'react-router-dom';
import { AlarmClock, ArrowRight, FileText, Phone } from 'lucide-react';
import Reveal from '../Reveal';

// Bagian khas halaman detail Pengumuman: yang ditonjolkan urgensinya — tenggat
// dipasang paling atas dan mencolok, disusul langkah yang harus ditempuh serta
// berkas yang perlu disiapkan. Pembaca pengumuman datang untuk tahu "kapan" dan
// "harus apa", bukan untuk membaca cerita.
const PengumumanDetailKonten = ({ item, relatedItems = [] }) => {
  const lainnya = relatedItems.slice(0, 3);

  return (
    <>
      {item.tenggat && (
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-2xl bg-primary px-6 py-5 text-white">
          <AlarmClock className="h-8 w-8 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-white/80">
              {item.tenggat.label}
            </p>
            <p className="font-heading text-lg font-extrabold leading-tight sm:text-xl">
              {item.tenggat.tanggal}
            </p>
            {item.tenggat.catatan && (
              <p className="mt-1 text-[11px] leading-relaxed text-white/85">
                {item.tenggat.catatan}
              </p>
            )}
          </div>
        </div>
      )}

      {item.langkah && (
        <section className="mt-9">
          <h2 className="font-heading text-lg font-extrabold text-dark-900 sm:text-xl">
            Langkah yang Perlu Dilakukan
          </h2>
          <ol className="mt-5 space-y-3">
            {item.langkah.map((langkah, i) => (
              <Reveal
                key={langkah}
                as="li"
                className="flex gap-3 rounded-xl border border-dark-100 bg-white px-4 py-3"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 font-heading text-[11px] font-bold text-primary">
                  {i + 1}
                </span>
                <p className="text-xs leading-relaxed text-dark-600">{langkah}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      )}

      <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {item.berkas && (
          <div className="rounded-2xl border border-dark-100 bg-dark-50 px-5 py-4">
            <h3 className="flex items-center gap-2 font-heading text-xs font-bold text-dark-900">
              <FileText className="h-4 w-4 text-primary" />
              Berkas yang Disiapkan
            </h3>
            <ul className="mt-3 space-y-1.5">
              {item.berkas.map((berkas) => (
                <li key={berkas} className="flex gap-2 text-[11px] leading-relaxed text-dark-600">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                  {berkas}
                </li>
              ))}
            </ul>
          </div>
        )}

        {item.kontak && (
          <div className="rounded-2xl border border-dark-100 bg-dark-50 px-5 py-4">
            <h3 className="flex items-center gap-2 font-heading text-xs font-bold text-dark-900">
              <Phone className="h-4 w-4 text-primary" />
              Butuh Penjelasan?
            </h3>
            <p className="mt-3 font-heading text-[11px] font-bold text-dark-900">
              {item.kontak.nama}
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-dark-500">
              {item.kontak.detail}
            </p>
          </div>
        )}
      </div>

      {item.aksi && (
        <Link
          to={item.aksi.href}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
        >
          {item.aksi.label}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}

      {lainnya.length > 0 && (
        <section className="mt-10">
          <h2 className="font-heading text-lg font-extrabold text-dark-900 sm:text-xl">
            Pengumuman Lainnya
          </h2>
          <div className="mt-5 space-y-2.5">
            {lainnya.map((p) => (
              <Link
                key={p.slug}
                to={`/pengumuman/${p.slug}`}
                className="flex items-center justify-between gap-4 rounded-xl border border-dark-100 bg-white px-5 py-3.5 transition-colors hover:border-primary"
              >
                <span className="min-w-0">
                  <span className="block font-heading text-[11px] font-bold text-dark-900">
                    {p.title}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-dark-400">
                    {p.kategori} · {p.date}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 flex-shrink-0 text-primary" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default PengumumanDetailKonten;
