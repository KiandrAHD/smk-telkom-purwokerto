import { useMemo, useRef, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Pencil, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../../../components/dashboard/Modal';
import EventDetails from '../../../components/kalender/EventDetails';
import EventCategoryLegend from '../../../components/kalender/EventCategoryLegend';
import EventCategoryLabel, { EventCategoryDot } from '../../../components/kalender/EventCategoryLabel';
import EventForm from './EventForm';
import useEvents from '../../../hooks/useEvents';
import { createEvent, deleteEvent, eventError, updateEvent } from '../../../services/eventService';
import { dateFromKey, monthCells } from '../../../utils/calendar';
import { getEventCategory, eventColor, eventsOnDate, eventTimeLabel, toCalendarEvent, upcomingEvents } from '../../../utils/events';
import { getSchoolDateKey } from '../../../utils/publicContent';

export default function KalenderAdminPage() {
  const [params] = useSearchParams();
  const today = getSchoolDateKey(new Date());
  const [month, setMonth] = useState(today.slice(0, 7));
  const [query, setQuery] = useState(params.get('cari') || ''), [status, setStatus] = useState('all');
  const [modal, setModal] = useState(null), [submitting, setSubmitting] = useState(false), [feedback, setFeedback] = useState(null);
  const lock = useRef(false);
  const { items, loading, error, refresh } = useEvents();
  const [year, number] = month.split('-').map(Number);
  const cells = monthCells(year, number - 1);
  const rows = useMemo(() => items.filter(item => (status === 'all' || item.status === status) && [item.judul, item.kategori, getEventCategory(item.kategori).label, item.lokasi, item.ringkasan, item.deskripsi, item.penyelenggara].join(' ').toLocaleLowerCase('id-ID').includes(query.trim().toLocaleLowerCase('id-ID'))), [items, query, status]);
  const categoriesToReview = items.filter(item => getEventCategory(item.kategori).legacy).length;
  const events = useMemo(() => rows.map(toCalendarEvent), [rows]);
  const agenda = upcomingEvents(events);
  const date = (key, options = { day: 'numeric', month: 'long', year: 'numeric' }) => new Intl.DateTimeFormat('id-ID', { ...options, timeZone: 'UTC' }).format(dateFromKey(key));
  const close = () => { if (!lock.current) setModal(null); };
  const navigate = offset => {
    const target = new Date(Date.UTC(year, number - 1 + offset, 1));
    if (target.getUTCFullYear() >= 100 && target.getUTCFullYear() <= 9999) setMonth(`${String(target.getUTCFullYear()).padStart(4, '0')}-${String(target.getUTCMonth() + 1).padStart(2, '0')}`);
  };
  const save = async (data, id) => {
    if (lock.current) return 'Penyimpanan sedang berjalan.';
    lock.current = true; setSubmitting(true); setFeedback(null);
    try {
      const saved = modal.type === 'edit' ? await updateEvent(modal.item.id, data) : await createEvent(data, id);
      setModal(null); setMonth(saved.tanggal_mulai.slice(0, 7)); setFeedback({ ok: true, message: 'Kegiatan berhasil disimpan.' });
      await refresh(true);
    } catch (cause) { const message = eventError(cause); setFeedback({ ok: false, message }); return message; }
    finally { lock.current = false; setSubmitting(false); }
  };
  const remove = async () => {
    if (lock.current) return;
    lock.current = true; setSubmitting(true); setFeedback(null);
    try { await deleteEvent(modal.item.id); setModal(null); setFeedback({ ok: true, message: 'Kegiatan berhasil dihapus.' }); await refresh(true); }
    catch (cause) { setFeedback({ ok: false, message: eventError(cause) }); }
    finally { lock.current = false; setSubmitting(false); }
  };
  const manage = (type, event) => setModal({ type, item: items.find(item => item.id === event.id) });
  const actions = event => <div className="flex shrink-0">
    <button type="button" aria-label={`Edit ${event.title}`} onClick={() => manage('edit', event)} className="grid size-8 place-items-center rounded-lg text-dark-500 hover:bg-dark-100"><Pencil className="size-3.5" /></button>
    <button type="button" aria-label={`Hapus ${event.title}`} onClick={() => manage('delete', event)} className="grid size-8 place-items-center rounded-lg text-dark-500 hover:bg-primary-50 hover:text-primary"><Trash2 className="size-3.5" /></button>
  </div>;
  return <section aria-labelledby="admin-calendar-title">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Panel Admin</p><h1 id="admin-calendar-title" className="mt-2 font-heading text-2xl font-extrabold text-dark-900 sm:text-3xl">Calendar of Events</h1><p className="mt-2 text-sm text-dark-500">Kelola agenda dan kegiatan sekolah</p></div>
      <button type="button" onClick={() => setModal({ type: 'create' })} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-xs font-bold text-white hover:bg-primary-800"><Plus className="size-4" />Tambah Event</button>
    </div>
    {feedback && <div role={feedback.ok ? 'status' : 'alert'} className={`mt-4 flex items-start gap-3 rounded-lg border p-3 text-sm ${feedback.ok ? 'border-green-200 bg-green-50 text-green-700' : 'border-primary-200 bg-primary-50 text-primary-800'}`}><span className="flex-1">{feedback.message}</span><button aria-label="Tutup notifikasi" onClick={() => setFeedback(null)}><X className="size-4" /></button></div>}
    <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-dark-200 bg-white p-4">
      <label className="relative min-w-0 flex-[1_1_16rem]"><span className="sr-only">Cari kegiatan</span><Search className="absolute left-3 top-3 size-4 text-dark-400" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Cari judul, kategori, lokasi, atau deskripsi..." className="w-full rounded-lg border border-dark-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary" /></label>
      <select value={status} onChange={event => setStatus(event.target.value)} aria-label="Filter status kegiatan" className="rounded-lg border border-dark-200 px-3 py-2.5 text-xs"><option value="all">Semua Status</option><option value="draft">Draft</option><option value="published">Published</option></select>
      <div className="flex items-center gap-2"><CalendarDays className="size-4 text-dark-500" /><input type="month" min="0100-01" max="9999-12" value={month} onChange={event => { if (/^\d{4}-(0[1-9]|1[0-2])$/.test(event.target.value) && event.target.value >= '0100-01') setMonth(event.target.value); }} aria-label="Bulan kalender admin" className="min-w-0 rounded-lg border border-dark-200 p-2 text-xs" /></div>
      <button aria-label="Bulan sebelumnya" onClick={() => navigate(-1)} className="grid size-10 place-items-center rounded-lg border border-dark-200 hover:bg-dark-50"><ChevronLeft className="size-4" /></button><button aria-label="Bulan berikutnya" onClick={() => navigate(1)} className="grid size-10 place-items-center rounded-lg border border-dark-200 hover:bg-dark-50"><ChevronRight className="size-4" /></button>
      <button aria-label="Muat ulang kegiatan" disabled={loading} onClick={() => refresh()} className="grid size-10 place-items-center rounded-lg border border-dark-200 disabled:opacity-50"><RefreshCw className="size-4" /></button>
    </div>
    {loading && <p role="status" className="mt-4 text-sm text-dark-500">Memuat kegiatan...</p>}
    {error && <p role="alert" className="mt-4 rounded-lg bg-primary-50 p-4 text-sm text-primary-800">{error}</p>}
    {categoriesToReview > 0 && <p role="status" className="mt-4 rounded-lg bg-dark-50 p-3 text-xs leading-relaxed text-dark-600">{categoriesToReview} kegiatan memakai kategori lama atau belum dikenali. Data tetap tersimpan; tinjau kategori melalui Edit Event.</p>}
    {!loading && !error && query && !events.length && <p role="status" className="mt-4 text-sm text-dark-500">Tidak ada kegiatan yang cocok dengan pencarian.</p>}
    <div className="mt-6 grid items-start gap-5 xl:grid-cols-[minmax(0,3fr)_minmax(15rem,1fr)]">
      <div className="min-w-0 overflow-hidden rounded-lg border border-dark-200 bg-white"><table className="w-full table-fixed border-collapse" aria-label={date(`${month}-01`, { month: 'long', year: 'numeric' })}>
        <thead><tr>{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(day => <th scope="col" key={day} className="h-10 bg-dark-50 text-[10px] font-semibold text-dark-600 sm:text-xs">{day}</th>)}</tr></thead>
        <tbody>{Array.from({ length: cells.length / 7 }, (_, row) => <tr key={row}>{cells.slice(row * 7, row * 7 + 7).map(cell => {
          const dayEvents = eventsOnDate(events, cell.key);
          return <td key={cell.key} data-admin-date={cell.key} className="h-24 border border-dark-100 p-1 align-top sm:h-28 sm:p-2">
            <button type="button" aria-label={`Agenda ${date(cell.key)}`} onClick={() => setModal({ type: 'day', date: cell.key })} aria-current={cell.key === today ? 'date' : undefined} className={`grid size-6 place-items-center rounded-full text-xs font-semibold hover:bg-primary-50 ${cell.key === today ? 'bg-primary text-white' : cell.inMonth ? 'text-dark-800' : 'text-dark-400'}`}>{cell.day}</button>
            <div className="mt-1 space-y-1">{dayEvents.slice(0, 2).map(event => <button type="button" key={event.id} aria-label={`Detail ${event.title}`} aria-description={getEventCategory(event.category).label} title={`${event.title} · ${getEventCategory(event.category).label}`} onClick={() => manage('detail', event)} className={`flex w-full items-center gap-1 rounded px-1 py-1 text-left text-[9px] font-semibold ${eventColor(event)}`}><EventCategoryDot category={event.category} /><span className="min-w-0 truncate">{event.title}</span></button>)}{dayEvents.length > 2 && <button type="button" onClick={() => setModal({ type: 'day', date: cell.key })} className="w-full text-left text-[9px] font-semibold text-primary">+{dayEvents.length - 2} lainnya</button>}</div>
          </td>;
        })}</tr>)}</tbody>
      </table><div className="px-4 pb-4"><EventCategoryLegend showTitle /></div></div>
      <aside aria-label="Agenda Mendatang" className="min-w-0 rounded-xl border border-dark-200 bg-white">
        <h2 className="px-4 pt-4 text-sm font-bold text-dark-900">Agenda Mendatang</h2>
        {agenda.length ? <ul className="mt-2 max-h-[38rem] divide-y divide-dark-200 overflow-y-auto">{agenda.map(event => <li key={event.id} className="p-4"><div className="flex items-start gap-1"><button onClick={() => manage('detail', event)} className="min-w-0 flex-1 break-words text-left text-xs font-bold text-dark-900">{event.title}</button>{actions(event)}</div><div className="mt-2"><EventCategoryLabel category={event.category} badge /></div><span className="mt-1 block text-[10px] font-semibold text-dark-500">{event.status === 'draft' ? 'Draft' : 'Published'}</span><p className="mt-2 flex items-start gap-1 text-[10px] text-dark-500"><Clock className="size-3 shrink-0" />{date(event.date, { day: 'numeric', month: 'short', year: 'numeric' })} · {eventTimeLabel(event)}</p><p className="mt-1 flex items-start gap-1 break-words text-[10px] text-dark-500"><MapPin className="size-3 shrink-0" />{event.location || 'Lokasi belum ditentukan'}</p></li>)}</ul> : <p className="p-4 text-xs leading-relaxed text-dark-500">{loading ? 'Memuat agenda...' : 'Belum ada agenda mendatang.'}</p>}
      </aside>
    </div>
    <Modal terbuka={Boolean(modal)} onTutup={close} busy={submitting} judul={modal?.type === 'create' ? 'Tambah Event' : modal?.type === 'edit' ? 'Edit Event' : modal?.type === 'delete' ? 'Hapus Event' : modal?.type === 'day' ? `Agenda ${date(modal.date)}` : modal?.item?.judul || 'Detail Event'} lebar={['create', 'edit'].includes(modal?.type) ? 'max-w-2xl' : 'max-w-lg'}>
      <div className="max-h-[70dvh] overflow-y-auto pr-1" data-lenis-prevent>
        {['create', 'edit'].includes(modal?.type) && <EventForm key={modal.item?.id || modal.date || 'new'} initialData={modal.item} initialDate={modal.date} onSave={save} onCancel={close} submitting={submitting} />}
        {modal?.type === 'detail' && <><EventDetails event={toCalendarEvent(modal.item)} showStatus /><div className="mt-4 flex justify-end gap-2">{actions(toCalendarEvent(modal.item))}</div></>}
        {modal?.type === 'day' && <><ul className="divide-y divide-dark-100">{eventsOnDate(events, modal.date).map(event => <li key={event.id} className="flex items-center gap-2 py-3"><div className="min-w-0 flex-1"><button onClick={() => manage('detail', event)} className="break-words text-left text-sm font-semibold text-dark-900">{event.title}</button><div className="mt-1"><EventCategoryLabel category={event.category} badge /></div></div>{actions(event)}</li>)}</ul>{!eventsOnDate(events, modal.date).length && <p className="text-sm text-dark-500">Belum ada kegiatan pada tanggal ini.</p>}<button onClick={() => setModal({ type: 'create', date: modal.date })} className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white">Tambah Event pada Tanggal Ini</button></>}
        {modal?.type === 'delete' && <><p className="text-sm text-dark-600">Hapus kegiatan “{modal.item.judul}”? Kegiatan ini juga akan dihapus dari kalender publik.</p><div className="mt-5 flex justify-end gap-2"><button disabled={submitting} onClick={close} className="rounded-lg border border-dark-200 px-4 py-2 text-xs font-semibold">Batal</button><button disabled={submitting} onClick={remove} className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{submitting ? 'Menghapus...' : 'Ya, Hapus'}</button></div></>}
      </div>
    </Modal>
  </section>;
}
