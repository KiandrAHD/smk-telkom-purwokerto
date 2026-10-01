import DataTable from '../../components/dashboard/DataTable';
import PageHeader from '../../components/dashboard/PageHeader';
import { useAdminData } from '../../context/AdminDataContext';

const JurusanPage = () => {
  const { jurusan } = useAdminData();

  const columns = [
    { key: 'no', header: 'No', kelas: 'w-14' },
    {
      key: 'nama',
      header: 'Nama Jurusan',
      render: (j) => <span className="font-medium text-dark-800">{j.nama}</span>,
    },
    { key: 'kode', header: 'Kode Jurusan', kelas: 'w-36' },
    { key: 'deskripsi', header: 'Deskripsi' },
    {
      key: 'jumlahSiswa',
      header: 'Jumlah Siswa',
      kelas: 'w-32',
      render: (j) => <span>{j.jumlahSiswa ?? '-'}</span>,
    },
  ];

  return (
    <section>
      <PageHeader
        judul="Manajemen Jurusan"
        breadcrumb={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Jurusan' }]}
      />

      <DataTable columns={columns} rows={jurusan} kosong="Belum ada jurusan." />
      <div className="mt-8 text-center text-xs text-dark-400">
        Daftar jurusan di bawah ini bersifat informasi. Untuk perubahan atau penambahan jurusan, silakan hubungi admin pusat.
      </div>
    </section>
  );
};

export default JurusanPage;
