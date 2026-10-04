import { useLanguage } from '../../context/LanguageContext';
import { useRef, useState } from 'react';
import DraftFeedback from '../../components/ppdb/DraftFeedback';
import { validatePpdbForm } from '../../utils/ppdbSubmission';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import FormInput from '../../components/dashboard/FormInput';
import PpdbPortalLayout from '../../components/ppdb/PpdbPortalLayout';
import { usePpdb } from '../../context/PpdbContext';
import { ppdbAgama, ppdbJurusanPilihan, ppdbMataPelajaran, ppdbSemester, ppdbTahunLulus } from '../../data/ppdbFormOptions';

const JudulSeksi = ({ nomor, teks, kanan }) => {
  const { t } = useLanguage();
  return (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <h2 className="flex items-center gap-3 font-heading text-sm font-extrabold text-dark-900">
      <span aria-hidden="true" className="h-5 w-1 flex-shrink-0 rounded-full bg-primary" />
      {nomor}. {t(teks)}
    </h2>
    {kanan}
  </div>
);
};

const RegistrationFormPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { biodata, nilai, isiBiodata, isiNilai, draftTersimpan, simpanDraft, draftLoadError } = usePpdb();
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftError, setDraftError] = useState('');
  const ubah = (kunci) => (e) => isiBiodata({ [kunci]: e.target.value });

  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [semesterAktif, setSemesterAktif] = useState(ppdbSemester[0]);
  const issues = submitted ? validatePpdbForm(biodata, nilai) : [];
  const pesan = (issue) => issue ? t(issue.message, Object.fromEntries(Object.entries(issue.variables).map(([key, value]) => [key, typeof value === 'string' ? t(value) : value]))) : '';
  const errorField = (field) => pesan(issues.find((issue) => issue.field === field));
  const kirim = async (e) => {
    e.preventDefault();
    if (draftLoadError) return;
    setSubmitted(true);
    const issue = validatePpdbForm(biodata, nilai)[0];
    if (issue) {
      if (issue.field.includes('|')) setSemesterAktif(issue.field.split('|')[1]);
      requestAnimationFrame(() => {
        const input = Array.from(formRef.current.elements).find((el) => el.name === issue.field && el.getClientRects().length);
        input?.focus();
        input?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      });
      return;
    }
    setSavingDraft(true);
    try {
      await simpanDraft();
      navigate('/spmb/berkas');
    } catch {
      setDraftError('Draft gagal disimpan. Silakan coba lagi.');
    } finally { setSavingDraft(false); }
  };

  const simpan = async () => {
    setSavingDraft(true);
    setDraftError('');
    try {
      await simpanDraft();
    } catch {
      setDraftError('Draft gagal disimpan. Silakan coba lagi.');
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <PpdbPortalLayout>
      <h1 className="font-heading text-xl font-extrabold text-dark-900 sm:text-2xl">{t("Formulir Pendaftaran Utama")} </h1>
      <p className="mt-1.5 text-xs text-dark-500">{t("Lengkapi biodata diri dan riwayat akademik Anda di bawah ini dengan sebenar-benarnya.")} </p>

      <DraftFeedback />
      {issues.length > 0 && (
        <div className="motion-feedback mt-4 rounded-xl bg-red-50 border border-red-200 px-5 py-4">
          <p role="alert" className="text-sm font-semibold text-red-800">{pesan(issues[0])}</p>
          <p className="mt-1 text-xs text-red-600">{t("Pastikan semua field wajib telah diisi dengan benar sebelum melanjutkan.")}</p>
        </div>
      )}

      <form ref={formRef} noValidate onSubmit={kirim} className="mt-6 rounded-2xl border border-dark-100 bg-white p-6 shadow-card sm:p-8">
        {/* 1. Biodata */}
        <JudulSeksi nomor="1" teks="Biodata Diri Lengkap" />
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormInput label={t("NISN Siswa")} wajib name="nisn" error={errorField('nisn')} value={biodata.nisn} onChange={ubah('nisn')} inputMode="numeric" maxLength={10} required />
            <FormInput label={t("Nama Lengkap")} wajib name="namaLengkap" error={errorField('namaLengkap')} value={biodata.namaLengkap} onChange={ubah('namaLengkap')} required />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormInput label={t("Nomor WhatsApp")} wajib type="tel" name="whatsapp" error={errorField('whatsapp')} value={biodata.whatsapp} onChange={ubah('whatsapp')} required />
            <FormInput label={t("Peminatan Jurusan")} wajib as="select" name="jurusan" error={errorField('jurusan')} value={biodata.jurusan} onChange={ubah('jurusan')} required options={[{ value: '', label: t('Pilih Jurusan') }, ...ppdbJurusanPilihan.map((value) => ({ value, label: t(value) }))]} />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormInput
              label={t("NIK (Nomor Induk Kependudukan)")}
              wajib
              name="nik" error={errorField('nik')} value={biodata.nik}
              onChange={ubah('nik')}
              placeholder={t("16 Digit NIK di Kartu Keluarga")}
              inputMode="numeric"
              maxLength={16}
              required
            />
            <FormInput
              label={t("Agama")}
              wajib
              as="select"
              name="agama" error={errorField('agama')} value={biodata.agama}
              onChange={ubah('agama')}
              required
              options={[{ value: '', label: t('Pilih Agama') }, ...ppdbAgama.map((value) => ({ value, label: t(value) }))]}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormInput
              label={t("Tempat Lahir")}
              wajib
              name="tempatLahir" error={errorField('tempatLahir')} value={biodata.tempatLahir}
              onChange={ubah('tempatLahir')}
              placeholder={t("Sesuai Akta Kelahiran")}
              required
            />
            <FormInput
              label={t("Tanggal Lahir")}
              wajib
              type="date"
              name="tanggalLahir" error={errorField('tanggalLahir')} value={biodata.tanggalLahir}
              onChange={ubah('tanggalLahir')}
              required
            />
          </div>

          <fieldset aria-invalid={Boolean(errorField('jenisKelamin'))}>
            <legend className="mb-2 text-[11px] font-bold text-dark-700">{t("Jenis Kelamin")}<span className="ml-0.5 text-primary">*</span>
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
                  {t(pilihan)}
                </label>
              ))}
            </div>
            {errorField('jenisKelamin') && <p className="mt-2 text-xs text-red-700">{errorField('jenisKelamin')}</p>}
          </fieldset>

          <FormInput
            label={t("Alamat Lengkap (Domisili)")}
            wajib
            as="textarea"
            rows={3}
            name="alamat" error={errorField('alamat')} value={biodata.alamat}
            onChange={ubah('alamat')}
            placeholder={t("Nama Jalan, RT/RW, Desa/Kelurahan, Kecamatan")}
            required
          />
        </div>

        {/* 2. Sekolah asal */}
        <div className="mt-10 border-t border-dark-100 pt-8">
          <JudulSeksi nomor="2" teks="Informasi Sekolah Asal" />
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-[1fr_12rem]">
            <FormInput
              label={t("Nama SMP / MTs")}
              wajib
              name="namaSmp" error={errorField('namaSmp')} value={biodata.namaSmp}
              onChange={ubah('namaSmp')}
              placeholder={t("Contoh: SMP Negeri 1 Purwokerto")}
              required
            />
            <FormInput
              label={t("Tahun Lulus")}
              wajib
              as="select"
              name="tahunLulus" error={errorField('tahunLulus')} value={biodata.tahunLulus}
              onChange={ubah('tahunLulus')}
              required
              options={[{ value: '', label: t('Pilih') }, ...ppdbTahunLulus]}
            />
          </div>
        </div>

        {/* 3. Nilai rapor */}
        <div className="mt-10 border-t border-dark-100 pt-8">
          <JudulSeksi
            nomor="3"
            teks="Nilai Rapor (Semester 1 - 5)"
            kanan={
              <span className="rounded-full bg-orange-50 px-3.5 py-1.5 text-[10px] font-bold text-orange-600">{t("Skala Nilai: 0 - 100")} </span>
            }
          />
          <p className="mt-3 text-[11px] leading-relaxed text-dark-500">{t("Masukkan nilai pengetahuan dari mata pelajaran utama. Pastikan nilai sesuai dengan rapor asli yang nantinya akan diunggah.")} </p>

          <div className="mt-5 sm:hidden">
            <FormInput label={t("Pilih semester")} as="select" value={semesterAktif} onChange={(e) => setSemesterAktif(e.target.value)} options={ppdbSemester.map((value) => ({ value, label: t(value) }))} />
            <div className="mt-4 grid gap-4">
              {ppdbMataPelajaran.map(({ nama }) => <FormInput key={nama} label={t(nama)} name={`${nama}|${semesterAktif}`} error={errorField(`${nama}|${semesterAktif}`)} type="number" min="0" max="100" step="any" inputMode="decimal" value={nilai[`${nama}|${semesterAktif}`] ?? ''} onChange={(e) => isiNilai(nama, semesterAktif, e.target.value)} />)}
            </div>
            <p className="mt-4 text-xs text-dark-500">{t("Nilai terisi: {count}/25", { count: ppdbMataPelajaran.flatMap(({ nama }) => ppdbSemester.map((s) => nilai[`${nama}|${s}`])).filter((v) => v !== undefined && v !== null && String(v).trim() !== '').length })}</p>
          </div>
          <div className="mt-5 hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <thead>
                <tr className="bg-dark-50">
                  <th scope="col" className="rounded-l-xl px-4 py-3 text-[11px] font-bold text-dark-600">{t("Mata Pelajaran")} </th>
                  {ppdbSemester.map((s, i) => (
                    <th
                      key={s}
                      scope="col"
                      className={`px-3 py-3 text-center text-[11px] font-bold text-dark-600 ${
                        i === ppdbSemester.length - 1 ? 'rounded-r-xl' : ''
                      }`}
                    >
                      {t(s)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ppdbMataPelajaran.map((mapel) => (
                  <tr key={mapel.nama} className="border-b border-dark-100 last:border-b-0">
                    <th scope="row" className="px-4 py-3 text-xs font-medium text-dark-700">
                      {t(mapel.nama)}
                      {mapel.catatan && (
                        <span className="mt-0.5 block text-[9px] font-normal text-dark-400">
                          {t(mapel.catatan)}
                        </span>
                      )}
                    </th>
                    {ppdbSemester.map((s) => (
                      <td key={s} className="px-3 py-3">
                        <input
                          name={`${mapel.nama}|${s}`}
                          aria-invalid={Boolean(errorField(`${mapel.nama}|${s}`))}
                          inputMode="decimal"
                          type="number"
                          min="0"
                          max="100"
                          step="any"
                          required
                          aria-label={`${t(mapel.nama)} ${t(s)}`}
                          value={nilai[`${mapel.nama}|${s}`] ?? ''}
                          onChange={(e) => isiNilai(mapel.nama, s, e.target.value)}
                          className="w-full rounded-lg border border-dark-200 px-2 py-2 text-center text-xs text-dark-800 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />
                        {errorField(`${mapel.nama}|${s}`) && <p className="mt-1 text-[10px] text-red-700">{errorField(`${mapel.nama}|${s}`)}</p>}
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
            to="/spmb/status"
            className="text-[11px] font-semibold text-dark-500 transition-colors hover:text-primary"
          >{t("← Batal & Kembali")} </Link>

          <div className="flex flex-wrap items-center gap-3">
            {draftError && <span role="alert" className="text-[11px] text-primary">{t(draftError)}</span>}
            {draftTersimpan && (
              <span className="motion-feedback flex items-center gap-1.5 text-[11px] font-medium text-green-600">
                <Check className="h-3.5 w-3.5" />{t("Draft tersimpan")} </span>
            )}
            <button
              type="button"
              onClick={simpan}
              disabled={savingDraft || Boolean(draftLoadError)}
              className="rounded-full border border-dark-200 px-5 py-3 text-xs font-bold text-dark-700 transition-colors hover:border-primary hover:text-primary"
            >
              {t(savingDraft ? 'Menyimpan...' : 'Simpan Draft')}
            </button>
            <button
              type="submit"
              disabled={savingDraft || Boolean(draftLoadError)}
              className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-bold text-white shadow-card transition-transform hover:-translate-y-0.5"
            >{t("Lanjut ke Berkas")} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </form>
    </PpdbPortalLayout>
  );
};

export default RegistrationFormPage;
