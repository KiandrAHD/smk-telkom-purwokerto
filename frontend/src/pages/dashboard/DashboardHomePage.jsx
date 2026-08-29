import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import DataTable from '../../components/dashboard/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useAdminData } from '../../context/AdminDataContext';
import { adminPpdbStats, adminProfil } from '../../data/dummyData';
import { formatTanggal } from '../../utils/tanggal';

// Catatan: desain halaman ini tidak ikut di PDF referensi (berkasnya mulai dari
// halaman 2). Susunannya memakai komponen yang sama dengan halaman lain supaya
// tetap satu bahasa visual, dan gampang diganti kalau desainnya menyusul.
const DashboardHomePage = () => {
  const { berita, pendaftar } = useAdminData();

  const columns = [
    { key: 'no', header: 'No', kelas: 'w-14' },
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
    { key: 'tanggal', header: 'Tanggal', kelas: 'w-36', render: (b) => formatTanggal(b.tanggal) },
    {
      key: 'status',
      header: 'Status',
      kelas: 'w-32 text-center',
      render: (b) => <StatusBadge nilai={b.status} />,
    },
  ];

  const belumDiverifikasi = pendaftar.filter((p) => p.status === 'Belum Diverifikasi').length;

  return (
    <section>
      <PageHeader judul="Dashboard" breadcrumb={[{ label: 'Dashboard' }]} />

      <div className="mb-6 rounded-2xl bg-primary px-6 py-6 text-white">
        <p className="font-heading text-lg font-extrabold">Selamat datang, {adminProfil.nama}.</p>
        <p className="mt-1.5 text-xs text-white/80">
          {belumDiverifikasi > 0
            ? `Ada ${belumDiverifikasi} pendaftar yang belum diverifikasi.`
            : 'Semua pendaftar sudah diverifikasi.'}
        </p>
        <Link
          to="/dashboard/ppdb"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-primary transition-transform hover:-translate-y-0.5"
        >
          Buka Manajemen PPDB
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {adminPpdbStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-extrabold text-dark-900">Berita Terbaru</h2>
        <Link
          to="/dashboard/berita"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
        >
          Lihat semua
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <DataTable columns={columns} rows={berita} perPage={5} kosong="Belum ada berita." />
    </section>
  );
};

export default DashboardHomePage;
