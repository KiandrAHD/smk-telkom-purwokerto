import { dateFromKey, dateKey } from './calendar';
import { registrationState } from './spmbSchedule';

export const spmbGroups = [
  { value: 'jadwal', label: 'Jadwal Pendaftaran', description: 'Kelola jadwal pendaftaran SPMB.' },
  { value: 'timeline', label: 'Timeline Penerimaan', description: 'Kelola tahapan penerimaan siswa baru.' },
  { value: 'skema', label: 'Skema Masuk', description: 'Kelola informasi jalur penerimaan.' },
  { value: 'persyaratan', label: 'Persyaratan Pendaftaran', description: 'Kelola informasi berkas pendaftaran.' },
  { value: 'syarat', label: 'Syarat Umum', description: 'Kelola ketentuan pendaftaran.' },
];
export const spmbIcons = ['account', 'data', 'upload', 'program', 'selection', 'result', 'register', 'easy', 'digitest', 'service'];
export const spmbIconLabels = { account: 'Akun', data: 'Data', upload: 'Unggah Berkas', program: 'Jurusan', selection: 'Seleksi', result: 'Pengumuman', register: 'Daftar Ulang', easy: 'EASY', digitest: 'DIGITEST', service: 'Layanan' };
export const spmbStatisticsId = '00000000-0000-4000-8000-000000000012';
export const emptySpmbInfo = { jenis: 'jadwal', judul: '', deskripsi: '', urutan: '1', tanggal_mulai: '', tanggal_selesai: '', tanggal_seleksi: '', tanggal_pengumuman: '', ikon: '', tautan_url: '', sumber_url: '', status: 'draft', kuota_total: '' };
export const safeSpmbLink = value => {
  if (typeof value !== 'string' || !value || value.length > 2048 || /[\s\\]/.test(value)) return false;
  if (/^\/(?!\/)/.test(value)) return true;
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= '0100-01-01' && value <= '9999-12-31' && !Number.isNaN(dateFromKey(value).getTime()) && dateKey(dateFromKey(value)) === value;
const integer = value => /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value));

export function validateSpmbInfo(data) {
  const errors = {};
  if (![...spmbGroups.map(group => group.value), 'statistik'].includes(data.jenis)) errors.jenis = 'Jenis informasi tidak valid.';
  if (!String(data.judul || '').trim() || String(data.judul).trim().length > 180) errors.judul = 'Nama wajib diisi, maksimal 180 karakter.';
  if (String(data.deskripsi || '').length > 5000) errors.deskripsi = 'Deskripsi maksimal 5000 karakter.';
  if (!integer(data.urutan) || Number(data.urutan) > 9999) errors.urutan = 'Urutan harus bilangan bulat 0–9999.';
  if (!['draft', 'published'].includes(data.status)) errors.status = 'Pilih Draft atau Published.';
  if (data.ikon && !spmbIcons.includes(data.ikon)) errors.ikon = 'Pilih ikon yang tersedia.';
  for (const field of ['tanggal_mulai', 'tanggal_selesai', 'tanggal_seleksi', 'tanggal_pengumuman']) if (data[field] && !validDate(data[field])) errors[field] = 'Gunakan tanggal yang valid.';
  if (data.tanggal_mulai && data.tanggal_selesai && data.tanggal_selesai < data.tanggal_mulai) errors.tanggal_selesai = 'Tanggal akhir tidak boleh sebelum tanggal mulai.';
  if (data.tanggal_seleksi && data.tanggal_pengumuman && data.tanggal_pengumuman < data.tanggal_seleksi) errors.tanggal_pengumuman = 'Pengumuman tidak boleh sebelum seleksi.';
  for (const field of ['tautan_url', 'sumber_url']) if (data[field] && !safeSpmbLink(data[field])) errors[field] = 'Gunakan tautan http(s) atau path internal yang valid.';
  if (data.jenis !== 'statistik' && data.status === 'published' && !data.sumber_url) errors.sumber_url = 'Cantumkan sumber informasi sebelum dipublikasikan.';
  const quota = data.kuota_total ?? '';
  if (quota !== '' && (data.jenis !== 'statistik' || !integer(quota) || Number(quota) > 100000)) errors.kuota_total = 'Kuota harus bilangan bulat 0–100000 pada statistik.';
  return errors;
}
export function spmbInfoPayload(data) {
  const payload = Object.fromEntries(Object.keys(emptySpmbInfo).map(field => [field, String(data[field] ?? emptySpmbInfo[field]).trim()]));
  const errors = validateSpmbInfo(payload);
  if (Object.keys(errors).length) throw Object.assign(new Error(Object.values(errors)[0]), { fields: errors });
  payload.urutan = Number(payload.urutan);
  payload.kuota_total = payload.kuota_total === '' ? null : Number(payload.kuota_total);
  for (const field of ['tanggal_mulai', 'tanggal_selesai', 'tanggal_seleksi', 'tanggal_pengumuman', 'ikon', 'tautan_url', 'sumber_url']) payload[field] ||= null;
  return payload;
}
export const toSpmbWave = row => ({ id: row.id, name: row.judul, description: row.deskripsi, opensAt: row.tanggal_mulai ? `${row.tanggal_mulai}T00:00:00+07:00` : null, closesAt: row.tanggal_selesai ? `${row.tanggal_selesai}T23:59:59+07:00` : null, selectionAt: row.tanggal_seleksi ? `${row.tanggal_seleksi}T00:00:00+07:00` : null, resultAt: row.tanggal_pengumuman ? `${row.tanggal_pengumuman}T00:00:00+07:00` : null, source: row.sumber_url });
export function registrationForSpmb(items, stats, now = Date.now()) {
  const waves = items.filter(item => item.jenis === 'jadwal' && item.status === 'published').map(toSpmbWave);
  const active = waves.filter(wave => registrationState(wave, now) === 'open').sort((a, b) => a.opensAt.localeCompare(b.opensAt));
  const next = waves.filter(wave => registrationState(wave, now) === 'upcoming').sort((a, b) => a.opensAt.localeCompare(b.opensAt));
  const closed = waves.filter(wave => registrationState(wave, now) === 'closed').sort((a, b) => b.closesAt.localeCompare(a.closesAt));
  const unknown = waves.filter(wave => registrationState(wave, now) === 'unknown');
  const selected = active[0] || next[0] || unknown[0] || closed[0];
  return { opensAt: selected?.opensAt || null, closesAt: selected?.closesAt || null, wave: selected?.name || null, applicants: stats?.total_pendaftar ?? null, quota: stats?.kuota_tersedia ?? null };
}
