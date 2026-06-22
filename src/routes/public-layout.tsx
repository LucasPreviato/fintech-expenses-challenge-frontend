import { AuthShell } from '@/features/auth/components/auth-shell';
import { Outlet } from '@tanstack/react-router';

export function PublicLayout() {
  return (
    <AuthShell>
      <Outlet />
    </AuthShell>
  );
}
