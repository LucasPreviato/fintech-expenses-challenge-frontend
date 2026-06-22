import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { FieldError } from '@/components/ui/field-error';
import { Label } from '@/components/ui/label';
import { SelectMenu } from '@/components/ui/select-menu';
import type { Category } from '@/features/categories/types/category';
import { transactionTypeLabel } from '@/features/transactions/types/transaction';
import { Filter, RotateCcw, Search } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { TransactionFiltersFormValues } from '../lib/transaction-schemas';

interface TransactionsFiltersProps {
  form: UseFormReturn<TransactionFiltersFormValues>;
  categories: Category[];
  hasActiveFilters: boolean;
  isApplyingFilters: boolean;
  isCategorySelectDisabled: boolean;
  categoryLoadErrorMessage?: string;
  onApplyFilters: FormEventHandler<HTMLFormElement>;
  onClearFilters: () => void;
}

export function TransactionsFilters({
  form,
  categories,
  hasActiveFilters,
  isApplyingFilters,
  isCategorySelectDisabled,
  categoryLoadErrorMessage,
  onApplyFilters,
  onClearFilters,
}: TransactionsFiltersProps) {
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <section className="rounded-[1.75rem] border border-white/80 bg-card px-6 py-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.22)]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Filter className="size-5" strokeWidth={1.85} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Filtros
              </h2>
              <p className="text-sm text-muted">
                Reforce sua leitura ajustando os filtros abaixo.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:pt-1">
            <Button
              disabled={isApplyingFilters && !hasActiveFilters}
              onClick={onClearFilters}
              type="button"
              variant="ghost"
            >
              <RotateCcw className="size-4" />
              Limpar filtros
            </Button>

            <Button
              disabled={isApplyingFilters}
              form="transactions-filters-form"
              type="submit"
            >
              <Search className="size-4" />
              {isApplyingFilters ? 'Aplicando...' : 'Aplicar filtros'}
            </Button>
          </div>
        </div>

        <form
          className="space-y-4"
          id="transactions-filters-form"
          onSubmit={onApplyFilters}
        >
          <FieldError message={form.formState.errors.root?.message} />
          <FieldError message={categoryLoadErrorMessage} />

          <div className="grid gap-4 xl:grid-cols-[1.05fr_1.05fr_1fr_1fr]">
            <div className="space-y-2">
              <Label htmlFor="transactions-filter-type">Tipo</Label>
              <Controller
                control={form.control}
                name="type"
                render={({ field }) => (
                  <SelectMenu
                    id="transactions-filter-type"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(nextValue) => field.onChange(nextValue)}
                    options={[
                      {
                        value: 'INCOME',
                        label: transactionTypeLabel.INCOME,
                      },
                      {
                        value: 'EXPENSE',
                        label: transactionTypeLabel.EXPENSE,
                      },
                    ]}
                    placeholder="Todos"
                    value={field.value}
                  />
                )}
              />
              <FieldError message={form.formState.errors.type?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactions-filter-category">Categoria</Label>
              <Controller
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <SelectMenu
                    disabled={isCategorySelectDisabled}
                    id="transactions-filter-category"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(nextValue) => field.onChange(nextValue)}
                    options={categoryOptions}
                    placeholder="Todas"
                    value={field.value}
                  />
                )}
              />
              <FieldError message={form.formState.errors.categoryId?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactions-filter-start-date">
                Data inicial
              </Label>
              <Controller
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <DatePicker
                    id="transactions-filter-start-date"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="dd/mm/aaaa"
                    value={field.value}
                  />
                )}
              />
              <FieldError message={form.formState.errors.startDate?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactions-filter-end-date">Data final</Label>
              <Controller
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <DatePicker
                    id="transactions-filter-end-date"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    placeholder="dd/mm/aaaa"
                    value={field.value}
                  />
                )}
              />
              <FieldError message={form.formState.errors.endDate?.message} />
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
