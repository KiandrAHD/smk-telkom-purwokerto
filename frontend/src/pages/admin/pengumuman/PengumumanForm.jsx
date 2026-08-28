import { useState } from 'react';
import { slugify } from '../../../utils/slug';

const emptyForm = {
  judul: '',
  slug: '',
  ringkasan: '',
  konten: '',
  gambar_url: '',
  tanggal: '',
  status: 'draft',
};

const inputClass = 'w-full rounded-lg border border-dark-200 px-3 py-2.5 text-sm text-dark-900 outline-none transition-colors placeholder:text-dark-400 focus:border-primary';
const labelClass = 'mb-1.5 block text-xs font-semibold text-dark-700';

const toDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
};

const normalizeInitialData = (initialData) => ({
  ...emptyForm,
  ...initialData,
  tanggal: toDateTimeLocal(initialData?.tanggal),
});

const PengumumanForm = ({ initialData, onSubmit, onCancel, submitting }) => {
  const [form, setForm] = useState(() => normalizeInitialData(initialData));
  const [slugEdited, setSlugEdited] = useState(Boolean(initialData));
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleTitleChange = (value) => {
    setForm((current) => ({
      ...current,
      judul: value,
      ...(slugEdited ? {} : { slug: slugify(value) }),
    }));
    setErrors((current) => ({ ...current, judul: '', slug: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.judul.trim()) nextErrors.judul = 'Judul wajib diisi.';
    if (!form.slug.trim()) nextErrors.slug = 'Slug wajib diisi.';
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
      nextErrors.slug = 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.';
    }
    if (!form.konten.trim()) nextErrors.konten = 'Konten wajib diisi.';
    if (!form.status) nextErrors.status = 'Status wajib dipilih.';
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
      ringkasan: form.ringkasan.trim() || null,
      konten: form.konten.trim(),
      gambar_url: form.gambar_url.trim() || null,
      tanggal: form.tanggal ? new Date(form.tanggal).toISOString() : null,
      status: form.status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="pengumuman-judul" className={labelClass}>Judul *</label>
        <input id="pengumuman-judul" value={form.judul} onChange={(event) => handleTitleChange(event.target.value)} className={inputClass} autoFocus required />
        {errors.judul && <p className="mt-1 text-xs text-primary-700">{errors.judul}</p>}
      </div>

      <div>
        <label htmlFor="pengumuman-slug" className={labelClass}>Slug *</label>
        <input
          id="pengumuman-slug"
          value={form.slug}
          onChange={(event) => {
            setSlugEdited(true);
            updateField('slug', event.target.value);
          }}
          className={inputClass}
          placeholder="judul-pengumuman"
          required
        />
        {errors.slug && <p className="mt-1 text-xs text-primary-700">{errors.slug}</p>}
      </div>

      <div>
        <label htmlFor="pengumuman-ringkasan" className={labelClass}>Ringkasan</label>
        <textarea id="pengumuman-ringkasan" value={form.ringkasan} onChange={(event) => updateField('ringkasan', event.target.value)} className={`${inputClass} min-h-20 resize-y`} rows="3" />
      </div>

      <div>
        <label htmlFor="pengumuman-konten" className={labelClass}>Konten *</label>
        <textarea id="pengumuman-konten" value={form.konten} onChange={(event) => updateField('konten', event.target.value)} className={`${inputClass} min-h-40 resize-y`} rows="7" required />
        {errors.konten && <p className="mt-1 text-xs text-primary-700">{errors.konten}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pengumuman-gambar" className={labelClass}>Gambar URL</label>
          <input id="pengumuman-gambar" type="url" value={form.gambar_url} onChange={(event) => updateField('gambar_url', event.target.value)} className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label htmlFor="pengumuman-tanggal" className={labelClass}>Tanggal Pengumuman</label>
          <input id="pengumuman-tanggal" type="datetime-local" value={form.tanggal} onChange={(event) => updateField('tanggal', event.target.value)} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="pengumuman-status" className={labelClass}>Status *</label>
        <select id="pengumuman-status" value={form.status} onChange={(event) => updateField('status', event.target.value)} className={inputClass} required>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        {errors.status && <p className="mt-1 text-xs text-primary-700">{errors.status}</p>}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-dark-100 pt-4 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={submitting} className="rounded-lg border border-dark-200 px-4 py-2.5 text-xs font-bold text-dark-600 transition-colors hover:border-dark-400 disabled:opacity-50">Batal</button>
        <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? 'Menyimpan...' : 'Simpan Pengumuman'}
        </button>
      </div>
    </form>
  );
};

export default PengumumanForm;

