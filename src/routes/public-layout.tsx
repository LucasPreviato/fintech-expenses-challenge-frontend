import { AuthShell } from '@/features/auth/components/auth-shell';
import { useAuth } from '@/providers/auth-context';
import { Navigate, Outlet } from '@tanstack/react-router';

export function PublicLayout() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <AuthShell>
        <div className="rounded-xl border bg-card px-6 py-10 text-center">
          <p className="text-sm text-muted">Validando sessao...</p>
        </div>
      </AuthShell>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
