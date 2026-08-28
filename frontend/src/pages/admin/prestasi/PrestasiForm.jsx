import { useState } from 'react';
import { slugify } from '../../../utils/slug';

const emptyForm = {
  judul: '',
  slug: '',
  kategori: '',
  deskripsi: '',
  gambar_url: '',
  tingkat: '',
  tanggal: '',
};

const tingkatOptions = ['Sekolah', 'Kabupaten', 'Provinsi', 'Nasional', 'Internasional', 'Lainnya'];
const inputClass = 'w-full rounded-lg border border-dark-200 px-3 py-2.5 text-sm text-dark-900 outline-none transition-colors placeholder:text-dark-400 focus:border-primary';
const labelClass = 'mb-1.5 block text-xs font-semibold text-dark-700';

const PrestasiForm = ({ initialData, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(() => ({ ...emptyForm, ...initialData, tanggal: initialData?.tanggal || '' }));
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData));
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleTitleChange = (value) => {
    setForm((current) => ({ ...current, judul: value, ...(slugEdited ? {} : { slug: slugify(value) }) }));
    setErrors((current) => ({ ...current, judul: '', slug: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.judul.trim()) nextErrors.judul = 'Judul wajib diisi.';
    if (!form.slug.trim()) nextErrors.slug = 'Slug wajib diisi.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) nextErrors.slug = 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.';
    if (!form.deskripsi.trim()) nextErrors.deskripsi = 'Deskripsi wajib diisi.';
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    await onSubmit({
      judul: form.judul.trim(),
      slug: form.slug.trim(),
      kategori: form.kategori.trim() || null,
      deskripsi: form.deskripsi.trim(),
      gambar_url: form.gambar_url.trim() || null,
      tingkat: form.tingkat || null,
      tanggal: form.tanggal || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="prestasi-judul" className={labelClass}>Judul *</label>
        <input id="prestasi-judul" value={form.judul} onChange={(event) => handleTitleChange(event.target.value)} className={inputClass} autoFocus required />
        {errors.judul && <p className="mt-1 text-xs text-primary-700">{errors.judul}</p>}
      </div>

      <div>
        <label htmlFor="prestasi-slug" className={labelClass}>Slug *</label>
        <input id="prestasi-slug" value={form.slug} onChange={(event) => { setSlugEdited(true); updateField('slug', event.target.value); }} className={inputClass} placeholder="judul-prestasi" required />
        {errors.slug && <p className="mt-1 text-xs text-primary-700">{errors.slug}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="prestasi-kategori" className={labelClass}>Kategori</label>
          <input id="prestasi-kategori" value={form.kategori} onChange={(event) => updateField('kategori', event.target.value)} className={inputClass} list="prestasi-kategori-options" placeholder="Contoh: Teknologi" />
          <datalist id="prestasi-kategori-options">
            {['Akademik', 'Olahraga', 'Teknologi', 'Seni', 'Lainnya'].map((option) => <option key={option} value={option} />)}
          </datalist>
        </div>
        <div>
          <label htmlFor="prestasi-tingkat" className={labelClass}>Tingkat</label>
          <select id="prestasi-tingkat" value={form.tingkat} onChange={(event) => updateField('tingkat', event.target.value)} className={inputClass}>
            <option value="">Pilih tingkat</option>
            {tingkatOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="prestasi-deskripsi" className={labelClass}>Deskripsi *</label>
        <textarea id="prestasi-deskripsi" value={form.deskripsi} onChange={(event) => updateField('deskripsi', event.target.value)} className={`${inputClass} min-h-40 resize-y`} rows="7" required />
        {errors.deskripsi && <p className="mt-1 text-xs text-primary-700">{errors.deskripsi}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="prestasi-gambar" className={labelClass}>Gambar URL</label>
          <input id="prestasi-gambar" type="url" value={form.gambar_url} onChange={(event) => updateField('gambar_url', event.target.value)} className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label htmlFor="prestasi-tanggal" className={labelClass}>Tanggal</label>
          <input id="prestasi-tanggal" type="date" value={form.tanggal} onChange={(event) => updateField('tanggal', event.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-dark-100 pt-4 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={submitting} className="rounded-lg border border-dark-200 px-4 py-2.5 text-xs font-bold text-dark-600 transition-colors hover:border-dark-400 disabled:opacity-50">Batal</button>
        <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? 'Menyimpan...' : 'Simpan Prestasi'}
        </button>
      </div>
    </form>
  );
};

export default PrestasiForm;

