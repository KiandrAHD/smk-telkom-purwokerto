import { ensureSupabase } from './supabase';
import { spmbInfoPayload, spmbStatisticsId } from '../utils/spmbInformation';

const columns = 'id,jenis,judul,deskripsi,urutan,tanggal_mulai,tanggal_selesai,tanggal_seleksi,tanggal_pengumuman,ikon,tautan_url,sumber_url,status,kuota_total,created_at,updated_at';
const publicColumns = 'id,jenis,judul,deskripsi,urutan,tanggal_mulai,tanggal_selesai,tanggal_seleksi,tanggal_pengumuman,ikon,tautan_url,status,kuota_total,created_at,updated_at';
const unwrap = ({ data, error }) => { if (error) throw error; return data; };
export async function getSpmbInformation(published = false, signal) {
  const items = [];
  for (let offset = 0; ; offset += 500) {
    let query = ensureSupabase().from(published ? 'spmb_information_public' : 'spmb_information').select(published ? publicColumns : columns).order('urutan').order('tanggal_mulai').order('id').range(offset, offset + 499);
    if (published) query = query.eq('status', 'published');
    if (signal) query = query.abortSignal(signal);
    const rows = unwrap(await query); items.push(...rows);
    if (rows.length < 500) return items;
  }
}
export async function getSpmbStatistics(signal) {
  let query = ensureSupabase().rpc('get_spmb_statistics');
  if (signal) query = query.abortSignal(signal);
  return unwrap(await query);
}
function changed() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('school-spmb-information-changed'));
  try { localStorage.setItem('school-spmb-information-changed', `${Date.now()}-${Math.random()}`); } catch { /* Focus refresh remains available. */ }
}
export async function createSpmbInformation(data, id) {
  const payload = spmbInfoPayload(data);
  if (payload.jenis === 'statistik') throw new Error('Gunakan pengaturan kuota untuk memperbarui statistik.');
  const saved = unwrap(await ensureSupabase().from('spmb_information').insert({ ...payload, id }).select(columns).single());
  changed(); return saved;
}
export async function updateSpmbInformation(id, data) {
  const saved = unwrap(await ensureSupabase().from('spmb_information').update(spmbInfoPayload(data)).eq('id', id).select(columns).single());
  changed(); return saved;
}
export async function deleteSpmbInformation(id) {
  if (id === spmbStatisticsId) throw new Error('Statistik tidak dapat dihapus. Kuota dapat dikosongkan.');
  const deleted = unwrap(await ensureSupabase().from('spmb_information').delete().eq('id', id).select('id').single());
  changed(); return deleted;
}
export function spmbInformationError(error) {
  if (error?.code === '23514') return 'Data informasi ditolak database. Periksa isian dan pastikan migration 012_spmb_information.sql sudah diterapkan.';
  if (['PGRST205', '42P01', 'PGRST202', '42883'].includes(error?.code)) return 'Informasi SPMB belum tersedia. Terapkan migration 012_spmb_information.sql pada Supabase.';
  if (error?.code === '42501') return 'Anda tidak memiliki izin untuk mengelola informasi SPMB.';
  if (error?.code === 'PGRST116') return 'Informasi tidak ditemukan atau Anda tidak memiliki izin.';
  if (error?.fields) return error.message;
  return 'Informasi SPMB gagal dimuat atau disimpan. Periksa koneksi lalu coba lagi.';
}
