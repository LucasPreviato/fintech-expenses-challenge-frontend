import { LoginForm } from '@/features/auth/components/login-form';
import { Link } from '@tanstack/react-router';

export function LoginPage() {
  return (
    <div className="space-y-4">
      <LoginForm />
      <div className="flex items-center justify-center gap-2 text-sm text-muted">
        <span>Ainda nao tem conta?</span>
        <Link
          className="font-medium text-primary hover:underline"
          to="/register"
        >
          Criar conta
        </Link>
      </div>
    </div>
  );
}
