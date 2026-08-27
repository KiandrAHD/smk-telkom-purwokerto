import { ArrowRight, Briefcase, Check, GraduationCap, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jurusanDetail } from '../../data/dummyData';

const Bagian = ({ Icon, judul, children }) => (
  <section className="mt-9">
    <h2 className="flex items-center gap-2.5 font-heading text-base font-extrabold text-dark-900">
      <Icon className="h-4 w-4 flex-shrink-0 text-primary" />
      {judul}
    </h2>
    {children}
  </section>
);

// Seluruh isinya datang dari objek jurusan yang dicari lewat slug — tidak ada
// teks jurusan yang ditulis di komponen ini.
const JurusanDetailKonten = ({ item }) => {
  const lainnya = jurusanDetail.filter((j) => j.slug !== item.slug);

  return (
    <>
      <Bagian Icon={Check} judul="Yang Kamu Pelajari">
        <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {item.kompetensi.map((k) => (
            <li key={k} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
                <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
              </span>
              <span className="text-[11px] leading-relaxed text-dark-600">{k}</span>
            </li>
          ))}
        </ul>
      </Bagian>

      <Bagian Icon={GraduationCap} judul="Perjalanan Tiga Tahun">
        <ol className="mt-4 space-y-3">
          {item.kurikulum.map((tahap, i) => (
            <li
              key={tahap.tingkat}
              className="flex gap-4 rounded-xl border border-dark-100 bg-white px-4 py-3.5"
            >
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-xs font-bold text-primary">
                  {tahap.tingkat}
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-dark-500">
                  {tahap.fokus}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Bagian>

      <Bagian Icon={Wrench} judul="Fasilitas Penunjang">
        <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {item.fasilitas.map((f) => (
            <li
              key={f}
              className="rounded-xl border border-dark-100 bg-dark-50 px-4 py-3 text-[11px] leading-relaxed text-dark-600"
            >
              {f}
            </li>
          ))}
        </ul>
      </Bagian>

      <Bagian Icon={Briefcase} judul="Prospek Karier">
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {item.karier.map((k) => (
            <article
              key={k.role}
              className="rounded-xl border border-dark-100 bg-white px-4 py-3.5 shadow-card transition-colors hover:border-primary"
            >
              <h3 className="font-heading text-xs font-bold text-dark-900">{k.role}</h3>
              <p className="mt-1.5 text-[10px] leading-relaxed text-dark-500">{k.desc}</p>
            </article>
          ))}
        </div>
      </Bagian>

      {/* Ajakan mendaftar, memakai warna banner yang sama dengan halaman lain */}
      <div className="mt-9 flex flex-col items-start gap-4 rounded-2xl bg-primary px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-heading text-sm font-extrabold text-white">
          Tertarik masuk {item.title}?
        </p>
        <Link
          to="/ppdb"
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary-50"
        >
          Daftar PPDB
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <Bagian Icon={GraduationCap} judul="Jurusan Lainnya">
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {lainnya.map((j) => (
            <Link
              key={j.slug}
              to={`/jurusan/${j.slug}`}
              className="rounded-xl border border-dark-100 bg-white px-4 py-3.5 transition-colors hover:border-primary"
            >
              <span className="block font-heading text-[11px] font-bold leading-snug text-dark-900">
                {j.title}
              </span>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-primary">
                Lihat detail
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </Bagian>
    </>
  );
};

export default JurusanDetailKonten;
