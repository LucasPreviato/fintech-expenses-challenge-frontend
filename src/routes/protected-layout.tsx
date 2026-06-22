import { AppShell } from '@/components/layout/app-shell';
import { useAuth } from '@/providers/auth-context';
import { Navigate, Outlet } from '@tanstack/react-router';

export function ProtectedLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
