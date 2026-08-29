import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail } from 'lucide-react';
import PpdbAuthLayout from '../../components/ppdb/PpdbAuthLayout';
import { usePpdb } from '../../context/PpdbContext';
import { ppdbVerifikasi } from '../../data/dummyData';

const VerifyEmailPage = () => {
  const { biodata } = usePpdb();
  const [sisa, setSisa] = useState(ppdbVerifikasi.jedaKirimUlang);

  // Hitung mundur tombol kirim ulang. Daftar dependensi sengaja kosong: kalau
  // effect ini bergantung pada `sisa`, intervalnya dibuang dan dibuat ulang tiap
  // detik sehingga hitungannya melambat. Di angka nol setSisa mengembalikan nilai
  // yang sama, jadi React berhenti merender dan interval jadi tidak berbiaya.
  useEffect(() => {
    const id = setInterval(() => setSisa((s) => (s <= 0 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const email = biodata.email || ppdbVerifikasi.emailContoh;

  return (
    <PpdbAuthLayout aksiLabel="Butuh Bantuan?" aksiTo="/ppdb/masuk" tinggiPita="h-52">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-card sm:p-10">
        <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
          <Mail className="h-7 w-7 text-primary" />
          <CheckCircle2
            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white text-green-600"
            fill="white"
          />
          <CheckCircle2 className="absolute -bottom-1 -right-1 h-6 w-6 text-green-600" />
        </span>

        <p className="mt-6 text-[11px] font-bold text-primary">{ppdbVerifikasi.badge}</p>

        <h1 className="mt-2 font-heading text-2xl font-extrabold text-dark-900">
          {ppdbVerifikasi.judul}
        </h1>

        <p className="mt-3 text-xs leading-relaxed text-dark-500">{ppdbVerifikasi.deskripsi}</p>

        <p className="mx-auto mt-3 w-fit rounded-lg bg-dark-50 px-4 py-2 font-heading text-xs font-bold text-dark-900">
          {email}
        </p>

        <a
          href={ppdbVerifikasi.ctaUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card transition-transform hover:-translate-y-0.5"
        >
          <Mail className="h-4 w-4" />
          {ppdbVerifikasi.ctaLabel}
        </a>

        <div className="mt-6 rounded-xl bg-dark-50 px-5 py-4 text-left">
          <p className="font-heading text-[11px] font-bold text-dark-900">
            {ppdbVerifikasi.catatanJudul}
          </p>
          <ul className="mt-2 space-y-1.5">
            {ppdbVerifikasi.catatan.map((c) => (
              <li key={c} className="flex gap-2 text-[11px] leading-relaxed text-dark-500">
                <span aria-hidden="true" className="text-dark-400">
                  &bull;
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-dark-100 pt-5 text-[11px]">
          <span className="text-dark-500">
            {ppdbVerifikasi.ubahLabel}{' '}
            <Link to="/ppdb/daftar" className="font-bold text-dark-900 underline hover:text-primary">
              {ppdbVerifikasi.ubahTeks}
            </Link>
          </span>

          <button
            type="button"
            disabled={sisa > 0}
            onClick={() => setSisa(ppdbVerifikasi.jedaKirimUlang)}
            className="font-heading font-bold text-primary transition-opacity hover:underline disabled:cursor-not-allowed disabled:text-dark-400 disabled:no-underline"
          >
            {sisa > 0
              ? `${ppdbVerifikasi.kirimUlangLabel} (${sisa}s)`
              : ppdbVerifikasi.kirimUlangLabel}
          </button>
        </div>

        {/* Tautan lanjut disediakan karena tanpa backend email, verifikasi tidak
            pernah benar-benar terjadi. */}
        <Link
          to="/ppdb/formulir"
          className="mt-5 inline-block text-[11px] font-semibold text-dark-400 underline-offset-4 hover:text-primary hover:underline"
        >
          Lanjut ke formulir pendaftaran
        </Link>
      </div>
    </PpdbAuthLayout>
  );
};

export default VerifyEmailPage;
