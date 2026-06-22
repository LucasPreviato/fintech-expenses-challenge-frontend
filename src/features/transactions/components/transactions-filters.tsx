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
import { Select } from '@/components/ui/select';
import type { Category } from '@/features/categories/types/category';
import { transactionTypeLabel } from '@/features/transactions/types/transaction';
import type { FormEventHandler } from 'react';
import type { UseFormReturn } from 'react-hook-form';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>
          Refine a busca por tipo, categoria e periodo. Os filtros so sao
          aplicados quando voce confirmar.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={onApplyFilters}>
          <FieldError message={form.formState.errors.root?.message} />
          <FieldError message={categoryLoadErrorMessage} />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="transactions-filter-type">Tipo</Label>
              <Select id="transactions-filter-type" {...form.register('type')}>
                <option value="">Todos</option>
                <option value="INCOME">{transactionTypeLabel.INCOME}</option>
                <option value="EXPENSE">{transactionTypeLabel.EXPENSE}</option>
              </Select>
              <FieldError message={form.formState.errors.type?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactions-filter-category">Categoria</Label>
              <Select
                disabled={isCategorySelectDisabled}
                id="transactions-filter-category"
                {...form.register('categoryId')}
              >
                <option value="">Todas</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <FieldError message={form.formState.errors.categoryId?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactions-filter-start-date">
                Data inicial
              </Label>
              <Input
                id="transactions-filter-start-date"
                type="date"
                {...form.register('startDate')}
              />
              <FieldError message={form.formState.errors.startDate?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactions-filter-end-date">Data final</Label>
              <Input
                id="transactions-filter-end-date"
                type="date"
                {...form.register('endDate')}
              />
              <FieldError message={form.formState.errors.endDate?.message} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button disabled={isApplyingFilters} type="submit">
              {isApplyingFilters ? 'Buscando...' : 'Aplicar filtros'}
            </Button>

            <Button
              disabled={isApplyingFilters && !hasActiveFilters}
              onClick={onClearFilters}
              type="button"
              variant="secondary"
            >
              Limpar filtros
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
