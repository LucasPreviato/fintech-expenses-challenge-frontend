import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Informe um e-mail valido.'),
  password: z
    .string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .max(100, 'A senha deve ter no maximo 100 caracteres.'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Informe pelo menos 2 caracteres para o nome.')
      .max(100, 'O nome deve ter no maximo 100 caracteres.'),
    email: z.email('Informe um e-mail valido.'),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .max(100, 'A senha deve ter no maximo 100 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
