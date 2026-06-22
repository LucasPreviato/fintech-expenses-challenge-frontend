import { AppShell } from '@/components/layout/app-shell';
import { useAuth } from '@/providers/auth-context';
import { Navigate, Outlet } from '@tanstack/react-router';

export function ProtectedLayout() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <p className="text-sm text-muted">Validando sessão...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
