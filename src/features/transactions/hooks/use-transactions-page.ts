import {
  categoriesQueryKey,
  listCategories,
} from '@/features/categories/api/categories-api';
import { getDashboard } from '@/features/dashboard/api/dashboard-api';
import type { DashboardFilters } from '@/features/dashboard/types/dashboard';
import { getApiErrorMessage } from '@/lib/api/client';
import { useToast } from '@/providers/toast-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  buildTransactionsQueryKey,
  createTransaction,
  deleteTransaction,
  listTransactions,
  transactionsQueryKey,
  updateTransaction,
} from '../api/transactions-api';
import {
  type TransactionFiltersFormValues,
  type TransactionFormValues,
  emptyTransactionFiltersFormValues,
  emptyTransactionFormValues,
  transactionFiltersSchema,
  transactionFormSchema,
} from '../lib/transaction-schemas';
import type {
  Transaction,
  TransactionFilters,
  TransactionType,
} from '../types/transaction';

const DEFAULT_PER_PAGE = 10;

function normalizeAmountForApi(value: string) {
  return value.trim().replace(',', '.');
}

function formatAmountForInput(value: string) {
  return value.replace('.', ',');
}

function toApiDate(value: string) {
  return `${value}T00:00:00.000Z`;
}

function toDateInputValue(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

function createDefaultFilters(): TransactionFilters {
  return {
    page: 1,
    perPage: DEFAULT_PER_PAGE,
  };
}

function getDashboardFilters(filters: TransactionFilters): DashboardFilters {
  return {
    startDate: filters.startDate,
    endDate: filters.endDate,
  };
}

function hasActiveFilters(filters: TransactionFilters) {
  return Boolean(
    filters.type || filters.categoryId || filters.startDate || filters.endDate,
  );
}

export function useTransactionsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [appliedFilters, setAppliedFilters] = useState<TransactionFilters>(
    createDefaultFilters(),
  );
  const [transactionPendingDelete, setTransactionPendingDelete] =
    useState<Transaction | null>(null);
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const [pendingFilterToastMessage, setPendingFilterToastMessage] = useState<
    string | null
  >(null);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: emptyTransactionFormValues,
  });
  const filtersForm = useForm<TransactionFiltersFormValues>({
    resolver: zodResolver(transactionFiltersSchema),
    defaultValues: emptyTransactionFiltersFormValues,
  });

  const categoriesQuery = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: listCategories,
  });
  const dashboardFilters = getDashboardFilters(appliedFilters);
  const transactionsQuery = useQuery({
    queryKey: buildTransactionsQueryKey(appliedFilters),
    queryFn: () => listTransactions(appliedFilters),
  });
  const dashboardSummaryQuery = useQuery({
    queryKey: ['transactions', 'summary', dashboardFilters],
    // Dashboard cards intentionally reflect period-only filters.
    queryFn: () => getDashboard(dashboardFilters),
  });
  const createTransactionMutation = useMutation({
    mutationFn: createTransaction,
  });
  const updateTransactionMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: {
        description: string;
        amount: string;
        date: string;
        type: 'INCOME' | 'EXPENSE';
        categoryId: string;
      };
    }) => updateTransaction(id, values),
  });
  const deleteTransactionMutation = useMutation({
    mutationFn: (transaction: Transaction) => deleteTransaction(transaction.id),
  });

  const categories = categoriesQuery.data ?? [];
  const transactions = transactionsQuery.data?.data ?? [];
  const paginationMeta = transactionsQuery.data?.meta;
  const isEditing = Boolean(form.watch('transactionId'));

  const listErrorMessage = transactionsQuery.isError
    ? getApiErrorMessage(
        transactionsQuery.error,
        'Não foi possível carregar as transações agora.',
      )
    : deleteTransactionMutation.isError
      ? getApiErrorMessage(
          deleteTransactionMutation.error,
          'Não foi possível excluir a transação agora.',
        )
      : undefined;

  const categoryLoadErrorMessage = categoriesQuery.isError
    ? getApiErrorMessage(
        categoriesQuery.error,
        'Não foi possível carregar as categorias agora.',
      )
    : undefined;
  const summaryErrorMessage = dashboardSummaryQuery.isError
    ? getApiErrorMessage(
        dashboardSummaryQuery.error,
        'Não foi possível carregar os indicadores agora.',
      )
    : undefined;

  function resetMutationFeedback() {
    createTransactionMutation.reset();
    updateTransactionMutation.reset();
    deleteTransactionMutation.reset();
  }

  function resetForm() {
    form.clearErrors();
    form.reset(emptyTransactionFormValues);
  }

  async function refreshTransactions() {
    await queryClient.invalidateQueries({
      queryKey: transactionsQueryKey,
    });
  }

  useEffect(() => {
    if (!pendingFilterToastMessage || transactionsQuery.isFetching) {
      return;
    }

    if (transactionsQuery.isError) {
      showToast({
        type: 'error',
        title: 'Falha ao aplicar filtros',
        message: getApiErrorMessage(
          transactionsQuery.error,
          'Não foi possível atualizar a listagem com os filtros informados.',
        ),
      });
      setPendingFilterToastMessage(null);
      return;
    }

    if (!transactionsQuery.data) {
      return;
    }

    const total = transactionsQuery.data.meta.total;

    showToast({
      type: 'success',
      title: 'Filtros aplicados',
      message:
        total === 1
          ? `${pendingFilterToastMessage} 1 transação encontrada.`
          : `${pendingFilterToastMessage} ${total} transações encontradas.`,
    });
    setPendingFilterToastMessage(null);
  }, [
    pendingFilterToastMessage,
    showToast,
    transactionsQuery.data,
    transactionsQuery.error,
    transactionsQuery.isError,
    transactionsQuery.isFetching,
  ]);

  const onSubmit = form.handleSubmit(async (values) => {
    resetMutationFeedback();
    form.clearErrors('root');
    const transactionType = values.type as TransactionType;

    const payload = {
      description: values.description.trim(),
      amount: normalizeAmountForApi(values.amount),
      date: toApiDate(values.date),
      type: transactionType,
      categoryId: values.categoryId,
    };

    try {
      if (values.transactionId) {
        await updateTransactionMutation.mutateAsync({
          id: values.transactionId,
          values: payload,
        });
        showToast({
          type: 'success',
          title: 'Transação atualizada',
          message: 'As alterações foram salvas com sucesso.',
        });
      } else {
        await createTransactionMutation.mutateAsync(payload);
        showToast({
          type: 'success',
          title: 'Transação criada',
          message: 'O lançamento foi registrado com sucesso.',
        });
      }

      resetForm();
      setIsFormDrawerOpen(false);
      await refreshTransactions();
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        values.transactionId
          ? 'Não foi possível atualizar a transação agora.'
          : 'Não foi possível criar a transação agora.',
      );

      showToast({
        type: 'error',
        title: values.transactionId
          ? 'Falha ao atualizar transação'
          : 'Falha ao criar transação',
        message,
      });

      form.setError('root', {
        message,
      });
    }
  });

  const onApplyFilters = filtersForm.handleSubmit((values) => {
    const nextFilters = {
      page: 1,
      perPage: DEFAULT_PER_PAGE,
      type: values.type || undefined,
      categoryId: values.categoryId || undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    };

    setAppliedFilters(nextFilters);

    const filterDetails = [
      nextFilters.type
        ? `tipo: ${nextFilters.type === 'INCOME' ? 'entrada' : 'saída'}`
        : null,
      nextFilters.categoryId ? 'categoria selecionada' : null,
      nextFilters.startDate ? `de ${nextFilters.startDate}` : null,
      nextFilters.endDate ? `até ${nextFilters.endDate}` : null,
    ]
      .filter(Boolean)
      .join(', ');

    setPendingFilterToastMessage(
      filterDetails.length > 0
        ? `Busca atualizada com ${filterDetails}.`
        : 'A listagem foi atualizada com todos os registros.',
    );
  });

  function handleEdit(transaction: Transaction) {
    resetMutationFeedback();
    form.clearErrors();
    setIsFormDrawerOpen(true);
    form.reset({
      transactionId: transaction.id,
      description: transaction.description,
      amount: formatAmountForInput(transaction.amount),
      date: toDateInputValue(transaction.date),
      type: transaction.type,
      categoryId: transaction.category.id,
    });
  }

  function handleRequestDelete(transaction: Transaction) {
    resetMutationFeedback();
    setTransactionPendingDelete(transaction);
  }

  function handleCancelDelete() {
    if (deleteTransactionMutation.isPending) {
      return;
    }

    setTransactionPendingDelete(null);
  }

  async function handleConfirmDelete() {
    const transaction = transactionPendingDelete;

    if (!transaction) {
      return;
    }

    resetMutationFeedback();
    form.clearErrors('root');

    try {
      await deleteTransactionMutation.mutateAsync(transaction);

      if (form.getValues('transactionId') === transaction.id) {
        resetForm();
      }

      await refreshTransactions();
      showToast({
        type: 'success',
        title: 'Transação excluída',
        message: `"${transaction.description}" foi removida com sucesso.`,
      });
      setTransactionPendingDelete(null);
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

  function handleCancelEdit() {
    resetMutationFeedback();
    resetForm();
    setIsFormDrawerOpen(false);
  }

  function handleOpenCreateDrawer() {
    resetMutationFeedback();
    resetForm();
    setIsFormDrawerOpen(true);
  }

  function handleCloseFormDrawer() {
    if (
      createTransactionMutation.isPending ||
      updateTransactionMutation.isPending
    ) {
      return;
    }

    handleCancelEdit();
  }

  function handleClearFilters() {
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

  function handlePreviousPage() {
    if (!paginationMeta?.hasPreviousPage) {
      return;
    }

    setAppliedFilters((current) => ({
      ...current,
      page: current.page - 1,
    }));
  }

  function handleNextPage() {
    if (!paginationMeta?.hasNextPage) {
      return;
    }

    setAppliedFilters((current) => ({
      ...current,
      page: current.page + 1,
    }));
  }

  async function handleRetry() {
    await Promise.all([
      transactionsQuery.refetch(),
      categoriesQuery.refetch(),
      dashboardSummaryQuery.refetch(),
    ]);
  }

  return {
    form,
    filtersForm,
    categories,
    transactions,
    paginationMeta,
    isEditing,
    isLoading:
      (transactionsQuery.isLoading && !transactionsQuery.data) ||
      (categoriesQuery.isLoading && !categoriesQuery.data),
    isSubmitting:
      createTransactionMutation.isPending ||
      updateTransactionMutation.isPending,
    isApplyingFilters: transactionsQuery.isFetching,
    deletingTransactionId: deleteTransactionMutation.variables?.id,
    listErrorMessage,
    categoryLoadErrorMessage,
    summaryDashboard: dashboardSummaryQuery.data,
    summaryErrorMessage,
    isSummaryLoading:
      dashboardSummaryQuery.isLoading && !dashboardSummaryQuery.data,
    hasSummaryScopeNotice: Boolean(
      appliedFilters.type || appliedFilters.categoryId,
    ),
    hasActiveFilters: hasActiveFilters(appliedFilters),
    hasQueryError: transactionsQuery.isError || categoriesQuery.isError,
    isCategorySelectDisabled:
      categoriesQuery.isLoading ||
      categoriesQuery.isError ||
      categories.length === 0,
    isFormDrawerOpen,
    onSubmit,
    onApplyFilters,
    onEdit: handleEdit,
    onDelete: handleRequestDelete,
    onCancelEdit: handleCancelEdit,
    onOpenCreateDrawer: handleOpenCreateDrawer,
    onCloseFormDrawer: handleCloseFormDrawer,
    transactionPendingDelete,
    isConfirmingDelete: deleteTransactionMutation.isPending,
    onCancelDelete: handleCancelDelete,
    onConfirmDelete: handleConfirmDelete,
    onClearFilters: handleClearFilters,
    onPreviousPage: handlePreviousPage,
    onNextPage: handleNextPage,
    onRetry: handleRetry,
  };
}
