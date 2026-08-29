import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/dashboard/PageHeader';
import StatusBadge from '../../components/dashboard/StatusBadge';
import { useAdminData } from '../../context/AdminDataContext';
import { adminBerkasPendaftar } from '../../data/dummyData';

const Baris = ({ label, nilai }) => (
  <div>
    <dt className="text-[11px] font-bold text-dark-500">{label}</dt>
    <dd className="mt-1 text-sm text-dark-800">{nilai}</dd>
  </div>
);

const PPDBDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pendaftar, ubahStatusPendaftar } = useAdminData();

  // Isi halaman diambil dari id di URL, bukan ditulis ulang di sini.
  const orang = pendaftar.find((p) => String(p.id) === String(id));

  const breadcrumb = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Manajemen PPDB', to: '/dashboard/ppdb' },
    { label: 'Detail' },
  ];

  if (!orang) {
    return (
      <section>
        <PageHeader judul="Pendaftar tidak ditemukan" breadcrumb={breadcrumb} />
        <div className="rounded-2xl border border-dark-100 bg-white p-8 text-center shadow-card">
          <p className="text-xs text-dark-500">Data pendaftar dengan id {id} tidak ada.</p>
        </div>
      </section>
    );
  }

  const putuskan = (status) => {
    ubahStatusPendaftar(orang.id, status);
    navigate('/dashboard/ppdb');
  };

  return (
    <section>
      <PageHeader judul="Detail Pendaftar" breadcrumb={breadcrumb} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_24rem]">
        <div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-heading text-lg font-extrabold text-dark-900">Informasi Pribadi</h2>
            <StatusBadge nilai={orang.status} />
          </div>

          <dl className="mt-6 space-y-5">
            <Baris label="Nama Lengkap" nilai={orang.nama} />
            <Baris label="Tempat, Tanggal Lahir" nilai={`${orang.tempatLahir}, ${orang.tanggalLahir}`} />
            <Baris label="Jenis Kelamin" nilai={orang.jenisKelamin} />
            <Baris label="NISN" nilai={orang.nisn} />
            <Baris label="Asal Sekolah" nilai={orang.asalSekolah} />
            <Baris label="Alamat" nilai={orang.alamat} />
            <Baris label="No. HP" nilai={orang.telepon} />
            <Baris label="Email" nilai={orang.email} />
          </dl>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
            <h2 className="font-heading text-lg font-extrabold text-dark-900">
              Pilihan Program Keahlian
            </h2>

            <div className="mt-5 space-y-3">
              {[
                { label: 'Pilihan 1', nilai: orang.pilihan1 },
                { label: 'Pilihan 2', nilai: orang.pilihan2 },
              ].map((pilihan) => (
                <div
                  key={pilihan.label}
                  className="flex items-center justify-between rounded-xl border border-dark-100 px-4 py-3.5"
                >
                  <span className="text-[11px] text-dark-500">{pilihan.label}</span>
                  <span className="font-heading text-xs font-bold text-purple-600">{pilihan.nilai}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
            <h2 className="font-heading text-lg font-extrabold text-dark-900">Berkas Pendaftaran</h2>

            <ul className="mt-5 space-y-3">
              {adminBerkasPendaftar.map((berkas) => (
                <li
                  key={berkas.nama}
                  className="flex items-center justify-between gap-3 rounded-xl bg-dark-50 px-4 py-3"
                >
                  <span className="min-w-0 truncate text-xs text-dark-700">{berkas.nama}</span>
                  {/* Berkas sungguhan belum diunggah ke Storage, jadi tautannya
                      diarahkan ke halaman Segera Hadir alih-alih tautan mati. */}
                  <button
                    type="button"
                    onClick={() => navigate('/berkas-pendaftar')}
                    className="flex-shrink-0 rounded-lg bg-white px-4 py-2 font-heading text-[11px] font-bold text-dark-900 shadow-sm transition-colors hover:text-primary"
                  >
                    Lihat
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/ppdb')}
                className="px-3 py-3 font-heading text-xs font-bold text-dark-900 transition-colors hover:text-primary"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={() => putuskan('Diverifikasi')}
                className="rounded-xl bg-green-600 px-7 py-3 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Verifikasi
              </button>
              <button
                type="button"
                onClick={() => putuskan('Ditolak')}
                className="rounded-xl bg-orange-500 px-7 py-3 text-xs font-bold text-white transition-transform hover:-translate-y-0.5"
              >
                Tolak
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PPDBDetailPage;
