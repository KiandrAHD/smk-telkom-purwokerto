import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, FileText, GraduationCap, LayoutDashboard, LogOut, Megaphone, Trophy } from 'lucide-react';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Berita', to: '/dashboard/berita', icon: FileText },
  { label: 'Pengumuman', to: '/dashboard/pengumuman', icon: Megaphone },
  { label: 'Prestasi', to: '/dashboard/prestasi', icon: Trophy },
  { label: 'BKK', to: '/dashboard/bkk', icon: BriefcaseBusiness },
  { label: 'PPDB', to: '/dashboard/ppdb', icon: GraduationCap },
];

const DashboardPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-dark-50 lg:flex">
      <aside className="w-full border-b border-dark-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3 border-b border-dark-100 px-5 py-4">
          <Logo className="h-10 w-10" />
          <div>
            <p className="font-heading text-sm font-extrabold text-dark-900">Admin Panel</p>
            <p className="text-[10px] text-dark-500">SMK Telkom Purwokerto</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-3 lg:block lg:space-y-1" aria-label="Menu dashboard">
          {menuItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors ${
                  isActive ? 'bg-primary text-white' : 'text-dark-600 hover:bg-primary-50 hover:text-primary'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="m-3 hidden w-[calc(100%-1.5rem)] items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold text-dark-600 transition-colors hover:bg-primary-50 hover:text-primary lg:flex"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardPage;

