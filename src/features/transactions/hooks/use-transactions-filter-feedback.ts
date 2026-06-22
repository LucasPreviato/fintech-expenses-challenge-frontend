import { getApiErrorMessage } from '@/lib/api/client';
import type { ToastContextValue } from '@/providers/toast-context';
import { useEffect } from 'react';

interface UseTransactionsFilterFeedbackParams {
  pendingMessage: string | null;
  clearPendingMessage: () => void;
  isFetching: boolean;
  isError: boolean;
  error: unknown;
  total?: number;
  showToast: ToastContextValue['showToast'];
}

export function useTransactionsFilterFeedback({
  pendingMessage,
  clearPendingMessage,
  isFetching,
  isError,
  error,
  total,
  showToast,
}: UseTransactionsFilterFeedbackParams) {
  useEffect(() => {
    if (!pendingMessage || isFetching) {
      return;
    }

    if (isError) {
      showToast({
        type: 'error',
        title: 'Falha ao aplicar filtros',
        message: getApiErrorMessage(
          error,
          'Não foi possível atualizar a listagem com os filtros informados.',
        ),
      });
      clearPendingMessage();
      return;
    }

    if (typeof total !== 'number') {
      return;
    }

    showToast({
      type: 'success',
      title: 'Filtros aplicados',
      message:
        total === 1
          ? `${pendingMessage} 1 transação encontrada.`
          : `${pendingMessage} ${total} transações encontradas.`,
    });
    clearPendingMessage();
  }, [
    clearPendingMessage,
    error,
    isError,
    isFetching,
    pendingMessage,
    showToast,
    total,
  ]);
}
