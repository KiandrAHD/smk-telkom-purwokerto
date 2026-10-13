import { dateFromKey, dateKey } from './calendar';
import { getSchoolDateKey } from './publicContent';
import { eventCategories, legacyEventCategories, getEventCategory } from '../data/eventCategories';

export { eventCategories, getEventCategory };
export const emptyEvent = { judul: '', ringkasan: '', deskripsi: '', kategori: '', tanggal_mulai: '', waktu_mulai: '', tanggal_selesai: '', waktu_selesai: '', lokasi: '', penyelenggara: '', gambar_url: '', link_informasi: '', status: 'draft' };
const limits = { judul: 180, ringkasan: 500, deskripsi: 20000, lokasi: 240, penyelenggara: 160 };
const validDate = key => /^\d{4}-\d{2}-\d{2}$/.test(key) && key >= '0100-01-01' && key <= '9999-12-31' && !Number.isNaN(dateFromKey(key).getTime()) && dateKey(dateFromKey(key)) === key;
const validTime = time => /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
export function validateEvent(data) {
  const errors = {};
  for (const [field, limit] of Object.entries(limits)) if (String(data[field] || '').trim().length > limit) errors[field] = `Maksimal ${limit} karakter.`;
  if (!String(data.judul || '').trim()) errors.judul = 'Judul kegiatan wajib diisi.';
  if (!validDate(data.tanggal_mulai || '')) errors.tanggal_mulai = 'Tanggal mulai wajib diisi dengan tanggal yang valid.';
  if (data.tanggal_selesai && !validDate(data.tanggal_selesai)) errors.tanggal_selesai = 'Tanggal selesai tidak valid.';
  if (data.tanggal_selesai && data.tanggal_selesai < data.tanggal_mulai) errors.tanggal_selesai = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai.';
  for (const field of ['waktu_mulai', 'waktu_selesai']) if (data[field] && !validTime(data[field])) errors[field] = 'Waktu harus dalam format HH:mm.';
  if ((data.tanggal_selesai || data.tanggal_mulai) === data.tanggal_mulai && data.waktu_mulai && data.waktu_selesai && data.waktu_selesai <= data.waktu_mulai) errors.waktu_selesai = 'Waktu selesai harus setelah waktu mulai pada hari yang sama.';
  if (![...eventCategories, ...legacyEventCategories].some(category => category.value === data.kategori)) errors.kategori = 'Pilih kategori kegiatan yang tersedia.';
  if (!['draft', 'published'].includes(data.status)) errors.status = 'Pilih Draft atau Published.';
  for (const field of ['gambar_url', 'link_informasi']) {
    const value = String(data[field] || '').trim();
    if (!value) continue;
    try { const url = new URL(value); if (value.length > 2048 || /\s/.test(value) || !['https:', 'http:'].includes(url.protocol)) throw new Error(); }
    catch { errors[field] = 'Gunakan tautan http:// atau https:// yang valid (maksimal 2048 karakter).'; }
  }
  return errors;
}
export function eventPayload(data) {
  const payload = Object.fromEntries(Object.keys(emptyEvent).map(field => [field, String(data[field] ?? '').trim()]));
  const errors = validateEvent(payload);
  if (Object.keys(errors).length) throw Object.assign(new Error(Object.values(errors)[0]), { fields: errors });
  for (const field of ['tanggal_selesai', 'waktu_mulai', 'waktu_selesai', 'gambar_url', 'link_informasi']) payload[field] ||= null;
  return payload;
}
export const eventColor = event => getEventCategory(event.category || event.kategori).badgeClass;
export function toCalendarEvent(row) {
  return { id: row.id, title: row.judul, date: row.tanggal_mulai, endDate: row.tanggal_selesai || row.tanggal_mulai, start: row.waktu_mulai?.slice(0, 5) || '', end: row.waktu_selesai?.slice(0, 5) || '', location: row.lokasi, organizer: row.penyelenggara, category: row.kategori, summary: row.ringkasan, description: row.deskripsi, image: row.gambar_url, link: row.link_informasi, status: row.status };
}
export const eventsOnDate = (events, key) => events.filter(event => event.date <= key && (event.endDate || event.date) >= key);
export const eventTimeLabel = event => event.start && event.end ? `${event.start} – ${event.end} WIB` : event.start || event.end ? `${event.start || event.end} WIB` : 'Waktu belum ditentukan';
export function upcomingEvents(events, now = new Date()) {
  const today = getSchoolDateKey(now);
  const time = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hourCycle: 'h23', hour: '2-digit', minute: '2-digit' }).format(now);
  return events.filter(event => (event.endDate || event.date) > today || ((event.endDate || event.date) === today && (!event.end || event.end >= time)))
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start));
}
export function selectSchoolAgenda(events, now = new Date()) {
  const published = [...new Map(events.filter(event => event.status === 'published').map(event => [event.id, event])).values()];
  const upcoming = upcomingEvents(published, now);
  const upcomingIds = new Set(upcoming.map(event => event.id));
  const past = published.filter(event => !upcomingIds.has(event.id)).sort((a, b) =>
    (b.endDate || b.date).localeCompare(a.endDate || a.date) || b.date.localeCompare(a.date) || (b.end || '').localeCompare(a.end || ''));
  return [...upcoming, ...past].slice(0, 3);
}
