import { CalendarDays, Clock, FileText, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { dateFromKey } from '../../../utils/calendar';
import { registrationState } from '../../../utils/spmbSchedule';
import { toSpmbWave } from '../../../utils/spmbInformation';

const icons = { jadwal: CalendarDays, timeline: Clock, skema: FileText, persyaratan: FileText, syarat: Users };
const states = { upcoming: 'Mendatang', open: 'Berlangsung', closed: 'Selesai', unknown: 'Belum diumumkan' };
export default function SpmbInformationPanel({ group, items, loading, disabled, onManage }) {
  const Icon = icons[group.value];
  const dated = ['jadwal', 'timeline'].includes(group.value);
  const date = value => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'UTC' }).format(dateFromKey(value)) : 'Belum diumumkan';
  return <section data-spmb-group={group.value} aria-label={group.label} className="min-w-0 rounded-2xl border border-dark-200 bg-white p-4 shadow-soft">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-white"><Icon className="size-4" /></span><div><h2 className="text-sm font-bold text-dark-900">{group.label}</h2><p className="mt-1 text-[10px] text-dark-500">{group.description}</p></div></div>
      <button type="button" disabled={disabled} onClick={() => onManage({ type: 'create', jenis: group.value })} aria-label={`Tambah ${group.label}`} className="inline-flex min-h-9 items-center gap-1 rounded-lg bg-primary px-3 text-[10px] font-bold text-white hover:bg-primary-800 disabled:opacity-50"><Plus className="size-3" />Tambah</button>
    </div>
    <div className="mt-4 overflow-x-auto rounded-lg" tabIndex={0} role="region" aria-label={`Tabel ${group.label}`} data-lenis-prevent>
      <table className={`w-full border-collapse text-left ${dated ? 'min-w-[30rem]' : 'min-w-[20rem] xl:min-w-0 xl:table-fixed'}`}>
        <thead><tr className="bg-dark-50">{['No', 'Nama', ...(dated ? ['Jadwal'] : ['Deskripsi']), 'Status', 'Aksi'].map(label => <th scope="col" key={label} className={`break-words px-2 py-3 text-[10px] font-bold text-dark-600 ${!dated ? ({ No: 'xl:w-8', Status: 'xl:w-18', Aksi: 'xl:w-19' }[label] || '') : ''}`}>{label}</th>)}</tr></thead>
        <tbody>{items.map(item => <tr key={item.id} data-spmb-row={item.id} className="border-b border-dark-100 last:border-b-0">
          <td className="px-2 py-3 text-[10px] text-dark-500">{item.urutan}</td>
          <td className="max-w-40 break-words px-2 py-3 text-[11px] font-semibold text-dark-800">{item.judul}</td>
          <td className="max-w-52 px-2 py-3 text-[10px] leading-relaxed text-dark-500">{dated ? <>{date(item.tanggal_mulai)}{item.tanggal_selesai && <> – {date(item.tanggal_selesai)}</>}</> : <span className="line-clamp-3 break-words">{item.deskripsi || 'Belum diisi'}</span>}</td>
          <td className="px-2 py-3"><span className={`inline-flex whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-semibold ${item.status === 'draft' ? 'bg-dark-100 text-dark-600' : 'bg-green-50 text-green-700'}`}>{item.status === 'draft' ? 'Draft' : 'Published'}</span>{dated && <span className="mt-1 block text-[9px] text-dark-500">{states[registrationState(toSpmbWave(item))]}</span>}</td>
          <td className="px-2 py-3"><div className="flex gap-1"><button type="button" onClick={() => onManage({ type: 'edit', jenis: group.value, item })} aria-label={`Edit ${item.judul}`} className="grid size-7 shrink-0 place-items-center rounded border border-dark-200 text-dark-500 hover:bg-dark-50"><Pencil className="size-3" /></button><button type="button" onClick={() => onManage({ type: 'delete', jenis: group.value, item })} aria-label={`Hapus ${item.judul}`} className="grid size-7 shrink-0 place-items-center rounded border border-primary-100 text-primary hover:bg-primary-50"><Trash2 className="size-3" /></button></div></td>
        </tr>)}{!items.length && <tr><td colSpan={5} className="px-2 py-8 text-center text-xs text-dark-500">{loading ? 'Memuat informasi...' : 'Belum ada informasi.'}</td></tr>}</tbody>
      </table>
    </div>
  </section>;
}
