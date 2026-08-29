import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FormInput from '../../components/dashboard/FormInput';
import PanelMerah from '../../components/ppdb/PanelMerah';
import PpdbAuthLayout from '../../components/ppdb/PpdbAuthLayout';
import { ppdbPanelMasuk } from '../../data/dummyData';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ akun: '', sandi: '' });
  const [ingat, setIngat] = useState(false);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  return (
    <PpdbAuthLayout aksiLabel="Kembali ke Beranda">
      <div className="mx-auto grid max-w-4xl rounded-3xl bg-white p-4 shadow-card sm:p-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <PanelMerah {...ppdbPanelMasuk} className="rounded-2xl" />

        <div className="p-8 sm:p-10">
          <h1 className="font-heading text-2xl font-extrabold text-dark-900">Masuk ke Akun Anda</h1>
          <p className="mt-1.5 text-xs text-dark-500">
            Gunakan NISN atau Email yang sudah terdaftar.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate('/ppdb/formulir');
            }}
            className="mt-7 space-y-5"
          >
            <FormInput
              label="NISN / Alamat Email"
              wajib
              value={form.akun}
              onChange={ubah('akun')}
              placeholder="Masukkan NISN atau Email"
              required
            />

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-dark-700">
                  Kata Sandi<span className="ml-0.5 text-primary">*</span>
                </span>
                <Link to="/lupa-sandi" className="text-[11px] font-semibold text-primary hover:underline">
                  Lupa Sandi?
                </Link>
              </div>
              <input
                type="password"
                value={form.sandi}
                onChange={ubah('sandi')}
                placeholder="Masukkan Kata Sandi"
                required
                aria-label="Kata Sandi"
                className="w-full rounded-xl border border-dark-200 bg-white px-4 py-3 text-xs text-dark-800 outline-none transition-all placeholder:text-dark-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 text-[11px] text-dark-600">
              <input
                type="checkbox"
                checked={ingat}
                onChange={(e) => setIngat(e.target.checked)}
                className="h-3.5 w-3.5 flex-shrink-0 accent-[color:var(--color-primary)]"
              />
              Ingat saya di perangkat ini
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card transition-transform hover:-translate-y-0.5"
            >
              Masuk Sekarang
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-[11px] text-dark-500">
              Belum memiliki akun PPDB?{' '}
              <Link to="/ppdb/daftar" className="font-heading font-bold text-primary hover:underline">
                Daftar Akun Baru
              </Link>
            </p>
          </form>
        </div>
      </div>
    </PpdbAuthLayout>
  );
};

export default LoginPage;
