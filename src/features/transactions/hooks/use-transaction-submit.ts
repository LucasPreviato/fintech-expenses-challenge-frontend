import {
  createTransaction,
  transactionsQueryKey,
  updateTransaction,
} from '@/features/transactions/api/transactions-api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { ToastContextValue } from '@/providers/toast-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';
import type { TransactionFormValues } from '../lib/transaction-schemas';
import type {
  CreateTransactionRequest,
  TransactionType,
  UpdateTransactionRequest,
} from '../types/transaction';

interface UseTransactionSubmitParams {
  form: UseFormReturn<TransactionFormValues>;
  resetForm: () => void;
  closeDrawer: () => void;
  showToast: ToastContextValue['showToast'];
}

function normalizeAmountForApi(value: string) {
  return value.trim().replace(',', '.');
}

function toApiDate(value: string) {
  return `${value}T00:00:00.000Z`;
}

export function useTransactionSubmit({
  form,
  resetForm,
  closeDrawer,
  showToast,
}: UseTransactionSubmitParams) {
  const queryClient = useQueryClient();
  const createTransactionMutation = useMutation({ mutationFn: createTransaction });
  const updateTransactionMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: UpdateTransactionRequest;
    }) => updateTransaction(id, values),
  });

  function resetSubmitFeedback() {
    createTransactionMutation.reset();
    updateTransactionMutation.reset();
  }

  async function refreshTransactions() {
    await queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
  }

  const onSubmit = form.handleSubmit(async (values) => {
    resetSubmitFeedback();
    form.clearErrors('root');

    const payload: CreateTransactionRequest = {
      description: values.description.trim(),
      amount: normalizeAmountForApi(values.amount),
      date: toApiDate(values.date),
      type: values.type as TransactionType,
      categoryId: values.categoryId,
    };

    try {
      if (values.transactionId) {
        await updateTransactionMutation.mutateAsync({
          id: values.transactionId,
          values: payload,
        });
      } else {
        await createTransactionMutation.mutateAsync(payload);
      }

      showToast({
        type: 'success',
        title: values.transactionId ? 'Transação atualizada' : 'Transação criada',
        message: values.transactionId
          ? 'As alterações foram salvas com sucesso.'
          : 'O lançamento foi registrado com sucesso.',
      });

      resetForm();
      closeDrawer();
      await refreshTransactions();
    } catch (error) {
      const isEditing = Boolean(values.transactionId);
      const message = getApiErrorMessage(
        error,
        isEditing
          ? 'Não foi possível atualizar a transação agora.'
          : 'Não foi possível criar a transação agora.',
      );

      showToast({
        type: 'error',
        title: isEditing ? 'Falha ao atualizar transação' : 'Falha ao criar transação',
        message,
      });
      form.setError('root', { message });
    }
  });

  return {
    onSubmit,
    isSubmitting:
      createTransactionMutation.isPending || updateTransactionMutation.isPending,
    resetSubmitFeedback,
  };
}
