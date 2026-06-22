import { z } from 'zod';

export const categoryFormSchema = z.object({
  categoryId: z.string().optional(),
  name: z
    .string()
    .trim()
    .min(2, 'Informe ao menos 2 caracteres para o nome.')
    .max(100, 'Use no maximo 100 caracteres no nome.'),
  description: z
    .string()
    .trim()
    .max(255, 'Use no maximo 255 caracteres na descricao.'),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const emptyCategoryFormValues: CategoryFormValues = {
  categoryId: undefined,
  name: '',
  description: '',
};
