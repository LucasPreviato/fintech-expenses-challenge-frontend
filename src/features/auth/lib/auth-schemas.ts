import { z } from 'zod';

export const passwordStrengthRules = {
  minLength: 8,
  hasLowercase: /[a-z]/,
  hasUppercase: /[A-Z]/,
  hasNumber: /\d/,
  hasSpecialCharacter: /[^A-Za-z\d]/,
} as const;

export const passwordStrengthMessage =
  'Use pelo menos 8 caracteres com letra maiuscula, minuscula, numero e caractere especial.';

export function getPasswordRequirementState(password: string) {
  return {
    minLength: password.length >= passwordStrengthRules.minLength,
    hasLowercase: passwordStrengthRules.hasLowercase.test(password),
    hasUppercase: passwordStrengthRules.hasUppercase.test(password),
    hasNumber: passwordStrengthRules.hasNumber.test(password),
    hasSpecialCharacter:
      passwordStrengthRules.hasSpecialCharacter.test(password),
  };
}

function isStrongPassword(password: string) {
  const state = getPasswordRequirementState(password);

  return Object.values(state).every(Boolean);
}

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
      .max(100, 'A senha deve ter no maximo 100 caracteres.')
      .refine(isStrongPassword, passwordStrengthMessage),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas precisam ser iguais.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
