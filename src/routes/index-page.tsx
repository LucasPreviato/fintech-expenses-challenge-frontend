import { useAuth } from '@/providers/auth-context';
import { Navigate } from '@tanstack/react-router';

export function IndexPage() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />;
}
