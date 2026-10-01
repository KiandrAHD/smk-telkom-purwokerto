import { useLanguage } from '../../context/LanguageContext';
import { useEffect, useRef, useState } from 'react';
import { Briefcase, Building2, GraduationCap, Trophy, Users } from 'lucide-react';
import { aboutStats } from '../../data/dummyData';

const icons = { users: Users, graduationCap: GraduationCap, building: Building2, briefcase: Briefcase, trophy: Trophy };

// Pecah "2.200+" jadi angka + imbuhan supaya angkanya bisa dihitung naik.
// Pemisah ribuan ikut dibuang dari angka dan dari imbuhan, lalu dipasang ulang
// lewat toLocaleString — kalau tidak, "2.200+" menyisakan imbuhan "00+".
const parse = (value) => ({
  target: Number(value.replace(/[^\d]/g, '')),
  suffix: value.replace(/[\d.,]/g, ''),
});

const CountUp = ({ value, run }) => {
  const { locale } = useLanguage();
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
      {(n ?? target).toLocaleString(locale)}
      {suffix}
    </span>
  );
};

const TentangStatsSection = () => {
  const { t } = useLanguage();
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
    <section className="relative z-10 -mt-10 bg-transparent pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="mx-4 rounded-2xl border border-dark-100 bg-white shadow-card sm:mx-6"
        >
          <div className="grid grid-cols-2 gap-y-1 px-2 py-2 sm:px-3 lg:grid-cols-4 lg:divide-x lg:divide-dark-100 lg:py-3">
            {aboutStats.map((stat) => {
              const Icon = icons[stat.icon];
              return (
                <div key={stat.label} className="flex min-w-0 items-center gap-2 px-2 py-3 sm:gap-3 sm:px-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary sm:h-10 sm:w-10">
                    <Icon aria-hidden="true" className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-heading text-xl font-extrabold text-dark-900">
                      <CountUp value={stat.value} run={visible} />
                    </p>
                    <p className="text-[10px] leading-relaxed text-dark-500 sm:text-[11px]">{t(stat.label)}</p>
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
