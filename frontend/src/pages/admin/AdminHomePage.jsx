import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminHomePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <section>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Panel Admin</p>
        <h1 className="mt-2 font-heading text-2xl font-extrabold text-dark-900 sm:text-3xl">Dashboard Admin</h1>
      </div>

      <div className="max-w-xl rounded-2xl border border-dark-100 bg-white p-6 shadow-card">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-xs font-semibold text-dark-400">Email admin</dt>
            <dd className="mt-1 break-all font-medium text-dark-900">{user?.email ?? '-'}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold text-dark-400">Status</dt>
            <dd className="mt-1 font-semibold text-green-600">Admin aktif</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary-800"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </section>
  );
};

export default AdminHomePage;

