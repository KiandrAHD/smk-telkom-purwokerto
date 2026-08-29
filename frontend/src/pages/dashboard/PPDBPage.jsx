import { useNavigate } from 'react-router-dom';
import { BadgeCheck, Eye } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useAdminData } from '../../context/AdminDataContext';
import { adminPpdbStats } from '../../data/dummyData';
import { formatTanggal } from '../../utils/tanggal';

const PPDBPage = () => {
  const { pendaftar, ubahStatusPendaftar } = useAdminData();
  const navigate = useNavigate();

  const columns = [
    { key: 'no', header: 'No', kelas: 'w-14' },
    {
      key: 'nama',
      header: 'Nama Pendaftar',
      render: (p) => <span className="font-medium text-dark-800">{p.nama}</span>,
    },
    { key: 'asalSekolah', header: 'Asal Sekolah' },
    {
      key: 'program',
      header: 'Program Keahlian',
      kelas: 'w-40 text-center',
      render: (p) => <StatusBadge nilai={p.program} />,
    },
    {
      key: 'tanggal',
      header: 'Tanggal Daftar',
      kelas: 'w-36',
      render: (p) => formatTanggal(p.tanggal),
    },
    {
      key: 'status',
      header: 'Status',
      kelas: 'w-44 text-center',
      render: (p) => <StatusBadge nilai={p.status} />,
    },
    {
      key: 'aksi',
      header: 'Aksi',
      kelas: 'w-24',
      render: (p) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/ppdb/${p.id}`)}
            aria-label={`Lihat detail ${p.nama}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-primary-50 hover:text-primary"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => ubahStatusPendaftar(p.id, 'Diverifikasi')}
            disabled={p.status === 'Diverifikasi'}
            aria-label={`Verifikasi ${p.nama}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-dark-500 transition-colors hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-dark-500"
          >
            <BadgeCheck className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <section>
      <PageHeader
        judul="Manajemen PPDB"
        breadcrumb={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Manajemen PPDB' }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {adminPpdbStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <DataTable columns={columns} rows={pendaftar} kosong="Belum ada pendaftar." />
    </section>
  );
};

export default PPDBPage;
