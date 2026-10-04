import PasswordInput from '../../components/ppdb/PasswordInput';
import { useLanguage } from '../../context/LanguageContext';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FormInput from '../../components/dashboard/FormInput';
import PanelMerah from '../../components/ppdb/PanelMerah';
import PpdbAuthLayout from '../../components/ppdb/PpdbAuthLayout';
import { ppdbPanelMasuk } from '../../data/dummyData';
import { getMyPpdb, signInPpdb } from '../../services/ppdbService';

const LoginPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ akun: '', sandi: '' });
  const [galat, setGalat] = useState('');
  const [mengirim, setMengirim] = useState(false);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const kirim = async (e) => {
    e.preventDefault();
    setGalat('');
    setMengirim(true);
    try {
      await signInPpdb(form.akun.trim(), form.sandi);
      const submissions = await getMyPpdb();
      navigate(submissions.length ? '/spmb/status' : '/spmb/formulir');
    } catch {
      setGalat('Email atau kata sandi tidak valid.');
    } finally {
      setMengirim(false);
    }
  };

  return (
    <PpdbAuthLayout aksiLabel="Kembali ke Beranda">
      <div className="mx-auto grid max-w-4xl rounded-3xl border border-dark-100 bg-white p-4 shadow-card sm:p-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
        <PanelMerah {...ppdbPanelMasuk} className="order-2 rounded-2xl lg:order-1" />

        <div className="order-1 min-w-0 p-3 sm:p-8 lg:order-2 lg:p-10">
          <h1 className="font-heading text-2xl font-extrabold text-dark-900">{t("Masuk ke Akun Anda")}</h1>
          <p className="mt-1.5 text-xs text-dark-500">{t("Gunakan alamat email yang sudah terdaftar.")} </p>

          <form
            onSubmit={kirim}
            className="mt-7 space-y-5"
          >
            <FormInput
              label={t("Alamat Email")}
              type="email"
              name="email"
              inputMode="email"
              autoComplete="username"
              wajib
              value={form.akun}
              onChange={ubah('akun')}
              placeholder={t("Masukkan alamat email")}
              required
            />

            <PasswordInput label={t("Kata Sandi")} name="password" autoComplete="current-password" value={form.sandi} onChange={ubah('sandi')} placeholder={t("Masukkan Kata Sandi")} wajib required />
            <Link to="/lupa-sandi" className="inline-flex min-h-11 items-center text-xs font-semibold text-primary hover:underline">{t("Lupa Sandi?")}</Link>

            {galat && <p role="alert" className="rounded-xl bg-primary-50 px-4 py-3 text-[11px] font-medium text-primary-800">{t(galat)}</p>}

            <button
              type="submit"
              disabled={mengirim}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t(mengirim ? 'Memeriksa...' : 'Masuk Sekarang')}
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-[11px] text-dark-500">{t("Belum memiliki akun SPMB?")}{' '}
              <Link to="/spmb/daftar" className="font-heading font-bold text-primary hover:underline">{t("Daftar Akun Baru")} </Link>
            </p>
          </form>
        </div>
      </div>
    </PpdbAuthLayout>
  );
};

export default LoginPage;
