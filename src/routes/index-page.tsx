import { useAuth } from '@/providers/auth-context';
import { Navigate } from '@tanstack/react-router';

export function IndexPage() {
  const { isAuthenticated } = useAuth();

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />;
}
