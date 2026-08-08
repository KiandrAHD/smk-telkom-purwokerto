import { useEffect, useRef, useState } from 'react';
import { Briefcase, Building2, GraduationCap, Users } from 'lucide-react';
import { aboutStats } from '../../data/dummyData';

const icons = { users: Users, graduationCap: GraduationCap, building: Building2, briefcase: Briefcase };

// Pecah "2.200+" jadi angka + imbuhan supaya angkanya bisa dihitung naik.
// Pemisah ribuan ikut dibuang dari angka dan dari imbuhan, lalu dipasang ulang
// lewat toLocaleString — kalau tidak, "2.200+" menyisakan imbuhan "00+".
const parse = (value) => ({
  target: Number(value.replace(/[^\d]/g, '')),
  suffix: value.replace(/[\d.,]/g, ''),
});

const CountUp = ({ value, run }) => {
  const { target, suffix } = parse(value);
  // null = animasi belum menyentuh angka ini. Nilai akhir dipakai sebagai kondisi default
  // supaya angkanya tetap benar kalau rAF tidak pernah jalan (tab latar, pane tanpa render).
  const [n, setN] = useState(null);

  useEffect(() => {
    if (!run) return undefined;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const p = Math.min((now - start) / 900, 1);
      setN(Math.round(target * (1 - (1 - p) ** 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, target]);

  return (
    <span>
      {(n ?? target).toLocaleString('id-ID')}
      {suffix}
    </span>
  );
};

const TentangStatsSection = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // Section ini di atas lipatan, jadi cek langsung dulu — kalau hanya mengandalkan
    // observer, angkanya tertinggal di 0 saat observer tidak pernah menyala.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      setVisible(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="bg-white pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="rounded-2xl border border-dark-100 bg-white shadow-card"
        >
          <div className="grid grid-cols-1 divide-y divide-dark-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {aboutStats.map((stat) => {
              const Icon = icons[stat.icon];
              return (
                <div key={stat.label} className="flex items-center gap-3 px-6 py-5">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <div>
                    <p className="font-heading text-xl font-extrabold text-dark-900">
                      <CountUp value={stat.value} run={visible} />
                    </p>
                    <p className="text-[11px] text-dark-500">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TentangStatsSection;
