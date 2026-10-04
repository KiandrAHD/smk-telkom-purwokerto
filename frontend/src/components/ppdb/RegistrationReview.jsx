import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { ppdbFieldLabels } from '../../utils/ppdbSubmission';
import { ppdbMataPelajaran, ppdbSemester } from '../../data/ppdbFormOptions';

export default function RegistrationReview({ biodata, nilai, berkas }) {
  const { t } = useLanguage();
  return <section aria-labelledby="review-heading" className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h2 id="review-heading" className="font-heading text-lg font-extrabold text-dark-900">{t('Periksa Pendaftaran')}</h2>
      <Link to="/spmb/formulir" className="text-sm font-bold text-primary hover:underline">{t('Ubah biodata atau nilai')}</Link>
    </div>
    <p className="text-sm text-dark-500">{t('Periksa kembali data dan PDF sebelum dikirim. Perubahan setelah dikirim dilakukan melalui panitia.')}</p>
    <dl className="grid gap-4 rounded-xl bg-dark-50 p-4 sm:grid-cols-2">
      {Object.entries(ppdbFieldLabels).map(([key, label]) => <div key={key} className="min-w-0"><dt className="text-xs text-dark-500">{t(label)}</dt><dd className="mt-1 break-words text-sm font-semibold text-dark-900">{['jurusan', 'agama', 'jenisKelamin'].includes(key) ? t(biodata[key]) : biodata[key]}</dd></div>)}
    </dl>
    <div className="overflow-x-auto rounded-xl border border-dark-100">
      <table className="w-full min-w-[32rem] text-left text-xs"><caption className="p-3 text-left font-bold">{t('Nilai Rapor (Semester 1 - 5)')}</caption>
        <thead className="bg-dark-50"><tr><th scope="col" className="p-3">{t('Mata Pelajaran')}</th>{ppdbSemester.map((s) => <th scope="col" key={s} className="p-3">{t(s)}</th>)}</tr></thead>
        <tbody>{ppdbMataPelajaran.map(({ nama }) => <tr key={nama} className="border-t border-dark-100"><th scope="row" className="p-3">{t(nama)}</th>{ppdbSemester.map((s) => <td key={s} className="p-3">{nilai[`${nama}|${s}`]}</td>)}</tr>)}</tbody>
      </table>
    </div>
    <p className="break-words rounded-xl border border-dark-100 p-4 text-sm"><span className="font-bold">PDF: </span>{berkas.name} · {(berkas.size / 1048576).toFixed(2)} MB</p>
  </section>;
}
