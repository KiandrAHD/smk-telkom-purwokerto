import { useState } from 'react';
import FormInput from '../../components/dashboard/FormInput';
import Logo from '../../components/Logo';
import PageHeader from '../../components/dashboard/PageHeader';
import { useAdminData } from '../../context/AdminDataContext';
import { adminTabPengaturan } from '../../data/dummyData';

const PengaturanPage = () => {
  const { profilSekolah, akun, pengaturanUmum } = useAdminData();
  const [tab, setTab] = useState(adminTabPengaturan[0]);

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
              onClick={() => setTab(nama)}
              className={`rounded-xl px-6 py-3 text-xs font-bold transition-colors ${
                tab === nama ? 'bg-primary text-white' : 'text-dark-700 hover:bg-dark-50 hover:text-primary'
              }`}
            >
              {nama}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem]">
          <div>
            <h2 className="font-heading text-lg font-extrabold text-dark-900">{tab}</h2>

            {tab === adminTabPengaturan[0] && (
              <div className="mt-6 space-y-5">
                <FormInput label="Nama Sekolah" value={profilSekolah.namaSekolah} disabled readOnly />
                <FormInput label="NPSN" value={profilSekolah.npsn} disabled readOnly />
                <FormInput label="Alamat" value={profilSekolah.alamat} disabled readOnly />
                <FormInput label="No. Telepon" value={profilSekolah.telepon} disabled readOnly />
                <FormInput label="Email" type="email" value={profilSekolah.email} disabled readOnly />
                <FormInput label="Website" value={profilSekolah.website} disabled readOnly />
              </div>
            )}

            {tab === adminTabPengaturan[1] && (
              <div className="mt-6 space-y-5">
                <FormInput label="Nama Lengkap" value={akun.namaLengkap} disabled readOnly />
                <FormInput label="Email" type="email" value={akun.email} disabled readOnly />
                <FormInput label="Peran" value={akun.peran} disabled readOnly />
                <p className="text-[11px] leading-relaxed text-dark-400">
                  Data akun administrator terpusat di sistem Supabase Auth.
                </p>
              </div>
            )}

            {tab === adminTabPengaturan[2] && (
              <div className="mt-6 space-y-5">
                <FormInput label="Tahun Ajaran" value={pengaturanUmum.tahunAjaran} disabled readOnly />
                <FormInput label="Status SPMB" value={pengaturanUmum.statusPpdb} disabled readOnly />
                <FormInput label="Berita per Halaman" value={pengaturanUmum.beritaPerHalaman} disabled readOnly />
              </div>
            )}
          </div>

          <aside className="flex flex-col">
            <h2 className="font-heading text-lg font-extrabold text-dark-900">Logo Sekolah</h2>

            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl bg-dark-50 px-6 py-8">
              <Logo className="h-12 w-12" />
              <p className="mt-3 font-heading text-lg font-extrabold text-dark-900">SMK Telkom</p>
              <p className="text-xs text-dark-500">Purwokerto</p>
            </div>

            <p className="mt-4 text-center text-xs text-dark-400">
              Identitas dan konfigurasi sistem dikelola secara terpusat oleh administrator.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default PengaturanPage;
