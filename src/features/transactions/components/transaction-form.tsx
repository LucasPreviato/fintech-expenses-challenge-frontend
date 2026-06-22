import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { EmptyState } from '@/components/ui/empty-state';
import { FieldError } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SelectMenu } from '@/components/ui/select-menu';
import type { Category } from '@/features/categories/types/category';
import { transactionTypeLabel } from '@/features/transactions/types/transaction';
import type { FormEventHandler } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';
import type { TransactionFormValues } from '../lib/transaction-schemas';

interface TransactionFormProps {
  form: UseFormReturn<TransactionFormValues>;
  categories: Category[];
  isEditing: boolean;
  isSubmitting: boolean;
  isCategorySelectDisabled: boolean;
  onClose: () => void;
  categoryLoadErrorMessage?: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancelEdit: () => void;
}

export function TransactionForm({
  form,
  categories,
  isEditing,
  isSubmitting,
  isCategorySelectDisabled,
  onClose,
  categoryLoadErrorMessage,
  onSubmit,
  onCancelEdit,
}: TransactionFormProps) {
  const hasCategories = categories.length > 0;
  const isSubmitDisabled =
    isSubmitting || isCategorySelectDisabled || !hasCategories;
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <div className="space-y-6">
      {!hasCategories && !categoryLoadErrorMessage ? (
        <EmptyState
          description="Antes do primeiro lançamento, crie ao menos uma categoria para organizar suas movimentações."
          title="Nenhuma categoria disponível"
        />
      ) : null}

      <form className="space-y-4" onSubmit={onSubmit}>
        <FieldError message={form.formState.errors.root?.message} />
        <FieldError message={categoryLoadErrorMessage} />

        <div className="space-y-2">
          <Label htmlFor="transaction-description">Descrição</Label>
          <Input
            id="transaction-description"
            placeholder="Ex.: Reembolso de deslocamento"
            type="text"
            {...form.register('description')}
          />
          <FieldError message={form.formState.errors.description?.message} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="transaction-amount">Valor</Label>
            <Input
              id="transaction-amount"
              inputMode="decimal"
              placeholder="Ex.: 125,90"
              type="text"
              {...form.register('amount')}
            />
            <FieldError message={form.formState.errors.amount?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction-date">Data</Label>
            <Controller
              control={form.control}
              name="date"
              render={({ field }) => (
                <DatePicker
                  id="transaction-date"
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            <FieldError message={form.formState.errors.date?.message} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="transaction-type">Tipo</Label>
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <SelectMenu
                  id="transaction-type"
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
                  placeholder="Selecione o tipo"
                  value={field.value}
                />
              )}
            />
            <FieldError message={form.formState.errors.type?.message} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction-category">Categoria</Label>
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <SelectMenu
                  disabled={isCategorySelectDisabled}
                  id="transaction-category"
                  name={field.name}
                  onBlur={field.onBlur}
                  onChange={(nextValue) => field.onChange(nextValue)}
                  options={categoryOptions}
                  placeholder="Selecione uma categoria"
                  value={field.value}
                />
              )}
            />
            <FieldError message={form.formState.errors.categoryId?.message} />
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
          <Button
            disabled={isSubmitting}
            onClick={isEditing ? onCancelEdit : onClose}
            type="button"
            variant="secondary"
          >
            {isEditing ? 'Cancelar edição' : 'Fechar'}
          </Button>
          <Button disabled={isSubmitDisabled} type="submit">
            {isSubmitting
              ? isEditing
                ? 'Salvando...'
                : 'Criando...'
              : isEditing
                ? 'Salvar alterações'
                : 'Criar transação'}
          </Button>
        </div>
      </form>
    </div>
  );
}
