import {
  deleteTransaction,
  transactionsQueryKey,
} from '@/features/transactions/api/transactions-api';
import { getApiErrorMessage } from '@/lib/api/client';
import type { ToastContextValue } from '@/providers/toast-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { TransactionFormValues } from '../lib/transaction-schemas';
import type { Transaction } from '../types/transaction';

interface UseTransactionDeleteParams {
  form: UseFormReturn<TransactionFormValues>;
  resetForm: () => void;
  showToast: ToastContextValue['showToast'];
}

export function useTransactionDelete({
  form,
  resetForm,
  showToast,
}: UseTransactionDeleteParams) {
  const queryClient = useQueryClient();
  const [transactionPendingDelete, setTransactionPendingDelete] =
    useState<Transaction | null>(null);
  const deleteTransactionMutation = useMutation({
    mutationFn: (transaction: Transaction) => deleteTransaction(transaction.id),
  });

  function resetDeleteFeedback() {
    deleteTransactionMutation.reset();
  }

  function requestDelete(transaction: Transaction) {
    setTransactionPendingDelete(transaction);
  }

  function clearPendingDelete() {
    setTransactionPendingDelete(null);
  }

  async function refreshTransactions() {
    await queryClient.invalidateQueries({ queryKey: transactionsQueryKey });
  }

  async function confirmDelete() {
    if (!transactionPendingDelete) {
      return;
    }

    resetDeleteFeedback();
    form.clearErrors('root');

    try {
      await deleteTransactionMutation.mutateAsync(transactionPendingDelete);

      if (form.getValues('transactionId') === transactionPendingDelete.id) {
        resetForm();
      }

      await refreshTransactions();
      showToast({
        type: 'success',
        title: 'Transação excluída',
        message: `"${transactionPendingDelete.description}" foi removida com sucesso.`,
      });
      clearPendingDelete();
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Falha ao excluir transação',
        message: getApiErrorMessage(
          error,
          'Não foi possível excluir a transação agora.',
        ),
      });
    }
  }

  return {
    transactionPendingDelete,
    deletingTransactionId: deleteTransactionMutation.variables?.id,
    isConfirmingDelete: deleteTransactionMutation.isPending,
    deleteError: deleteTransactionMutation.isError
      ? getApiErrorMessage(
          deleteTransactionMutation.error,
          'Não foi possível excluir a transação agora.',
        )
      : undefined,
    requestDelete,
    clearPendingDelete,
    confirmDelete,
    resetDeleteFeedback,
  };
}
