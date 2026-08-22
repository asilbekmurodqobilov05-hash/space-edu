import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Guards routes that only staff may see.
 *
 * /admin-panel used to sit behind plain ProtectedRoute, so any signed-in
 * student could load the admin dashboard. The backend rejects the data with
 * IsAdminUser, so nothing leaked, but the whole admin surface rendered and
 * filled with 403s.
 */
export default function StaffRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isStaff = useAuthStore((s) => Boolean(s.user?.is_staff));
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!isStaff) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
