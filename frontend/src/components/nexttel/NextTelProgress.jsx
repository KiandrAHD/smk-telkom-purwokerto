const NextTelProgress = ({ current, total }) => (
  <div className="mb-6" aria-label={`Pertanyaan ${current} dari ${total}`}>
    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-dark-500">
      <span>Pertanyaan {current} dari {total}</span>
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

export default NextTelProgress;
