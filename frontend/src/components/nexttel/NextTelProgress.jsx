import { useLanguage } from '../../context/LanguageContext';

const NextTelProgress = ({ current, total }) => {
  const { t } = useLanguage();
  const label = t('Pertanyaan {current} dari {total}', { current, total });
  return (
  <div className="mb-6" aria-label={label}>
    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-dark-500">
      <span>{label}</span>
      <span>{Math.round((current / total) * 100)}%</span>
    </div>
    <div className="h-2 overflow-hidden rounded-full bg-dark-100">
      <div
        className="h-full rounded-full bg-primary transition-all duration-300"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  </div>
  );
};

export default NextTelProgress;
