import { useState } from 'react';
import FormInput from '../../../components/dashboard/FormInput';
import { emptySpmbInfo, spmbIcons, spmbIconLabels, validateSpmbInfo } from '../../../utils/spmbInformation';

export default function SpmbInformationForm({ initialData, jenis, onSave, onCancel, submitting }) {
  const [form, setForm] = useState(() => Object.fromEntries(Object.keys(emptySpmbInfo).map(field => [field, initialData?.[field] ?? (field === 'jenis' ? jenis : emptySpmbInfo[field])])));
  const [id] = useState(() => crypto.randomUUID());
  const [errors, setErrors] = useState({});
  const quota = jenis === 'statistik';
  const update = (field, value) => { setForm(current => ({ ...current, [field]: value })); setErrors(current => ({ ...current, [field]: '', submit: '' })); };
  const field = (key, label, props = {}) => <FormInput label={label} value={form[key] ?? ''} onChange={event => update(key, event.target.value)} error={errors[key]} {...props} />;
  const submit = async event => {
    event.preventDefault(); if (submitting) return;
    const next = validateSpmbInfo(form); setErrors(next); if (Object.keys(next).length) return;
    const error = await onSave(form, id); if (error) setErrors({ submit: error });
  };
  return <form onSubmit={submit} noValidate className="space-y-4">
    <fieldset disabled={submitting} className="space-y-4">
      {quota ? <>{field('kuota_total', 'Kuota total', { type: 'number', min: 0, max: 100000, step: 1, autoFocus: true })}<p className="text-xs leading-relaxed text-dark-500">Kosongkan jika kuota resmi belum tersedia. Kuota tersedia dihitung dari kuota total dikurangi siswa berstatus Diterima.</p></> : <>
        {field('judul', 'Nama', { required: true, maxLength: 180, autoFocus: true })}
        {field('deskripsi', 'Deskripsi', { as: 'textarea', rows: 3, maxLength: 5000 })}
        <div className="grid gap-4 sm:grid-cols-2">
          {field('urutan', 'Urutan', { type: 'number', min: 0, max: 9999, step: 1, required: true })}
          {field('status', 'Status publikasi', { as: 'select', options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }] })}
          {['jadwal', 'timeline'].includes(jenis) && <>
            {field('tanggal_mulai', 'Tanggal mulai', { type: 'date', min: '0100-01-01', max: '9999-12-31' })}
            {field('tanggal_selesai', 'Tanggal akhir', { type: 'date', min: form.tanggal_mulai || '0100-01-01', max: '9999-12-31' })}
          </>}
          {jenis === 'jadwal' && <>
            {field('tanggal_seleksi', 'Tanggal seleksi', { type: 'date', min: '0100-01-01', max: '9999-12-31' })}
            {field('tanggal_pengumuman', 'Tanggal pengumuman', { type: 'date', min: form.tanggal_seleksi || '0100-01-01', max: '9999-12-31' })}
          </>}
          {['timeline', 'skema'].includes(jenis) && field('ikon', 'Ikon', { as: 'select', options: [{ value: '', label: 'Ikon standar' }, ...spmbIcons.map(value => ({ value, label: spmbIconLabels[value] }))] })}
        </div>
        {['timeline', 'skema'].includes(jenis) && field('tautan_url', 'Tautan informasi', { maxLength: 2048, placeholder: '/spmb/status atau https://...' })}
        {field('sumber_url', 'Sumber informasi', { maxLength: 2048, placeholder: 'Tautan sumber resmi atau halaman portal' })}
        <p className="text-xs leading-relaxed text-dark-500">Published memerlukan sumber informasi. Tanggal yang belum diumumkan dapat dikosongkan.</p>
      </>}
    </fieldset>
    {errors.submit && <p role="alert" className="rounded-lg bg-primary-50 p-3 text-sm text-primary-800">{errors.submit}</p>}
    <div className="flex flex-col-reverse gap-2 border-t border-dark-100 pt-4 sm:flex-row sm:justify-end">
      <button type="button" onClick={onCancel} disabled={submitting} className="rounded-lg border border-dark-200 px-4 py-2.5 text-xs font-bold text-dark-600 disabled:opacity-50">Batal</button>
      <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-800 disabled:opacity-50">{submitting ? 'Menyimpan...' : quota ? 'Simpan Kuota' : 'Simpan Informasi'}</button>
    </div>
  </form>;
}
