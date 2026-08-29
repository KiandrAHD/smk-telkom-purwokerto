import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, KeyRound } from 'lucide-react';
import FormInput from '../../components/dashboard/FormInput';
import PpdbAuthLayout from '../../components/ppdb/PpdbAuthLayout';
import { lupaSandi } from '../../data/dummyData';

const LupaSandiPage = () => {
  const [email, setEmail] = useState('');
  const [terkirim, setTerkirim] = useState(false);

  return (
    <PpdbAuthLayout aksiLabel="Kembali ke Beranda" tinggiPita="h-52">
      <div className="mx-auto max-w-md rounded-3xl border border-dark-100 bg-white p-8 shadow-card sm:p-10">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
          <KeyRound className="h-7 w-7 text-primary" />
        </span>

        <p className="mt-6 text-center text-[11px] font-bold text-primary">{lupaSandi.badge}</p>
        <h1 className="mt-2 text-center font-heading text-2xl font-extrabold text-dark-900">
          {lupaSandi.judul}
        </h1>
        <p className="mt-3 text-center text-xs leading-relaxed text-dark-500">
          {lupaSandi.deskripsi}
        </p>

        {terkirim ? (
          <p className="mt-7 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-[11px] leading-relaxed text-dark-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
            {lupaSandi.pesanTerkirim}
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setTerkirim(true);
            }}
            className="mt-7 space-y-5"
          >
            <FormInput
              label="Alamat Email Terdaftar"
              wajib
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@gmail.com"
              required
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card transition-transform hover:-translate-y-0.5"
            >
              {lupaSandi.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="mt-6 rounded-xl bg-dark-50 px-5 py-4">
          <p className="font-heading text-[11px] font-bold text-dark-900">
            {lupaSandi.catatanJudul}
          </p>
          <ul className="mt-2 space-y-1.5">
            {lupaSandi.catatan.map((c) => (
              <li key={c} className="flex gap-2 text-[11px] leading-relaxed text-dark-500">
                <span aria-hidden="true" className="text-dark-400">
                  &bull;
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-[11px] text-dark-500">
          Sudah ingat sandinya?{' '}
          <Link to="/ppdb/masuk" className="font-heading font-bold text-primary hover:underline">
            Masuk ke Portal PPDB
          </Link>
        </p>
      </div>
    </PpdbAuthLayout>
  );
};

export default LupaSandiPage;
