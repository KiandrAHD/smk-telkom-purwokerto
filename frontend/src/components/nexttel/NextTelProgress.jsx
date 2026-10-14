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
    <progress value={current} max={total} aria-label={label} className="block h-2.5 w-full overflow-hidden rounded-full border-0 bg-dark-100 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-dark-100 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-primary [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-300 [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-primary motion-reduce:[&::-webkit-progress-value]:transition-none" />
  </div>
  );
};

export default NextTelProgress;
