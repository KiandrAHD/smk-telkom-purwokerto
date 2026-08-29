import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import FormInput from '../../components/dashboard/FormInput';
import Modal from '../../components/dashboard/Modal';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useAdminData } from '../../context/AdminDataContext';
import { adminKategoriBerita, adminStatusBerita } from '../../data/dummyData';
import { formatTanggal } from '../../utils/tanggal';

const BeritaPage = () => {
  const { berita, hapusBerita } = useAdminData();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  // Kata kunci hidup di URL supaya pencarian dari header global mendarat di sini
  // dan hasilnya tetap sama ketika tautannya dibuka ulang.
  const cari = params.get('cari') ?? '';
  const [kategori, setKategori] = useState('Semua Kategori');
  const [status, setStatus] = useState('Semua Status');
  const [akanDihapus, setAkanDihapus] = useState(null);

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    return berita.filter(
      (b) =>
        (!kata || b.judul.toLowerCase().includes(kata)) &&
        (kategori === 'Semua Kategori' || b.kategori === kategori) &&
        (status === 'Semua Status' || b.status === status)
    );
  }, [berita, cari, kategori, status]);

  const columns = [
    { key: 'no', header: 'No', kelas: 'w-14' },
    {
      key: 'thumbnail',
      header: 'Thumbnail',
      kelas: 'w-28',
      render: () => (
        <span className="flex h-11 w-16 items-center justify-center rounded-lg bg-dark-100 text-dark-400">
          <ImageIcon className="h-4 w-4" />
        </span>
      ),
    },
    {
      key: 'judul',
      header: 'Judul Berita',
      render: (b) => (
        <Link
          to={`/dashboard/berita/${b.id}/edit`}
          className="font-medium text-dark-800 transition-colors hover:text-primary"
        >
          {b.judul}
        </Link>
      ),
    },
    {
      key: 'kategori',
      header: 'Kategori',
      kelas: 'w-36 text-center',
      render: (b) => <StatusBadge nilai={b.kategori} />,
    },
    {
      key: 'tanggal',
      header: 'Tanggal Publish',
      kelas: 'w-40',
      render: (b) => formatTanggal(b.tanggal),
    },
    {
      key: 'status',
      header: 'Status',
      kelas: 'w-36 text-center',
      render: (b) => <StatusBadge nilai={b.status} />,
    },
    {
      key: 'aksi',
      header: 'Aksi',
      kelas: 'w-24',
      render: (b) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/berita/${b.id}/edit`)}
            aria-label={`Edit ${b.judul}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-primary-50 hover:text-primary"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setAkanDihapus(b)}
            aria-label={`Hapus ${b.judul}`}
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
        judul="Manajemen Berita"
        breadcrumb={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Berita' }]}
        aksi={
          <Link
            to="/dashboard/berita/tambah"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4" />
            Tambah Berita Baru
          </Link>
        }
      />

      <div className="mb-5 rounded-2xl border border-dark-100 bg-white p-5 shadow-card">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_14rem_14rem_auto]">
          <FormInput
            type="search"
            value={cari}
            onChange={(e) => {
              const kata = e.target.value;
              setParams(kata ? { cari: kata } : {}, { replace: true });
            }}
            placeholder="Cari judul berita..."
          />
          <FormInput
            as="select"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            options={['Semua Kategori', ...adminKategoriBerita]}
          />
          <FormInput
            as="select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={['Semua Status', ...adminStatusBerita]}
          />
          <button
            type="button"
            onClick={() => {
              setParams({}, { replace: true });
              setKategori('Semua Kategori');
              setStatus('Semua Status');
            }}
            className="rounded-xl border border-dark-200 px-6 py-3 text-xs font-bold text-dark-700 transition-colors hover:border-primary hover:text-primary"
          >
            {cari || kategori !== 'Semua Kategori' || status !== 'Semua Status'
              ? 'Reset Filter'
              : 'Filter'}
          </button>
        </div>
      </div>

      <DataTable columns={columns} rows={hasil} kosong="Tidak ada berita yang cocok dengan filter." />

      <Modal
        terbuka={Boolean(akanDihapus)}
        onTutup={() => setAkanDihapus(null)}
        judul="Hapus berita ini?"
        deskripsi={akanDihapus?.judul}
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
                hapusBerita(akanDihapus.id);
                setAkanDihapus(null);
              }}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
            >
              Hapus
            </button>
          </>
        }
      >
        <p className="text-xs leading-relaxed text-dark-500">
          Berita akan hilang dari daftar. Tindakan ini tidak bisa dibatalkan.
        </p>
      </Modal>
    </section>
  );
};

export default BeritaPage;
