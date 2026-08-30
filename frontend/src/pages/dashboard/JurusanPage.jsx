import { useState } from 'react';
import { CheckCircle2, Pencil, Plus, Trash2, X } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import FormInput from '../../components/dashboard/FormInput';
import Modal from '../../components/dashboard/Modal';
import PageHeader from '../../components/dashboard/PageHeader';
import { useAdminData } from '../../context/AdminDataContext';

const KOSONG = { nama: '', kode: '', deskripsi: '', jumlahSiswa: '' };

const JurusanPage = () => {
  const { jurusan, tambahJurusan, ubahJurusan, hapusJurusan } = useAdminData();
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [form, setForm] = useState(KOSONG);
  const [akanDihapus, setAkanDihapus] = useState(null);
  const [sedangDiedit, setSedangDiedit] = useState(null);
  const [feedback, setFeedback] = useState('');

  const ubah = (kunci) => (e) => setForm((f) => ({ ...f, [kunci]: e.target.value }));

  const simpan = (e) => {
    e.preventDefault();
    const data = { ...form, jumlahSiswa: Number(form.jumlahSiswa) || 0 };
    if (sedangDiedit) {
      ubahJurusan(sedangDiedit.id, data);
      setFeedback('Jurusan berhasil diperbarui.');
    } else {
      tambahJurusan(data);
      setFeedback('Jurusan berhasil ditambahkan.');
    }
    setForm(KOSONG);
    setSedangDiedit(null);
    setFormTerbuka(false);
  };

  const bukaTambah = () => {
    setForm(KOSONG);
    setSedangDiedit(null);
    setFormTerbuka(true);
  };

  const bukaEdit = (item) => {
    setForm({ ...item, jumlahSiswa: String(item.jumlahSiswa ?? '') });
    setSedangDiedit(item);
    setFormTerbuka(true);
  };

  const columns = [
    { key: 'no', header: 'No', kelas: 'w-14' },
    {
      key: 'nama',
      header: 'Nama Jurusan',
      render: (j) => <span className="font-medium text-dark-800">{j.nama}</span>,
    },
    { key: 'kode', header: 'Kode Jurusan', kelas: 'w-36' },
    { key: 'deskripsi', header: 'Deskripsi' },
    { key: 'jumlahSiswa', header: 'Jumlah Siswa', kelas: 'w-32' },
    {
      key: 'aksi',
      header: 'Aksi',
      kelas: 'w-28',
      render: (j) => (
        <div className="flex gap-1">
          <button type="button" onClick={() => bukaEdit(j)} aria-label={`Edit ${j.nama}`} title="Edit" className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-dark-100 hover:text-dark-800">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setAkanDihapus(j)} aria-label={`Hapus ${j.nama}`} title="Hapus" className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-primary-50 hover:text-primary">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section>
      <PageHeader
        judul="Manajemen Jurusan"
        breadcrumb={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Jurusan' }]}
        aksi={
          <button
            type="button"
            onClick={bukaTambah}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Tambah Jurusan
          </button>
        }
      />

      {feedback && (
        <div className="mt-5 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span className="flex-1">{feedback}</span>
          <button type="button" onClick={() => setFeedback('')} aria-label="Tutup notifikasi"><X className="h-4 w-4" /></button>
        </div>
      )}

      <DataTable columns={columns} rows={jurusan} kosong="Belum ada jurusan." />

      <Modal
        terbuka={formTerbuka}
        onTutup={() => setFormTerbuka(false)}
        judul={sedangDiedit ? 'Edit Jurusan' : 'Tambah Jurusan'}
        deskripsi={sedangDiedit ? 'Perbarui data jurusan.' : 'Lengkapi data jurusan baru.'}
      >
        <form onSubmit={simpan} className="space-y-4">
          <FormInput
            label="Nama Jurusan"
            value={form.nama}
            onChange={ubah('nama')}
            placeholder="Contoh: PPLG (Pengembangan Perangkat Lunak dan Gim)"
            required
          />
          <FormInput
            label="Kode Jurusan"
            value={form.kode}
            onChange={ubah('kode')}
            placeholder="Contoh: PPLG"
            required
          />
          <FormInput
            label="Deskripsi"
            as="textarea"
            rows={3}
            value={form.deskripsi}
            onChange={ubah('deskripsi')}
            placeholder="Ringkasan singkat jurusan"
            required
          />
          <FormInput
            label="Jumlah Siswa"
            type="number"
            min="0"
            value={form.jumlahSiswa}
            onChange={ubah('jumlahSiswa')}
            placeholder="0"
            required
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setFormTerbuka(false); setSedangDiedit(null); }}
              className="rounded-xl border border-dark-200 px-5 py-2.5 text-xs font-bold text-dark-700 transition-colors hover:border-dark-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              {sedangDiedit ? 'Simpan Perubahan' : 'Simpan Jurusan'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        terbuka={Boolean(akanDihapus)}
        onTutup={() => setAkanDihapus(null)}
        judul="Hapus jurusan ini?"
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
                hapusJurusan(akanDihapus.id);
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

export default JurusanPage;
