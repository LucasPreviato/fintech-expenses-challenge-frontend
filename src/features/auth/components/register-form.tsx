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
  type RegisterFormValues,
  registerSchema,
} from '@/features/auth/lib/auth-schemas';
import { useAuth } from '@/providers/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';

export function RegisterForm() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await register(values);
    await navigate({ to: '/dashboard' });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar conta</CardTitle>
        <CardDescription>
          Cadastro local so para destravar o fluxo inicial da interface.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              autoComplete="name"
              id="name"
              placeholder="Seu nome"
              type="text"
              {...form.register('name')}
            />
            <FieldError message={form.formState.errors.name?.message} />
          </div>

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
              autoComplete="new-password"
              id="password"
              placeholder="Minimo de 8 caracteres"
              type="password"
              {...form.register('password')}
            />
            <FieldError message={form.formState.errors.password?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              autoComplete="new-password"
              id="confirmPassword"
              placeholder="Repita a senha"
              type="password"
              {...form.register('confirmPassword')}
            />
            <FieldError
              message={form.formState.errors.confirmPassword?.message}
            />
          </div>

          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {form.formState.isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
