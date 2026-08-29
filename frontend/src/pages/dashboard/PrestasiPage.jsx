import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import FormInput from '../../components/dashboard/FormInput';
import Modal from '../../components/dashboard/Modal';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useAdminData } from '../../context/AdminDataContext';
import { adminTingkatPrestasi } from '../../data/dummyData';
import { formatTanggal } from '../../utils/tanggal';

const KOSONG = { nama: '', tingkat: 'Nasional', diraihOleh: '', tanggal: '' };

const PrestasiPage = () => {
  const { prestasi, tambahPrestasi, hapusPrestasi } = useAdminData();
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [form, setForm] = useState(KOSONG);
  const [akanDihapus, setAkanDihapus] = useState(null);

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const simpan = (e) => {
    e.preventDefault();
    tambahPrestasi(form);
    setForm(KOSONG);
    setFormTerbuka(false);
  };

  const columns = [
    { key: 'no', header: 'No', kelas: 'w-14' },
    {
      key: 'nama',
      header: 'Nama Prestasi',
      render: (p) => <span className="font-medium text-dark-800">{p.nama}</span>,
    },
    {
      key: 'tingkat',
      header: 'Tingkat',
      kelas: 'w-40 text-center',
      render: (p) => <StatusBadge nilai={p.tingkat} />,
    },
    { key: 'diraihOleh', header: 'Diraih Oleh' },
    {
      key: 'tanggal',
      header: 'Tanggal',
      kelas: 'w-36',
      render: (p) => formatTanggal(p.tanggal),
    },
    {
      key: 'aksi',
      header: '',
      kelas: 'w-16',
      render: (p) => (
        <button
          type="button"
          onClick={() => setAkanDihapus(p)}
          aria-label={`Hapus ${p.nama}`}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-primary-50 hover:text-primary"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return (
    <section>
      <PageHeader
        judul="Manajemen Prestasi"
        breadcrumb={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Prestasi' }]}
        aksi={
          <button
            type="button"
            onClick={() => setFormTerbuka(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Tambah Prestasi
          </button>
        }
      />

      <DataTable columns={columns} rows={prestasi} kosong="Belum ada prestasi." />

      <Modal
        terbuka={formTerbuka}
        onTutup={() => setFormTerbuka(false)}
        judul="Tambah Prestasi"
        deskripsi="Catat prestasi baru yang diraih siswa."
      >
        <form onSubmit={simpan} className="space-y-4">
          <FormInput
            label="Nama Prestasi"
            value={form.nama}
            onChange={ubah('nama')}
            placeholder="Contoh: Juara 1 Lomba IoT Tingkat Nasional"
            required
          />
          <FormInput
            label="Tingkat"
            as="select"
            value={form.tingkat}
            onChange={ubah('tingkat')}
            options={adminTingkatPrestasi}
          />
          <FormInput
            label="Diraih Oleh"
            value={form.diraihOleh}
            onChange={ubah('diraihOleh')}
            placeholder="Nama siswa atau tim"
            required
          />
          <FormInput label="Tanggal" type="date" value={form.tanggal} onChange={ubah('tanggal')} required />

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
              Simpan Prestasi
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        terbuka={Boolean(akanDihapus)}
        onTutup={() => setAkanDihapus(null)}
        judul="Hapus prestasi ini?"
        deskripsi={akanDihapus?.nama}
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
                hapusPrestasi(akanDihapus.id);
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

export default PrestasiPage;
