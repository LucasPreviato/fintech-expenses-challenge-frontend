import { RegisterForm } from '@/features/auth/components/register-form';
import { Link } from '@tanstack/react-router';

export function RegisterPage() {
  return (
    <div className="space-y-4">
      <RegisterForm />
      <div className="flex items-center justify-center gap-2 text-sm text-muted">
        <span>Ja possui acesso?</span>
        <Link className="font-medium text-primary hover:underline" to="/login">
          Entrar
        </Link>
      </div>
    </div>
  );
}
