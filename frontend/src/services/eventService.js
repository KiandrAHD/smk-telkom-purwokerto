import { ensureSupabase } from './supabase';
import { saveWithContentImage } from './contentImageService';
import { eventPayload } from '../utils/events';

const columns = 'id,judul,ringkasan,deskripsi,kategori,tanggal_mulai,waktu_mulai,tanggal_selesai,waktu_selesai,lokasi,penyelenggara,gambar_url,link_informasi,status,created_at,updated_at';
const unwrap = ({ data, error }) => { if (error) throw error; return data; };
export const getEvents = async (published = false, signal) => {
  const items = [];
  for (let offset = 0; ; offset += 500) {
    let query = ensureSupabase().from('events').select(columns).order('tanggal_mulai').order('waktu_mulai').order('id').range(offset, offset + 499);
    if (published) query = query.eq('status', 'published');
    if (signal) query = query.abortSignal(signal);
    const rows = unwrap(await query); items.push(...rows);
    if (rows.length < 500) return items;
  }
};
function changed() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('school-events-changed'));
  try { localStorage.setItem('school-events-changed', `${Date.now()}-${Math.random()}`); } catch { /* Focus refresh also works when storage is unavailable. */ }
}
export async function createEvent(data, id) {
  const client = ensureSupabase();
  // Stable form UUID makes a retry after a lost response update the same event.
  const saved = await saveWithContentImage(client, { ...eventPayload(data), image_file: data.image_file }, 'events', 'gambar_url', async payload => unwrap(await client.from('events').upsert({ ...payload, id }, { onConflict: 'id' }).select(columns).single()));
  changed(); return saved;
}
export async function updateEvent(id, data) {
  const client = ensureSupabase();
  const saved = await saveWithContentImage(client, { ...eventPayload(data), image_file: data.image_file }, 'events', 'gambar_url', async payload => unwrap(await client.from('events').update(payload).eq('id', id).select(columns).single()));
  changed(); return saved;
}
export async function deleteEvent(id) {
  const deleted = unwrap(await ensureSupabase().from('events').delete().eq('id', id).select('id').single());
  changed(); return deleted;
}
export function eventError(error) {
  if (['PGRST205', '42P01'].includes(error?.code)) return 'Tabel kegiatan belum tersedia. Terapkan migration 010_calendar_events.sql pada Supabase.';
  if (error?.code === '42501') return 'Anda tidak memiliki izin untuk mengelola kegiatan.';
  if (error?.code === 'PGRST116') return 'Kegiatan tidak ditemukan atau Anda tidak memiliki izin.';
  if (error?.code?.startsWith('CONTENT_IMAGE_') || error?.fields) return error.message;
  return 'Kegiatan gagal dimuat atau disimpan. Periksa koneksi lalu coba lagi.';
}
