import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import FormInput from '../../components/dashboard/FormInput';
import PpdbPortalLayout from '../../components/ppdb/PpdbPortalLayout';
import { usePpdb } from '../../context/PpdbContext';
import { ppdbAgama, ppdbMataPelajaran, ppdbSemester, ppdbTahunLulus } from '../../data/dummyData';

const JudulSeksi = ({ nomor, teks, kanan }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <h2 className="flex items-center gap-3 font-heading text-sm font-extrabold text-dark-900">
      <span aria-hidden="true" className="h-5 w-1 flex-shrink-0 rounded-full bg-primary" />
      {nomor}. {teks}
    </h2>
    {kanan}
  </div>
);

const RegistrationFormPage = () => {
  const navigate = useNavigate();
  const { biodata, nilai, isiBiodata, isiNilai, draftTersimpan, setDraftTersimpan } = usePpdb();
  const ubah = (kunci) => (e) => isiBiodata({ [kunci]: e.target.value });

  // Semua kolom bertanda `required`, jadi browser menahan submit dan menyorot
  // kolom kosong pertama sebelum fungsi ini jalan.
  const kirim = (e) => {
    e.preventDefault();
    navigate('/ppdb/berkas');
  };

  return (
    <PpdbPortalLayout>
      <h1 className="font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">
        Formulir Pendaftaran Utama
      </h1>
      <p className="mt-1.5 text-xs text-dark-500">
        Lengkapi biodata diri dan riwayat akademik Anda di bawah ini dengan sebenar-benarnya.
      </p>

      <form onSubmit={kirim} className="mt-6 rounded-2xl border border-dark-100 bg-white p-6 shadow-card sm:p-8">
        {/* 1. Biodata */}
        <JudulSeksi nomor="1" teks="Biodata Diri Lengkap" />
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormInput
              label="NIK (Nomor Induk Kependudukan)"
              wajib
              value={biodata.nik}
              onChange={ubah('nik')}
              placeholder="16 Digit NIK di Kartu Keluarga"
              inputMode="numeric"
              maxLength={16}
              required
            />
            <FormInput
              label="Agama"
              wajib
              as="select"
              value={biodata.agama}
              onChange={ubah('agama')}
              required
              options={[{ value: '', label: 'Pilih Agama' }, ...ppdbAgama]}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormInput
              label="Tempat Lahir"
              wajib
              value={biodata.tempatLahir}
              onChange={ubah('tempatLahir')}
              placeholder="Sesuai Akta Kelahiran"
              required
            />
            <FormInput
              label="Tanggal Lahir"
              wajib
              type="date"
              value={biodata.tanggalLahir}
              onChange={ubah('tanggalLahir')}
              required
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-[11px] font-bold text-dark-700">
              Jenis Kelamin<span className="ml-0.5 text-primary">*</span>
            </legend>
            <div className="flex flex-wrap gap-6">
              {['Laki-laki', 'Perempuan'].map((pilihan) => (
                <label key={pilihan} className="flex cursor-pointer items-center gap-2 text-xs text-dark-700">
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value={pilihan}
                    checked={biodata.jenisKelamin === pilihan}
                    onChange={ubah('jenisKelamin')}
                    required
                    className="h-3.5 w-3.5 accent-[color:var(--color-primary)]"
                  />
                  {pilihan}
                </label>
              ))}
            </div>
          </fieldset>

          <FormInput
            label="Alamat Lengkap (Domisili)"
            wajib
            as="textarea"
            rows={3}
            value={biodata.alamat}
            onChange={ubah('alamat')}
            placeholder="Nama Jalan, RT/RW, Desa/Kelurahan, Kecamatan"
            required
          />
        </div>

        {/* 2. Sekolah asal */}
        <div className="mt-10 border-t border-dark-100 pt-8">
          <JudulSeksi nomor="2" teks="Informasi Sekolah Asal" />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-[1fr_12rem]">
            <FormInput
              label="Nama SMP / MTs"
              wajib
              value={biodata.namaSmp}
              onChange={ubah('namaSmp')}
              placeholder="Contoh: SMP Negeri 1 Purwokerto"
              required
            />
            <FormInput
              label="Tahun Lulus"
              wajib
              as="select"
              value={biodata.tahunLulus}
              onChange={ubah('tahunLulus')}
              required
              options={[{ value: '', label: 'Pilih' }, ...ppdbTahunLulus]}
            />
          </div>
        </div>

        {/* 3. Nilai rapor */}
        <div className="mt-10 border-t border-dark-100 pt-8">
          <JudulSeksi
            nomor="3"
            teks="Nilai Rapor (Semester 1 - 5)"
            kanan={
              <span className="rounded-full bg-orange-50 px-3.5 py-1.5 text-[10px] font-bold text-orange-600">
                Skala Nilai: 0 - 100
              </span>
            }
          />
          <p className="mt-3 text-[11px] leading-relaxed text-dark-500">
            Masukkan nilai pengetahuan dari mata pelajaran utama. Pastikan nilai sesuai dengan rapor
            asli yang nantinya akan diunggah.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <thead>
                <tr className="bg-dark-50">
                  <th scope="col" className="rounded-l-xl px-4 py-3 text-[11px] font-bold text-dark-600">
                    Mata Pelajaran
                  </th>
                  {ppdbSemester.map((s, i) => (
                    <th
                      key={s}
                      scope="col"
                      className={`px-3 py-3 text-center text-[11px] font-bold text-dark-600 ${
                        i === ppdbSemester.length - 1 ? 'rounded-r-xl' : ''
                      }`}
                    >
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ppdbMataPelajaran.map((mapel) => (
                  <tr key={mapel.nama} className="border-b border-dark-100 last:border-b-0">
                    <th scope="row" className="px-4 py-3 text-xs font-medium text-dark-700">
                      {mapel.nama}
                      {mapel.catatan && (
                        <span className="mt-0.5 block text-[9px] font-normal text-dark-400">
                          {mapel.catatan}
                        </span>
                      )}
                    </th>
                    {ppdbSemester.map((s) => (
                      <td key={s} className="px-3 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          required
                          aria-label={`${mapel.nama} ${s}`}
                          value={nilai[`${mapel.nama}|${s}`] ?? ''}
                          onChange={(e) => isiNilai(mapel.nama, s, e.target.value)}
                          className="w-full rounded-lg border border-dark-200 px-2 py-2 text-center text-xs text-dark-800 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-dark-100 pt-6">
          <Link
            to="/ppdb/masuk"
            className="text-[11px] font-semibold text-dark-500 transition-colors hover:text-primary"
          >
            &larr; Batal &amp; Kembali
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            {draftTersimpan && (
              <span className="flex items-center gap-1.5 text-[11px] font-medium text-green-600">
                <Check className="h-3.5 w-3.5" />
                Draft tersimpan
              </span>
            )}
            <button
              type="button"
              onClick={() => setDraftTersimpan(true)}
              className="rounded-full border border-dark-200 px-5 py-3 text-xs font-bold text-dark-700 transition-colors hover:border-primary hover:text-primary"
            >
              Simpan Draft
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-card transition-transform hover:-translate-y-0.5"
            >
              Lanjut ke Berkas
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </PpdbPortalLayout>
  );
};

export default RegistrationFormPage;
