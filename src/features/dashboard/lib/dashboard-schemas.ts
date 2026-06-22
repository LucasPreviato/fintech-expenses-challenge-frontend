import { z } from 'zod';

const optionalDateFieldSchema = z.union([
  z.literal(''),
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use uma data valida no formato AAAA-MM-DD.'),
]);

export const dashboardFiltersSchema = z
  .object({
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

export type DashboardFiltersFormValues = z.infer<typeof dashboardFiltersSchema>;

export const emptyDashboardFiltersFormValues: DashboardFiltersFormValues = {
  startDate: '',
  endDate: '',
};
