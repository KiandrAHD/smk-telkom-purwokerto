import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Briefcase, Check, GraduationCap, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import GaleriFoto from '../GaleriFoto';
import Reveal from '../Reveal';
import { jurusanDetail } from '../../data/dummyData';

const Bagian = ({ Icon, judul, children }) => {
  const { t } = useLanguage();
  return (
  <Reveal as="section" className="mt-9">
    <h2 className="flex items-center gap-2.5 font-heading text-base font-extrabold text-dark-900">
      <Icon className="h-4 w-4 flex-shrink-0 text-primary" />
      {t(judul)}
    </h2>
    {children}
  </Reveal>
  );
};

// Seluruh isinya datang dari objek jurusan yang dicari lewat slug — tidak ada
// teks jurusan yang ditulis di komponen ini.
const JurusanDetailKonten = ({ item }) => {
  const { t } = useLanguage();
  const lainnya = jurusanDetail.filter((j) => j.slug !== item.slug);

  return (
    <>
      <Bagian Icon={Check} judul={t("Yang Kamu Pelajari")}>
        <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {item.kompetensi.map((k) => (
            <li key={k} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-primary-50">
                <Check className="h-2.5 w-2.5 text-primary" strokeWidth={3} />
              </span>
              <span className="text-[11px] leading-relaxed text-dark-600">{t(k)}</span>
            </li>
          ))}
        </ul>
      </Bagian>

      <Bagian Icon={GraduationCap} judul={t("Perjalanan Tiga Tahun")}>
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
                  {t(tahap.tingkat)}
                </span>
                <span className="mt-1 block text-[11px] leading-relaxed text-dark-500">
                  {t(tahap.fokus)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </Bagian>

      <Bagian Icon={Wrench} judul={t("Fasilitas Penunjang")}>
        <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {item.fasilitas.map((f) => (
            <li
              key={f}
              className="rounded-xl border border-dark-100 bg-dark-50 px-4 py-3 text-[11px] leading-relaxed text-dark-600"
            >
              {t(f)}
            </li>
          ))}
        </ul>
      </Bagian>

      <GaleriFoto
        items={item.galeri.map((foto) => ({ ...foto, alt: t(foto.alt) }))}
        title={t("Suasana Belajar")}
        description={t("Ruang praktik dan hasil karya siswa di jurusan ini.")}
      />

      <Bagian Icon={Briefcase} judul={t("Prospek Karier")}>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {item.karier.map((k) => (
            <article
              key={k.role}
              className="rounded-xl border border-dark-100 bg-white px-4 py-3.5 shadow-card transition-colors hover:border-primary"
            >
              <h3 className="font-heading text-xs font-bold text-dark-900">{t(k.role)}</h3>
              <p className="mt-1.5 text-[10px] leading-relaxed text-dark-500">{t(k.desc)}</p>
            </article>
          ))}
        </div>
      </Bagian>

      {/* Ajakan mendaftar, memakai warna banner yang sama dengan halaman lain */}
      <div className="mt-9 flex flex-col items-start gap-4 rounded-2xl bg-primary px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-heading text-sm font-extrabold text-white">{t('Tertarik masuk {program}?', { program: t(item.title) })}</p>
        <Link
          to="/ppdb"
          className="inline-flex flex-shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary-50"
        >{t("Daftar SPMB")} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <Bagian Icon={GraduationCap} judul={t("Jurusan Lainnya")}>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {lainnya.map((j) => (
            <Link
              key={j.slug}
              to={`/jurusan/${j.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-dark-100 bg-white transition-colors hover:border-primary"
            >
              <div className="overflow-hidden">
                <img
                  src={j.image}
                  alt={t(j.title)}
                  loading="lazy"
                  className="aspect-[2/1] w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <span className="flex flex-1 flex-col px-4 py-3.5">
                <span className="block font-heading text-[11px] font-bold leading-snug text-dark-900">
                  {t(j.title)}
                </span>
                <span className="mt-auto inline-flex items-center gap-1 pt-1.5 text-[10px] font-bold text-primary">{t("Lihat detail")} <ArrowRight className="h-3 w-3" />
                </span>
              </span>
            </Link>
          ))}
        </div>
      </Bagian>
    </>
  );
};

export default JurusanDetailKonten;
