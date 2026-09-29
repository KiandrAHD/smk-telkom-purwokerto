import { useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import FormInput from '../../components/dashboard/FormInput';
import Logo from '../../components/Logo';
import PageHeader from '../../components/dashboard/PageHeader';
import { useAdminData } from '../../context/AdminDataContext';
import { adminTabPengaturan } from '../../data/dummyData';

const PengaturanPage = () => {
  const { profilSekolah, setProfilSekolah, akun, setAkun, pengaturanUmum, setPengaturanUmum } = useAdminData();
  const [tab, setTab] = useState(adminTabPengaturan[0]);
  const [form, setForm] = useState(profilSekolah);
  const [tersimpan, setTersimpan] = useState(false);
  const [logo, setLogo] = useState(null);
  const berkasLogoRef = useRef(null);

  useEffect(() => { setForm(profilSekolah); }, [profilSekolah]);
  useEffect(() => () => { if (logo) URL.revokeObjectURL(logo); }, [logo]);

  const ubah = (setter) => (kunci) => (e) => {
    setTersimpan(false);
    setter((f) => ({ ...f, [kunci]: e.target.value }));
  };

  const simpan = (e) => {
    e.preventDefault();
    if (tab === adminTabPengaturan[0]) setProfilSekolah(form);
    if (tab === adminTabPengaturan[1]) setAkun(akun);
    if (tab === adminTabPengaturan[2]) setPengaturanUmum(pengaturanUmum);
    setTersimpan(true);
  };

  const labelSimpan = {
    [adminTabPengaturan[0]]: 'Terapkan Profil untuk Sesi Ini',
    [adminTabPengaturan[1]]: 'Terapkan Akun untuk Sesi Ini',
    [adminTabPengaturan[2]]: 'Terapkan Pengaturan untuk Sesi Ini',
  }[tab];

  return (
    <section>
      <PageHeader
        judul="Pengaturan"
        breadcrumb={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Pengaturan' }]}
      />

      <div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-wrap gap-2 border-b border-dark-100 pb-6" role="tablist">
          {adminTabPengaturan.map((nama) => (
            <button
              key={nama}
              type="button"
              role="tab"
              aria-selected={tab === nama}
              onClick={() => {
                setTab(nama);
                setTersimpan(false);
              }}
              className={`rounded-xl px-6 py-3 text-xs font-bold transition-colors ${
                tab === nama ? 'bg-primary text-white' : 'text-dark-700 hover:bg-dark-50 hover:text-primary'
              }`}
            >
              {nama}
            </button>
          ))}
        </div>

        <form onSubmit={simpan} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem]">
          <div>
            <h2 className="font-heading text-lg font-extrabold text-dark-900">{tab}</h2>

            {tab === adminTabPengaturan[0] && (
              <div className="mt-6 space-y-5">
                <FormInput label="Nama Sekolah" value={form.namaSekolah} onChange={ubah(setForm)('namaSekolah')} required />
                <FormInput label="NPSN" value={form.npsn} onChange={ubah(setForm)('npsn')} required />
                <FormInput label="Alamat" value={form.alamat} onChange={ubah(setForm)('alamat')} required />
                <FormInput label="No. Telepon" value={form.telepon} onChange={ubah(setForm)('telepon')} required />
                <FormInput label="Email" type="email" value={form.email} onChange={ubah(setForm)('email')} required />
                <FormInput label="Website" value={form.website} onChange={ubah(setForm)('website')} required />
              </div>
            )}

            {tab === adminTabPengaturan[1] && (
              <div className="mt-6 space-y-5">
                <FormInput label="Nama Lengkap" value={akun.namaLengkap} onChange={ubah(setAkun)('namaLengkap')} required />
                <FormInput label="Email" type="email" value={akun.email} onChange={ubah(setAkun)('email')} required />
                <FormInput label="Peran" value={akun.peran} disabled readOnly />
                <p className="text-[11px] leading-relaxed text-dark-400">
                  Perubahan di tab ini hanya berlaku selama sesi admin saat ini. Perubahan email akun Supabase dilakukan lewat dasbor Supabase, bukan dari halaman ini.
                </p>
              </div>
            )}

{tab === adminTabPengaturan[2] && (
              <div className="mt-6 space-y-5">
                <FormInput label="Tahun Ajaran" value={pengaturanUmum.tahunAjaran} onChange={ubah(setPengaturanUmum)('tahunAjaran')} required />
                <FormInput
                  label="Status PPDB"
                  as="select"
                  value={pengaturanUmum.statusPpdb}
                  onChange={ubah(setPengaturanUmum)('statusPpdb')}
                  options={['Dibuka', 'Ditutup']}
                />
                <FormInput
                  label="Berita per Halaman"
                  type="number"
                  min="1"
                  max="50"
                  value={pengaturanUmum.beritaPerHalaman}
                  onChange={ubah(setPengaturanUmum)('beritaPerHalaman')}
                  required
                />
                <p className="text-[11px] leading-relaxed text-dark-400">
                  Perubahan hanya berlaku selama sesi admin saat ini.
                </p>
              </div>
            )}
            {tab !== adminTabPengaturan[0] && (
              <p className="mt-5 text-xs text-dark-500">
                Perubahan pada formulir ini hanya berlaku selama sesi admin dan tidak disimpan ke database permanen.
              </p>
            )}
          </div>

          <aside className="flex flex-col">
            <h2 className="font-heading text-lg font-extrabold text-dark-900">Logo Sekolah</h2>

            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-dark-50 px-6 py-8">
              {logo ? (
                <img src={logo} alt="Pratinjau logo baru" className="h-12 w-12 object-contain" />
              ) : (
                <Logo className="h-12 w-12" />
              )}
              <p className="mt-3 font-heading text-lg font-extrabold text-dark-900">SMK Telkom</p>
              <p className="text-xs text-dark-500">Purwokerto</p>
            </div>

            <button
              type="button"
              onClick={() => berkasLogoRef.current?.click()}
              className="mt-4 self-center font-heading text-xs font-bold text-dark-900 transition-colors hover:text-primary"
            >
              Ubah Logo
            </button>
            <p className="mt-2 text-center text-[11px] text-dark-500">Logo baru hanya ditampilkan sebagai pratinjau dan belum disimpan.</p>
            <input
              ref={berkasLogoRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setTersimpan(false);
                setLogo((lama) => {
                  if (lama) URL.revokeObjectURL(lama);
                  return URL.createObjectURL(file);
                });
              }}
              className="hidden"
            />

            <div className="mt-auto pt-10">
              <button type="submit" className="w-full rounded-xl bg-primary px-6 py-3.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5">
                {labelSimpan}
              </button>

              {tersimpan && (
                <div className="mt-3 text-center">
                  <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-green-600">
                    <Check className="h-3.5 w-3.5" />
                    Perubahan berhasil diterapkan untuk sesi admin ini.
                  </p>
                  <p className="mt-1 text-[10px] text-dark-400">
                    Perubahan ini hanya berlaku selama sesi admin.
                  </p>
                </div>
              )}
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
};

export default PengaturanPage;
