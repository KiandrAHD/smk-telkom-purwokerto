import { ArrowLeft, BookOpen, CalendarDays, Download, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';
import PpdbPortalLayout from '../../components/ppdb/PpdbPortalLayout';
import Reveal from '../../components/Reveal';
import { usePpdb } from '../../context/PpdbContext';
import { dokumenPeserta, ppdbMeta } from '../../data/dummyData';

const ikon = { cetak: Printer, jadwal: CalendarDays, panduan: BookOpen };

const DokumenPesertaPage = () => {
  const { nomorRegistrasi, biodata, currentUser } = usePpdb();
  const nomor = nomorRegistrasi ?? '-';

  return (
    <PpdbPortalLayout>
      <h1 className="font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">
        {dokumenPeserta.title}
      </h1>
      <p className="mt-1.5 text-xs text-dark-500">{dokumenPeserta.deskripsi}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[22rem_1fr]">
        {/* Kartu peserta */}
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card">
            <div className="flex items-center gap-3 bg-gradient-to-r from-primary-700 to-primary px-5 py-4">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white p-1.5">
                <Logo className="h-full w-full" />
              </span>
              <div className="min-w-0">
                <p className="font-heading text-[11px] font-extrabold leading-tight text-white">
                  {dokumenPeserta.kartuJudul}
                </p>
                <p className="text-[10px] text-white/75">{ppdbMeta.namaSekolah}</p>
              </div>
            </div>

            <dl className="space-y-4 px-5 py-5">
              {[
                ['Nomor Registrasi', nomor],
                ['Nama Lengkap', biodata.namaLengkap || '-'],
                ['NISN', biodata.nisn || '-'],
                ['Email', currentUser?.email || biodata.email || '-'],
                ['Peminatan', biodata.jurusan || 'Belum dipilih'],
              ].map(([label, nilai]) => (
                <div key={label}>
                  <dt className="text-[10px] font-bold uppercase tracking-wide text-dark-400">
                    {label}
                  </dt>
                  <dd className="mt-1 font-heading text-xs font-bold text-dark-900">{nilai}</dd>
                </div>
              ))}
            </dl>

            <p className="border-t border-dark-100 px-5 py-3 text-[10px] leading-relaxed text-dark-500">
              {dokumenPeserta.kartuCatatan}
            </p>
          </div>
        </Reveal>

        <div className="space-y-6">
          {/* Berkas yang bisa diunduh */}
          <Reveal className="delay-100">
            <div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
              <h2 className="font-heading text-sm font-extrabold text-dark-900">Berkas Peserta</h2>

              <div className="mt-4 space-y-3">
                {dokumenPeserta.berkas.map((b) => {
                  const Ikon = ikon[b.icon] ?? Printer;
                  return (
                    <div
                      key={b.judul}
                      className="flex items-center gap-4 rounded-xl border border-dark-100 px-4 py-3 transition-colors hover:border-primary"
                    >
                      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary">
                        <Ikon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-xs font-bold text-dark-900">
                          {b.judul}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-dark-500">{b.deskripsi}</span>
                      </span>
                      {/* Berkas sungguhan belum tersedia; tombol memakai cetak
                          bawaan browser supaya tetap melakukan sesuatu yang nyata. */}
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="flex flex-shrink-0 items-center gap-1.5 rounded-full border border-primary px-4 py-2 text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        <Download className="h-3.5 w-3.5" />
                        Unduh
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Tahapan seleksi */}
          <Reveal className="delay-200">
            <div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
              <h2 className="font-heading text-sm font-extrabold text-dark-900">Tahapan Seleksi</h2>

              <ol className="mt-5 space-y-5">
                {dokumenPeserta.tahapan.map((t, i) => (
                  <li key={t.nama} className="relative flex gap-4 pl-1">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 font-heading text-[11px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-heading text-xs font-bold text-dark-900">{t.nama}</p>
                      <p className="mt-0.5 text-[11px] text-dark-500">{t.ket}</p>
                    </div>
                    <span className="ml-auto flex-shrink-0 text-[11px] font-semibold text-primary">
                      {t.tanggal}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>

          <Link
            to="/ppdb/selesai"
            className="inline-flex items-center gap-2 text-[11px] font-semibold text-dark-500 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Status Pendaftaran
          </Link>
        </div>
      </div>
    </PpdbPortalLayout>
  );
};

export default DokumenPesertaPage;
