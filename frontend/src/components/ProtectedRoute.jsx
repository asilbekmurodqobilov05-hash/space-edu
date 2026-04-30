import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { getCosmicSilkRoadUrl } from '@/lib/externalAuthUrl';

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      window.location.replace(getCosmicSilkRoadUrl());
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/40 text-sm">
        Redirecting to sign in…
      </div>
    );
  }
  return <Outlet />;
}
