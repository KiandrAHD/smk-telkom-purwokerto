import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import FormInput from '../../components/dashboard/FormInput';
import Modal from '../../components/dashboard/Modal';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import { useAdminData } from '../../context/AdminDataContext';
import { adminBkkStats } from '../../data/dummyData';
import { formatTanggal } from '../../utils/tanggal';

const KOSONG = { posisi: '', perusahaan: '', tanggalPosting: '', batasLamaran: '' };

const BKKPage = () => {
  const { lowongan, tambahLowongan, hapusLowongan } = useAdminData();
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [form, setForm] = useState(KOSONG);
  const [akanDihapus, setAkanDihapus] = useState(null);
  const [sedangDiubah, setSedangDiubah] = useState(null);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const simpan = (e) => {
    e.preventDefault();
    tambahLowongan(form);
    setForm(KOSONG);
    setFormTerbuka(false);
  };

  const columns = [
    { key: 'no', header: 'No', kelas: 'w-14' },
    {
      key: 'posisi',
      header: 'Posisi',
      render: (l) => <span className="font-medium text-dark-800">{l.posisi}</span>,
    },
    { key: 'perusahaan', header: 'Perusahaan' },
    {
      key: 'tanggalPosting',
      header: 'Tanggal Posting',
      kelas: 'w-40',
      render: (l) => formatTanggal(l.tanggalPosting),
    },
    {
      key: 'batasLamaran',
      header: 'Batas Lamaran',
      kelas: 'w-40',
      render: (l) => formatTanggal(l.batasLamaran),
    },
    {
      key: 'aksi',
      header: 'Aksi',
      kelas: 'w-24',
      render: (l) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSedangDiubah(l)}
            aria-label={`Lihat ${l.posisi}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-primary-50 hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setAkanDihapus(l)}
            aria-label={`Hapus ${l.posisi}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-primary-50 hover:text-primary"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section>
      <PageHeader
        judul="Manajemen BKK (Lowongan)"
        breadcrumb={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'BKK' }]}
        aksi={
          <button
            type="button"
            onClick={() => setFormTerbuka(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Tambah Lowongan
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {adminBkkStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <DataTable columns={columns} rows={lowongan} kosong="Belum ada lowongan." />

      <Modal
        terbuka={formTerbuka}
        onTutup={() => setFormTerbuka(false)}
        judul="Tambah Lowongan"
        deskripsi="Lowongan baru dari perusahaan mitra."
      >
        <form onSubmit={simpan} className="space-y-4">
          <FormInput
            label="Posisi"
            value={form.posisi}
            onChange={ubah('posisi')}
            placeholder="Contoh: Junior Programmer"
            required
          />
          <FormInput
            label="Perusahaan"
            value={form.perusahaan}
            onChange={ubah('perusahaan')}
            placeholder="Contoh: PT Telkom Indonesia"
            required
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="Tanggal Posting"
              type="date"
              value={form.tanggalPosting}
              onChange={ubah('tanggalPosting')}
              required
            />
            <FormInput
              label="Batas Lamaran"
              type="date"
              value={form.batasLamaran}
              onChange={ubah('batasLamaran')}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setFormTerbuka(false)}
              className="rounded-xl border border-dark-200 px-5 py-2.5 text-xs font-bold text-dark-700 transition-colors hover:border-dark-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Simpan Lowongan
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        terbuka={Boolean(sedangDiubah)}
        onTutup={() => setSedangDiubah(null)}
        judul={sedangDiubah?.posisi}
        deskripsi={sedangDiubah?.perusahaan}
      >
        <dl className="space-y-4">
          <div>
            <dt className="text-[11px] font-bold text-dark-500">Tanggal Posting</dt>
            <dd className="mt-1 text-sm text-dark-800">{formatTanggal(sedangDiubah?.tanggalPosting)}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-bold text-dark-500">Batas Lamaran</dt>
            <dd className="mt-1 text-sm text-dark-800">{formatTanggal(sedangDiubah?.batasLamaran)}</dd>
          </div>
        </dl>
      </Modal>

      <Modal
        terbuka={Boolean(akanDihapus)}
        onTutup={() => setAkanDihapus(null)}
        judul="Hapus lowongan ini?"
        deskripsi={akanDihapus?.posisi}
        footer={
          <>
            <button
              type="button"
              onClick={() => setAkanDihapus(null)}
              className="rounded-xl border border-dark-200 px-5 py-2.5 text-xs font-bold text-dark-700 transition-colors hover:border-dark-400"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                hapusLowongan(akanDihapus.id);
                setAkanDihapus(null);
              }}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Hapus
            </button>
          </>
        }
      />
    </section>
  );
};

export default BKKPage;
