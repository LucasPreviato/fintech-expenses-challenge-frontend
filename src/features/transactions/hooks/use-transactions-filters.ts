import type { ToastContextValue } from '@/providers/toast-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type TransactionFiltersFormValues,
  emptyTransactionFiltersFormValues,
  transactionFiltersSchema,
} from '../lib/transaction-schemas';
import type { TransactionFilters } from '../types/transaction';

const DEFAULT_PER_PAGE = 10;

function createDefaultFilters(): TransactionFilters {
  return {
    page: 1,
    perPage: DEFAULT_PER_PAGE,
  };
}

function buildFilterToastMessage(filters: TransactionFilters) {
  const filterDetails = [
    filters.type
      ? `tipo: ${filters.type === 'INCOME' ? 'entrada' : 'saída'}`
      : null,
    filters.categoryId ? 'categoria selecionada' : null,
    filters.startDate ? `de ${filters.startDate}` : null,
    filters.endDate ? `até ${filters.endDate}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return filterDetails.length > 0
    ? `Busca atualizada com ${filterDetails}.`
    : 'A listagem foi atualizada com todos os registros.';
}

export function useTransactionsFilters(showToast: ToastContextValue['showToast']) {
  const [appliedFilters, setAppliedFilters] = useState<TransactionFilters>(
    createDefaultFilters(),
  );
  const [pendingFilterToastMessage, setPendingFilterToastMessage] = useState<
    string | null
  >(null);
  const filtersForm = useForm<TransactionFiltersFormValues>({
    resolver: zodResolver(transactionFiltersSchema),
    defaultValues: emptyTransactionFiltersFormValues,
  });

  const onApplyFilters = filtersForm.handleSubmit((values) => {
    const nextFilters: TransactionFilters = {
      page: 1,
      perPage: DEFAULT_PER_PAGE,
      type: values.type || undefined,
      categoryId: values.categoryId || undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    };

    setAppliedFilters(nextFilters);
    setPendingFilterToastMessage(buildFilterToastMessage(nextFilters));
  });

  function onClearFilters() {
    setPendingFilterToastMessage(null);
    filtersForm.clearErrors();
    filtersForm.reset(emptyTransactionFiltersFormValues);
    setAppliedFilters(createDefaultFilters());
    showToast({
      type: 'info',
      title: 'Filtros removidos',
      message: 'A listagem voltou a considerar todas as transações.',
    });
  }

  return {
    filtersForm,
    appliedFilters,
    setAppliedFilters,
    pendingFilterToastMessage,
    clearPendingFilterToastMessage: () => setPendingFilterToastMessage(null),
    hasActiveFilters: Boolean(
      appliedFilters.type ||
        appliedFilters.categoryId ||
        appliedFilters.startDate ||
        appliedFilters.endDate,
    ),
    hasSummaryScopeNotice: Boolean(
      appliedFilters.type || appliedFilters.categoryId,
    ),
    onApplyFilters,
    onClearFilters,
  };
}
