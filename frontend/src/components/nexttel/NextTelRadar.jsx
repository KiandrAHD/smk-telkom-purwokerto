import { useLanguage } from '../../context/LanguageContext';

const AXES = [
  { code: 'RPL', dx: 0, dy: -1, x: 310, y: 20 },
  { code: 'TKJ', dx: 1, dy: 0, x: 550, y: 230 },
  { code: 'TJAT', dx: 0, dy: 1, x: 310, y: 430 },
  { code: 'PG', dx: -1, dy: 0, x: 70, y: 230 },
];

export default function NextTelRadar({ ranking, labels }) {
  const { t } = useLanguage();
  const scores = Object.fromEntries(ranking);
  // A-D uses the Figma scale; free-text scores can exceed 30 and must remain inside the chart.
  const maxScale = Math.max(30, Math.ceil(Math.max(...Object.values(scores)) / 30) * 30);
  const point = (axis, score) => [310 + axis.dx * score / maxScale * 170, 240 + axis.dy * score / maxScale * 170];
  return (
    <svg viewBox="0 0 620 480" className="mx-auto w-full max-w-2xl text-dark-600" role="img" aria-label={ranking.map(([code, score]) => `${t(labels[code])}: ${score}`).join(', ')}>
      <title>{t('Statistik Minat Jurusan')}</title>
      {[5, 10, 15, 20, 25, 30].map((scale) => (
        <polygon key={scale} points={AXES.map((axis) => point(axis, scale * maxScale / 30).join(',')).join(' ')} fill="none" className="stroke-dark-300" strokeWidth="1.5" />
      ))}
      <path d="M310 70V410M140 240H480" fill="none" className="stroke-dark-400" strokeWidth="1" />
      <polygon points={AXES.map((axis) => point(axis, scores[axis.code] || 0).join(',')).join(' ')} className="fill-primary/25 stroke-primary" strokeWidth="2" strokeLinejoin="round" />
      {[0, 5, 10, 15, 20, 25].map((scale) => (
        <text key={scale} x="315" y={240 - scale / 30 * 170 - 4} fontSize="10" className="fill-dark-500">{scale * maxScale / 30}</text>
      ))}
      {AXES.map((axis) => {
        const [cx, cy] = point(axis, scores[axis.code] || 0);
        return (
          <g key={axis.code}>
            <circle cx={cx} cy={cy} r="3" className="fill-primary" />
            <foreignObject x={axis.x - 67} y={axis.y - 28} width="134" height="48">
              <div className="flex h-full items-end justify-center text-center text-[11px] leading-tight text-dark-600">{t(labels[axis.code])}</div>
            </foreignObject>
            <rect x={axis.x - 17} y={axis.y + 25} width="34" height="21" rx="10.5" className="fill-primary" />
            <text x={axis.x} y={axis.y + 40} textAnchor="middle" fontSize="12" className="fill-white">{scores[axis.code] || 0}</text>
          </g>
        );
      })}
    </svg>
  );
}
