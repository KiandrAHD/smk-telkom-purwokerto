import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pengumumanTimeline } from '../../data/dummyData';

const PengumumanTimelineBar = () => (
  <div className="grid grid-cols-2 gap-y-5 rounded-lg border border-dark-300 px-6 py-9 sm:grid-cols-4 lg:grid-cols-[repeat(4,auto)_1fr] lg:gap-x-[6.5rem] lg:px-11">
    {pengumumanTimeline.items.map((item) => (
      <div key={item.label}>
        <p className="font-heading text-xl font-bold text-dark-900">{item.label}</p>
        <p className="mt-1 font-heading text-[11px] font-bold text-dark-900">{item.count}</p>
      </div>
    ))}

    <Link
      to="/pengumuman/timeline"
      className="col-span-2 inline-flex items-center gap-3 font-heading text-xl font-bold text-primary hover:underline sm:col-span-4 lg:col-span-1 lg:justify-self-end"
    >
      {pengumumanTimeline.linkText}
      <ArrowRight className="h-5 w-5" />
    </Link>
  </div>
);

export default PengumumanTimelineBar;
