import {
  AlarmClock,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarDays,
  Flag,
  FolderKanban,
  Globe,
  GraduationCap,
  Medal,
  Trophy,
  UserCheck,
  Users,
  Volume2,
} from 'lucide-react';

// Peta nama ikon -> komponennya: data cukup menyimpan nama ikon sebagai teks
// biasa, jadi dummyData.js tetap bebas dari impor komponen.
const ikon = {
  jurusan: GraduationCap,
  mitra: Building2,
  kerja: Briefcase,
  projek: FolderKanban,
  trofi: Trophy,
  nasional: Flag,
  internasional: Globe,
  medali: Medal,
  lowongan: Briefcase,
  alumni: UserCheck,
  komunitas: Users,
  megaphone: Volume2,
  kalender: CalendarDays,
  alarm: AlarmClock,
  agenda: CalendarCheck,
};

// Bilah statistik yang menimpa bagian bawah hero. Markup-nya dulu disalin sama
// persis di hero Jurusan, Prestasi, dan BKK; disatukan di sini supaya perubahan
// berikutnya cukup dikerjakan di satu tempat. Hero Pengumuman ikut memakainya
// sejak statistiknya dipindah masuk ke panel hero.
const HeroStatsBar = ({ items }) => (
  <div className="relative z-10 mx-1 -mt-6 rounded-2xl border border-dark-100 bg-white shadow-card lg:mx-16 lg:mt-5 xl:-mt-7">
    <div className="grid grid-cols-1 divide-y divide-dark-100 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
      {items.map((stat) => {
        const Ikon = ikon[stat.icon];
        return (
          <div key={stat.label} className="flex items-center gap-3 px-6 py-5">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
              {Ikon && <Ikon className="h-5 w-5 text-white" />}
            </span>
            <div>
              <p className="font-heading text-xl font-extrabold text-dark-900">{stat.value}</p>
              <p className="text-[11px] text-dark-500">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default HeroStatsBar;
