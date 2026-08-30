import { NavLink } from 'react-router-dom';
import {
  BriefcaseBusiness,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Megaphone,
  Newspaper,
  Settings,
  Trophy,
} from 'lucide-react';
import Logo from '../Logo';
import { adminMenu, adminSekolah } from '../../data/dummyData';

// Nama ikon disimpan sebagai teks di dummyData lalu dipetakan di sini, mengikuti
// pola yang sudah dipakai HeroStatsBar dan PengumumanStatsSection.
const ikon = {
  dashboard: LayoutDashboard,
  ppdb: GraduationCap,
  jurusan: Layers,
  prestasi: Trophy,
  bkk: BriefcaseBusiness,
  berita: Newspaper,
  pengumuman: Megaphone,
  pengaturan: Settings,
};

const DashboardSidebar = ({ onPilihMenu }) => (
  <div className="flex h-full flex-col bg-white">
    <div className="flex items-center gap-3 px-6 py-6">
      <Logo className="h-11 w-11" />
      <div>
        <p className="font-heading text-base font-extrabold leading-tight text-dark-900">SMK Telkom</p>
        <p className="text-xs text-dark-500">Purwokerto</p>
      </div>
    </div>

    <p className="px-6 pb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-dark-400">
      Menu Utama
    </p>

    <nav className="flex-1 space-y-1.5 overflow-y-auto px-4" aria-label="Menu admin">
      {adminMenu.map(({ label, to, icon, end }) => {
        const Ikon = ikon[icon];
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onPilihMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-full py-2.5 pl-2.5 pr-4 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-primary text-white shadow-card'
                  : 'text-dark-700 hover:bg-primary-50 hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-colors ${
                    isActive ? 'bg-white text-primary' : 'bg-dark-500 text-white'
                  }`}
                >
                  {Ikon && <Ikon className="h-4 w-4" />}
                </span>
                {label}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>

    <div className="p-4">
      <div className="rounded-2xl border border-dark-100 bg-white px-5 py-4 shadow-card">
        <p className="font-heading text-xs font-bold text-dark-900">{adminSekolah.nama}</p>
        {adminSekolah.alamat.map((baris) => (
          <p key={baris} className="mt-1 text-[11px] leading-snug text-dark-500">
            {baris}
          </p>
        ))}
        <a
          href={adminSekolah.website}
          target="_blank"
          rel="noreferrer"
          className="mt-2.5 block text-[11px] font-medium text-primary hover:underline"
        >
          {adminSekolah.website}
        </a>
      </div>
    </div>
  </div>
);

export default DashboardSidebar;
