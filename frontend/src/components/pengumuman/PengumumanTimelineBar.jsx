import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { officialContentAudit, pengumumanTimeline } from '../../data/dummyData';

// Lihat catatan tampilkanLihatSemua di PengumumanPopulerCard.
const PengumumanTimelineBar = ({ tampilkanLihatSemua = true }) => {
  const { t } = useLanguage();
  return (
  <div className="rounded-lg border border-dark-200 px-5 py-6 lg:px-8">
    <p className="mb-4 text-[10px] leading-relaxed text-dark-500">
      {t('Publikasi dalam arsip situs resmi, diperiksa {date}.', { date: t(officialContentAudit.checkedAt) })}{' '}
      <a href={officialContentAudit.pengumumanSourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">{t("Sumber")}</a>
    </p>
    <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
    {pengumumanTimeline.items.map((item) => (
      <div key={item.label}>
        <p className="font-heading text-sm font-bold text-dark-900">{t(item.label)}</p>
        <p className="mt-1 font-heading text-[9px] font-bold text-dark-900">{t(item.count)}</p>
      </div>
    ))}

    {tampilkanLihatSemua && (
      <Link
        to="/pengumuman/timeline"
        className="col-span-2 inline-flex items-center gap-2 font-heading text-sm font-bold text-primary hover:underline sm:col-span-4 lg:col-span-1 lg:justify-self-end"
      >
        {t(pengumumanTimeline.linkText)}
        <ArrowRight className="h-4 w-4" />
      </Link>
    )}
    </div>
  </div>
  );
};

export default PengumumanTimelineBar;
