import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pengumumanTimeline } from '../../data/dummyData';

// Lihat catatan tampilkanLihatSemua di PengumumanPopulerCard.
const PengumumanTimelineBar = ({ tampilkanLihatSemua = true }) => (
  <div className="grid grid-cols-2 gap-y-5 rounded-lg border border-dark-300 px-5 py-6 sm:grid-cols-4 lg:grid-cols-[repeat(4,auto)_1fr] lg:gap-x-[4.5rem] lg:px-8">
    {pengumumanTimeline.items.map((item) => (
      <div key={item.label}>
        <p className="font-heading text-sm font-bold text-dark-900">{item.label}</p>
        <p className="mt-1 font-heading text-[9px] font-bold text-dark-900">{item.count}</p>
      </div>
    ))}

    {tampilkanLihatSemua && (
      <Link
        to="/pengumuman/timeline"
        className="col-span-2 inline-flex items-center gap-2 font-heading text-sm font-bold text-primary hover:underline sm:col-span-4 lg:col-span-1 lg:justify-self-end"
      >
        {pengumumanTimeline.linkText}
        <ArrowRight className="h-4 w-4" />
      </Link>
    )}
  </div>
);

export default PengumumanTimelineBar;
