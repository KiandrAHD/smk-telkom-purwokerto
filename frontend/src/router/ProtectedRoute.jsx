import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pintasan untuk memeriksa tampilan panel admin tanpa menyiapkan Supabase.
//
// Kuncinya ada pada `import.meta.env.DEV`: nilainya true hanya saat `npm run dev`,
// dan Vite menggantinya dengan konstanta `false` ketika `npm run build`. Karena
// itu seluruh cabang di bawah terhapus dari berkas hasil build — pintasan ini
// tidak bisa aktif di produksi sekalipun VITE_ADMIN_BYPASS ikut terpasang di
// server. Pemeriksaan asli ke Supabase tetap satu-satunya jalan di produksi.
const LEWATI_LOGIN =
  import.meta.env.DEV && import.meta.env.VITE_ADMIN_BYPASS === 'true';

const ProtectedRoute = ({ children }) => {
  const { loading, user, isAdmin } = useAuth();
  const location = useLocation();

  if (LEWATI_LOGIN) {
    return (
      <>
        {/* Ditampilkan mencolok supaya tidak pernah disangka sudah login sungguhan. */}
        <p className="sticky top-0 z-50 bg-orange-500 px-4 py-1.5 text-center text-[11px] font-bold text-white">
          MODE PRATINJAU — login dilewati (VITE_ADMIN_BYPASS aktif, hanya berlaku di dev)
        </p>
        {children ?? <Outlet />}
      </>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-dark-50 px-4 text-sm text-dark-600">
        Memeriksa session admin...
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
