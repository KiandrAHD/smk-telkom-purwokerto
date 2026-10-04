import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { recordVisit, getVisitorStats } from '../services/visitorService';

function formatNumber(num) {
  if (typeof num !== 'number') return '\u2014';
  return num.toLocaleString('id-ID');
}

const VisitorCounter = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let cancelled = false;
    recordVisit();
    getVisitorStats().then((data) => {
      if (!cancelled && data) setStats(data);
    });
    return () => { cancelled = true; };
  }, []);

  const rows = [
    { label: t('Pengunjung Hari ini'), value: stats?.daily },
    { label: t('Pengunjung Bulan ini'), value: stats?.monthly },
    { label: t('Pengunjung Tahun ini'), value: stats?.yearly },
  ];

  return (
    <div className="min-w-0">
      <h3 className="flex items-center gap-2 font-heading text-xs font-bold text-dark-900">
        <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        {t('Pengunjung Website')}
      </h3>
      <dl className="mt-2 space-y-1 text-[11px] text-dark-500">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-baseline justify-between gap-2">
            <dt>{label}</dt>
            <dd className="font-semibold tabular-nums text-dark-700">{formatNumber(value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default VisitorCounter;
