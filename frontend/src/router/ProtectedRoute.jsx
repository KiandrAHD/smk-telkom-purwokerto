import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorPage from '../pages/ErrorPage';
import MainLayout from '../layouts/MainLayout';
import PublicDataState from '../components/PublicDataState';

const ProtectedRoute = ({ children }) => {
  const { loading, user, isAdmin, accessError } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-50 px-4 text-sm text-dark-600">
        Memeriksa session admin...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (accessError) return <MainLayout><div className="mx-auto max-w-7xl px-4 py-8"><PublicDataState error={accessError} onRetry={() => window.location.reload()} /></div></MainLayout>;
  if (!isAdmin) return <ErrorPage kind="forbidden" />;

  return children ?? <Outlet />;
};

export default ProtectedRoute;
