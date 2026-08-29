import { Eye, Pencil } from 'lucide-react';

const statusLabels = { menunggu: 'Menunggu', diproses: 'Diproses', diterima: 'Diterima', ditolak: 'Ditolak' };
const statusClasses = { menunggu: 'bg-amber-100 text-amber-700', diproses: 'bg-blue-100 text-blue-700', diterima: 'bg-green-100 text-green-700', ditolak: 'bg-red-100 text-red-700' };
const formatDate = (value) => value ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(value)) : '-';

const StatusBadge = ({ status }) => <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${statusClasses[status] || 'bg-dark-100 text-dark-600'}`}>{statusLabels[status] || status}</span>;

const PPDBTable = ({ items, onDetail, onEdit }) => (
  <div className="overflow-hidden rounded-2xl border border-dark-100 bg-white shadow-card"><div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left"><thead className="border-b border-dark-100 bg-dark-50"><tr className="text-[11px] font-bold uppercase tracking-wide text-dark-500"><th className="px-4 py-3 sm:px-5">Pendaftar</th><th className="px-4 py-3 sm:px-5">Asal Sekolah</th><th className="px-4 py-3 sm:px-5">Jurusan</th><th className="px-4 py-3 sm:px-5">Status</th><th className="px-4 py-3 sm:px-5">Tanggal Daftar</th><th className="px-4 py-3 text-right sm:px-5">Aksi</th></tr></thead><tbody className="divide-y divide-dark-100">{items.map((item) => <tr key={item.id} className="text-sm text-dark-700 hover:bg-dark-50/60"><td className="max-w-xs px-4 py-4 sm:px-5"><button type="button" onClick={() => onDetail(item)} className="text-left font-semibold text-dark-900 hover:text-primary">{item.nama_lengkap}</button><p className="mt-1 text-xs text-dark-500">{item.email || item.no_hp || 'Kontak belum diisi'}</p></td><td className="max-w-xs truncate px-4 py-4 text-xs sm:px-5">{item.asal_sekolah}</td><td className="max-w-xs truncate px-4 py-4 text-xs sm:px-5">{item.pilihan_jurusan}</td><td className="px-4 py-4 sm:px-5"><StatusBadge status={item.status} /></td><td className="whitespace-nowrap px-4 py-4 text-xs text-dark-500 sm:px-5">{formatDate(item.created_at)}</td><td className="px-4 py-4 sm:px-5"><div className="flex justify-end gap-1"><button type="button" onClick={() => onDetail(item)} className="rounded-lg p-2 text-dark-400 hover:bg-dark-50 hover:text-dark-700" aria-label={`Detail ${item.nama_lengkap}`} title="Detail"><Eye className="h-4 w-4" /></button><button type="button" onClick={() => onEdit(item)} className="rounded-lg p-2 text-dark-400 hover:bg-primary-50 hover:text-primary" aria-label={`Ubah status ${item.nama_lengkap}`} title="Ubah status"><Pencil className="h-4 w-4" /></button></div></td></tr>)}</tbody></table></div></div>
);

export default PPDBTable;

