import { useRef, useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { ppdbFileRules, submitPpdb } from '../../services/ppdbService';

const jurusanOptions = ['Rekayasa Perangkat Lunak (RPL)', 'Pengembangan Game (PG)', 'Teknik Komputer dan Jaringan (TKJ)', 'Teknik Jaringan Akses Telekomunikasi (TJAT)'];
const inputClass = 'w-full rounded-lg border border-dark-200 bg-white px-3 py-2.5 text-sm text-dark-900 outline-none transition-colors placeholder:text-dark-400 focus:border-primary';
const labelClass = 'mb-1.5 block text-xs font-semibold text-dark-700';
const initialForm = { nama_lengkap: '', nisn: '', asal_sekolah: '', tempat_lahir: '', tanggal_lahir: '', jenis_kelamin: '', alamat: '', no_hp: '', email: '', pilihan_jurusan: '' };

const PPDBForm = ({ onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    setSubmitError('');
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.nama_lengkap.trim()) nextErrors.nama_lengkap = 'Nama lengkap wajib diisi.';
    if (!form.asal_sekolah.trim()) nextErrors.asal_sekolah = 'Asal sekolah wajib diisi.';
    if (!form.pilihan_jurusan) nextErrors.pilihan_jurusan = 'Pilihan jurusan wajib dipilih.';
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = 'Format email tidak valid.';
    if (form.no_hp.trim()) {
      const digits = form.no_hp.replace(/\D/g, '');
      if (digits.length < 8 || digits.length > 15 || !/^[0-9+\-\s()]+$/.test(form.no_hp)) nextErrors.no_hp = 'Nomor HP tidak valid.';
    }
    if (form.tanggal_lahir) {
      const birthDate = new Date(`${form.tanggal_lahir}T00:00:00`);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (Number.isNaN(birthDate.getTime()) || birthDate > today) nextErrors.tanggal_lahir = 'Tanggal lahir tidak valid.';
    }
    if (file) {
      if (!ppdbFileRules.allowedTypes.includes(file.type)) nextErrors.dokumen = 'Dokumen harus berupa PDF, JPG/JPEG, atau PNG.';
      else if (file.size > ppdbFileRules.maxSize) nextErrors.dokumen = 'Ukuran dokumen maksimal 10 MB.';
    }
    return nextErrors;
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    setErrors((current) => ({ ...current, dokumen: '' }));
    setSubmitError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const result = await submitPpdb({ ...form, dokumen: file, tanggal_lahir: form.tanggal_lahir || null });
      setForm(initialForm);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onSuccess(result.id);
    } catch (error) {
      setSubmitError(error?.code === '42501' ? 'Pendaftaran tidak dapat dikirim saat ini. Silakan coba lagi.' : 'Pendaftaran gagal dikirim. Periksa koneksi lalu coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <div><label htmlFor="ppdb-nama" className={labelClass}>Nama Lengkap *</label><input id="ppdb-nama" value={form.nama_lengkap} onChange={(event) => updateField('nama_lengkap', event.target.value)} className={inputClass} required />{errors.nama_lengkap && <p className="mt-1 text-xs text-primary-700">{errors.nama_lengkap}</p>}</div>
        <div><label htmlFor="ppdb-nisn" className={labelClass}>NISN</label><input id="ppdb-nisn" value={form.nisn} onChange={(event) => updateField('nisn', event.target.value)} className={inputClass} /></div>
        <div><label htmlFor="ppdb-asal" className={labelClass}>Asal Sekolah *</label><input id="ppdb-asal" value={form.asal_sekolah} onChange={(event) => updateField('asal_sekolah', event.target.value)} className={inputClass} required />{errors.asal_sekolah && <p className="mt-1 text-xs text-primary-700">{errors.asal_sekolah}</p>}</div>
        <div><label htmlFor="ppdb-tempat" className={labelClass}>Tempat Lahir</label><input id="ppdb-tempat" value={form.tempat_lahir} onChange={(event) => updateField('tempat_lahir', event.target.value)} className={inputClass} /></div>
        <div><label htmlFor="ppdb-tanggal" className={labelClass}>Tanggal Lahir</label><input id="ppdb-tanggal" type="date" value={form.tanggal_lahir} onChange={(event) => updateField('tanggal_lahir', event.target.value)} className={inputClass} />{errors.tanggal_lahir && <p className="mt-1 text-xs text-primary-700">{errors.tanggal_lahir}</p>}</div>
        <div><label htmlFor="ppdb-kelamin" className={labelClass}>Jenis Kelamin</label><select id="ppdb-kelamin" value={form.jenis_kelamin} onChange={(event) => updateField('jenis_kelamin', event.target.value)} className={inputClass}><option value="">Pilih jenis kelamin</option><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div>
        <div><label htmlFor="ppdb-hp" className={labelClass}>Nomor HP</label><input id="ppdb-hp" type="tel" value={form.no_hp} onChange={(event) => updateField('no_hp', event.target.value)} className={inputClass} placeholder="08xxxxxxxxxx" />{errors.no_hp && <p className="mt-1 text-xs text-primary-700">{errors.no_hp}</p>}</div>
        <div><label htmlFor="ppdb-email" className={labelClass}>Email</label><input id="ppdb-email" type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} className={inputClass} placeholder="nama@email.com" />{errors.email && <p className="mt-1 text-xs text-primary-700">{errors.email}</p>}</div>
      </div>
      <div><label htmlFor="ppdb-alamat" className={labelClass}>Alamat</label><textarea id="ppdb-alamat" value={form.alamat} onChange={(event) => updateField('alamat', event.target.value)} className={`${inputClass} min-h-24 resize-y`} rows="3" /></div>
      <div><label htmlFor="ppdb-jurusan" className={labelClass}>Pilihan Jurusan *</label><select id="ppdb-jurusan" value={form.pilihan_jurusan} onChange={(event) => updateField('pilihan_jurusan', event.target.value)} className={inputClass} required><option value="">Pilih jurusan</option>{jurusanOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select>{errors.pilihan_jurusan && <p className="mt-1 text-xs text-primary-700">{errors.pilihan_jurusan}</p>}</div>
      <div><label htmlFor="ppdb-dokumen" className={labelClass}>Dokumen Pendukung</label><div className="rounded-lg border border-dashed border-dark-300 p-4"><input ref={fileInputRef} id="ppdb-dokumen" type="file" accept="application/pdf,image/jpeg,image/png" onChange={handleFileChange} className="sr-only" /><button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-dark-200 px-3 py-2 text-xs font-bold text-dark-600 hover:border-primary hover:text-primary"><Upload className="h-4 w-4" />Pilih Dokumen</button>{file ? <p className="mt-2 flex items-center gap-2 text-xs text-dark-600"><FileText className="h-4 w-4 text-primary" />{file.name}</p> : <p className="mt-2 text-xs text-dark-400">PDF, JPG, atau PNG. Maksimal 10 MB.</p>}{errors.dokumen && <p className="mt-1 text-xs text-primary-700">{errors.dokumen}</p>}</div></div>
      {submitError && <p role="alert" className="rounded-lg bg-primary-50 px-4 py-3 text-xs font-medium text-primary-800">{submitError}</p>}
      <button type="submit" disabled={submitting} className="w-full rounded-full bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Mengirim pendaftaran...' : 'Kirim Pendaftaran'}</button>
    </form>
  );
};

export default PPDBForm;

