import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldError } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type LoginFormValues,
  loginSchema,
} from '@/features/auth/lib/auth-schemas';
import { useAuth } from '@/providers/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

export function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    form.clearErrors('root');

    try {
      await login(values);
      await navigate({ to: '/dashboard' });
    } catch (error) {
      form.setError('root', {
        message:
          error instanceof Error ? error.message : 'Nao foi possivel entrar.',
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>
          Use sua conta para acessar a plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <FieldError message={form.formState.errors.root?.message} />
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              autoComplete="email"
              id="email"
              placeholder="voce@empresa.com"
              type="email"
              {...form.register('email')}
            />
            <FieldError message={form.formState.errors.email?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              autoComplete="current-password"
              id="password"
              placeholder="Minimo de 8 caracteres"
              type="password"
              {...form.register('password')}
            />
            <FieldError message={form.formState.errors.password?.message} />
          </div>

          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
