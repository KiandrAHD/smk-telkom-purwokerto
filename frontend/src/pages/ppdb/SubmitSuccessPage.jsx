import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CheckCircle2, Printer } from 'lucide-react';
import PpdbPortalLayout from '../../components/ppdb/PpdbPortalLayout';
import { usePpdb } from '../../context/PpdbContext';
import { ppdbMeta, ppdbSukses } from '../../data/dummyData';

const ikonLangkah = { cetak: Printer, jadwal: CalendarDays };

const TITIK = {
  hijau: 'bg-green-600',
  oranye: 'bg-orange-500',
  merah: 'bg-primary',
};

const TEKS = {
  hijau: 'text-green-600',
  oranye: 'text-orange-600',
  merah: 'text-primary',
};

const SubmitSuccessPage = () => {
  const { nomorRegistrasi } = usePpdb();

  return (
    <PpdbPortalLayout>
      {/* Banner konfirmasi */}
      <div className="flex items-start gap-4 rounded-2xl border border-green-200 bg-green-50 px-6 py-5">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-green-600 text-white">
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <h1 className="font-heading text-base font-extrabold text-dark-900">{ppdbSukses.judul}</h1>
          <p className="mt-1.5 text-[11px] leading-relaxed text-dark-600">{ppdbSukses.pesan}</p>
        </div>
      </div>

      {/* Tiga kartu ringkasan. Titik warna dan warna teks berbeda per kartu,
          jadi keduanya ditentukan lewat data, bukan dipaksa seragam di sini. */}
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {ppdbSukses.kartu.map((kartu) => (
          <div
            key={kartu.label}
            className="rounded-2xl border border-dark-100 bg-white px-5 py-5 shadow-card transition-shadow hover:shadow-lg"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-dark-400">
              {kartu.label}
            </p>

            <p
              className={`mt-2 flex items-center gap-2 font-heading text-lg font-extrabold ${
                TEKS[kartu.nadaNilai] ?? 'text-dark-900'
              }`}
            >
              {kartu.titikNilai && (
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${TITIK[kartu.titikNilai]}`} />
              )}
              {/* Nomor registrasi dibuat saat submit, bukan ditulis di data. */}
              {kartu.nilai ?? nomorRegistrasi ?? '-'}
            </p>

            <p
              className={`mt-3 flex items-center gap-2 text-[11px] ${
                TEKS[kartu.nadaCatatan] ?? 'text-dark-500'
              }`}
            >
              {kartu.titikCatatan && (
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${TITIK[kartu.titikCatatan]}`} />
              )}
              {kartu.catatan}
            </p>
          </div>
        ))}
      </div>

      {/* Langkah selanjutnya */}
      <div className="mt-6 rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
        <h2 className="font-heading text-sm font-extrabold text-dark-900">{ppdbSukses.langkahJudul}</h2>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ppdbSukses.langkah.map((langkah) => {
            const Ikon = ikonLangkah[langkah.icon] ?? Printer;
            return (
              <Link
                key={langkah.judul}
                to="/ppdb/dokumen-peserta"
                className="group flex items-center gap-4 rounded-xl border border-dark-100 px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-card"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                  <Ikon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block font-heading text-xs font-bold text-dark-900">
                    {langkah.judul}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-dark-500">{langkah.deskripsi}</span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 flex-shrink-0 text-dark-300 transition-colors group-hover:text-primary" />
              </Link>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-dark-100 pt-5">
          <p className="text-[11px] text-dark-500">{ppdbSukses.bantuanTeks}</p>
          <a
            href={ppdbMeta.waHelpdesk}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 font-heading text-[11px] font-bold text-primary hover:underline"
          >
            {ppdbSukses.bantuanCta}
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </PpdbPortalLayout>
  );
};

export default SubmitSuccessPage;
