import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FormInput from '../../components/dashboard/FormInput';
import PanelMerah from '../../components/ppdb/PanelMerah';
import PpdbAuthLayout from '../../components/ppdb/PpdbAuthLayout';
import { usePpdb } from '../../context/PpdbContext';
import { ppdbJurusanPilihan, ppdbPanelDaftar } from '../../data/dummyData';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { biodata, isiBiodata } = usePpdb();
  const [sandi, setSandi] = useState({ kata: '', konfirmasi: '' });
  const [setuju, setSetuju] = useState(false);
  const [galat, setGalat] = useState('');

  const ubah = (kunci) => (e) => isiBiodata({ [kunci]: e.target.value });

  const kirim = (e) => {
    e.preventDefault();
    if (sandi.kata.length < 8) {
      setGalat('Kata sandi minimal 8 karakter.');
      return;
    }
    if (sandi.kata !== sandi.konfirmasi) {
      setGalat('Konfirmasi sandi belum sama dengan kata sandi.');
      return;
    }
    setGalat('');
    navigate('/ppdb/verifikasi');
  };

  return (
    <PpdbAuthLayout aksiLabel="Kembali ke Beranda">
      <div className="grid rounded-3xl border border-dark-100 bg-white p-4 shadow-card sm:p-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <PanelMerah {...ppdbPanelDaftar} className="rounded-2xl" />

        <div className="p-8 sm:p-10">
          <h1 className="font-heading text-2xl font-extrabold text-dark-900">Daftar Akun Baru</h1>
          <p className="mt-1.5 text-xs text-dark-500">
            Lengkapi formulir di bawah ini menggunakan data calon siswa.
          </p>

          <form onSubmit={kirim} className="mt-7 space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormInput
                label="NISN Siswa"
                wajib
                value={biodata.nisn}
                onChange={ubah('nisn')}
                placeholder="10 digit NISN"
                inputMode="numeric"
                maxLength={10}
                required
              />
              <FormInput
                label="Nama Lengkap"
                wajib
                value={biodata.namaLengkap}
                onChange={ubah('namaLengkap')}
                placeholder="Sesuai Ijazah SMP/MTs"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormInput
                label="Email Aktif"
                wajib
                type="email"
                value={biodata.email}
                onChange={ubah('email')}
                placeholder="contoh@gmail.com"
                required
              />
              <FormInput
                label="Nomor WhatsApp"
                wajib
                type="tel"
                value={biodata.whatsapp}
                onChange={ubah('whatsapp')}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>

            <FormInput
              label="Peminatan Jurusan Utama"
              as="select"
              value={biodata.jurusan}
              onChange={ubah('jurusan')}
              required
              options={[{ value: '', label: '-- Pilih Peminatan Jurusan --' }, ...ppdbJurusanPilihan]}
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormInput
                label="Kata Sandi"
                wajib
                type="password"
                value={sandi.kata}
                onChange={(e) => setSandi((s) => ({ ...s, kata: e.target.value }))}
                placeholder="Minimal 8 Karakter"
                required
              />
              <FormInput
                label="Konfirmasi Sandi"
                wajib
                type="password"
                value={sandi.konfirmasi}
                onChange={(e) => setSandi((s) => ({ ...s, konfirmasi: e.target.value }))}
                placeholder="Ulangi Kata Sandi"
                required
              />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 text-[11px] leading-relaxed text-dark-600">
              <input
                type="checkbox"
                checked={setuju}
                onChange={(e) => setSetuju(e.target.checked)}
                required
                className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 accent-[color:var(--color-primary)]"
              />
              <span>
                Saya menyatakan data di atas benar dan menyetujui{' '}
                <Link to="/ketentuan-ppdb" className="font-semibold text-primary hover:underline">
                  Ketentuan PPDB SMK Telkom Purwokerto
                </Link>
              </span>
            </label>

            {galat && (
              <p role="alert" className="rounded-xl bg-primary-50 px-4 py-3 text-[11px] font-medium text-primary-800">
                {galat}
              </p>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-wide text-white shadow-card transition-transform hover:-translate-y-0.5"
            >
              Buat Akun &amp; Lanjutkan Pendaftaran
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="text-center text-[11px] text-dark-500">
              Sudah pernah mendaftar?{' '}
              <Link to="/ppdb/masuk" className="font-heading font-bold text-primary hover:underline">
                Masuk ke Portal PPDB
              </Link>
            </p>
          </form>
        </div>
      </div>
    </PpdbAuthLayout>
  );
};

export default RegisterPage;
