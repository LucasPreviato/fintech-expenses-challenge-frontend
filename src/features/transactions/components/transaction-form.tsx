import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { FieldError } from '@/components/ui/field-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type { Category } from '@/features/categories/types/category';
import { transactionTypeLabel } from '@/features/transactions/types/transaction';
import type { FormEventHandler } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { TransactionFormValues } from '../lib/transaction-schemas';

interface TransactionFormProps {
  form: UseFormReturn<TransactionFormValues>;
  categories: Category[];
  isEditing: boolean;
  isSubmitting: boolean;
  isCategorySelectDisabled: boolean;
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
  categoryLoadErrorMessage,
  onSubmit,
  onCancelEdit,
}: TransactionFormProps) {
  const hasCategories = categories.length > 0;
  const isSubmitDisabled =
    isSubmitting || isCategorySelectDisabled || !hasCategories;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Editar transacao' : 'Criar transacao'}
        </CardTitle>
        <CardDescription>
          Registre entradas e saidas com categoria, valor e data.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!hasCategories && !categoryLoadErrorMessage ? (
          <EmptyState
            description="Antes do primeiro lancamento, crie ao menos uma categoria para organizar suas movimentacoes."
            title="Nenhuma categoria disponivel"
          />
        ) : null}

        <form className="space-y-4" onSubmit={onSubmit}>
          <FieldError message={form.formState.errors.root?.message} />
          <FieldError message={categoryLoadErrorMessage} />

          <div className="space-y-2">
            <Label htmlFor="transaction-description">Descricao</Label>
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
              <Input
                id="transaction-date"
                type="date"
                {...form.register('date')}
              />
              <FieldError message={form.formState.errors.date?.message} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="transaction-type">Tipo</Label>
              <Select id="transaction-type" {...form.register('type')}>
                <option value="">Selecione o tipo</option>
                <option value="INCOME">{transactionTypeLabel.INCOME}</option>
                <option value="EXPENSE">{transactionTypeLabel.EXPENSE}</option>
              </Select>
              <FieldError message={form.formState.errors.type?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction-category">Categoria</Label>
              <Select
                disabled={isCategorySelectDisabled}
                id="transaction-category"
                {...form.register('categoryId')}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              <FieldError message={form.formState.errors.categoryId?.message} />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button disabled={isSubmitDisabled} type="submit">
              {isSubmitting
                ? isEditing
                  ? 'Salvando...'
                  : 'Criando...'
                : isEditing
                  ? 'Salvar alteracoes'
                  : 'Criar transacao'}
            </Button>

            {isEditing ? (
              <Button
                disabled={isSubmitting}
                onClick={onCancelEdit}
                type="button"
                variant="secondary"
              >
                Cancelar edicao
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
