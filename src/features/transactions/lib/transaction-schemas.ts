import { z } from 'zod';
import { transactionTypeValues } from '../types/transaction';

const transactionTypeFieldSchema = z
  .union([z.literal(''), z.enum(transactionTypeValues)])
  .refine((value) => value.length > 0, {
    message: 'Selecione o tipo da transacao.',
  });

const optionalDateFieldSchema = z.union([
  z.literal(''),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use uma data valida no formato AAAA-MM-DD.'),
]);

export const transactionFormSchema = z.object({
  transactionId: z.string().optional(),
  description: z
    .string()
    .trim()
    .min(2, 'Informe ao menos 2 caracteres para a descricao.')
    .max(255, 'Use no maximo 255 caracteres na descricao.'),
  amount: z
    .string()
    .trim()
    .regex(
      /^\d+([.,]\d{1,2})?$/,
      'Informe um valor positivo com ate 2 casas decimais.',
    )
    .refine(
      (value) => Number.parseFloat(value.replace(',', '.')) > 0,
      'Informe um valor maior que zero.',
    ),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Selecione uma data valida.'),
  type: transactionTypeFieldSchema,
  categoryId: z.string().min(1, 'Selecione uma categoria.'),
});

export const transactionFiltersSchema = z
  .object({
    type: z.union([z.literal(''), z.enum(transactionTypeValues)]),
    categoryId: z.string(),
    startDate: optionalDateFieldSchema,
    endDate: optionalDateFieldSchema,
  })
  .refine(
    (values) => {
      if (!values.startDate || !values.endDate) {
        return true;
      }

      return values.startDate <= values.endDate;
    },
    {
      message: 'A data inicial precisa ser anterior ou igual a data final.',
      path: ['endDate'],
    },
  );

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
export type TransactionFiltersFormValues = z.infer<
  typeof transactionFiltersSchema
>;

export const emptyTransactionFormValues: TransactionFormValues = {
  transactionId: undefined,
  description: '',
  amount: '',
  date: '',
  type: '',
  categoryId: '',
};

export const emptyTransactionFiltersFormValues: TransactionFiltersFormValues = {
  type: '',
  categoryId: '',
  startDate: '',
  endDate: '',
};
