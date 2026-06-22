import {
  categoriesQueryKey,
  listCategories,
} from '@/features/categories/api/categories-api';
import { getApiErrorMessage } from '@/lib/api/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
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

function hasActiveFilters(filters: TransactionFilters) {
  return Boolean(
    filters.type || filters.categoryId || filters.startDate || filters.endDate,
  );
}

export function useTransactionsPage() {
  const queryClient = useQueryClient();
  const [appliedFilters, setAppliedFilters] = useState<TransactionFilters>(
    createDefaultFilters(),
  );

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
  const transactionsQuery = useQuery({
    queryKey: buildTransactionsQueryKey(appliedFilters),
    queryFn: () => listTransactions(appliedFilters),
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

  const feedbackMessage = updateTransactionMutation.isSuccess
    ? 'Transacao atualizada com sucesso.'
    : createTransactionMutation.isSuccess
      ? 'Transacao criada com sucesso.'
      : deleteTransactionMutation.isSuccess
        ? 'Transacao excluida com sucesso.'
        : undefined;

  const listErrorMessage = transactionsQuery.isError
    ? getApiErrorMessage(
        transactionsQuery.error,
        'Nao foi possivel carregar as transacoes agora.',
      )
    : deleteTransactionMutation.isError
      ? getApiErrorMessage(
          deleteTransactionMutation.error,
          'Nao foi possivel excluir a transacao agora.',
        )
      : undefined;

  const categoryLoadErrorMessage = categoriesQuery.isError
    ? getApiErrorMessage(
        categoriesQuery.error,
        'Nao foi possivel carregar as categorias agora.',
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
      } else {
        await createTransactionMutation.mutateAsync(payload);
      }

      resetForm();
      await refreshTransactions();
    } catch (error) {
      form.setError('root', {
        message: getApiErrorMessage(
          error,
          values.transactionId
            ? 'Nao foi possivel atualizar a transacao agora.'
            : 'Nao foi possivel criar a transacao agora.',
        ),
      });
    }
  });

  const onApplyFilters = filtersForm.handleSubmit((values) => {
    setAppliedFilters({
      page: 1,
      perPage: DEFAULT_PER_PAGE,
      type: values.type || undefined,
      categoryId: values.categoryId || undefined,
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    });
  });

  function handleEdit(transaction: Transaction) {
    resetMutationFeedback();
    form.clearErrors();
    form.reset({
      transactionId: transaction.id,
      description: transaction.description,
      amount: formatAmountForInput(transaction.amount),
      date: toDateInputValue(transaction.date),
      type: transaction.type,
      categoryId: transaction.category.id,
    });
  }

  async function handleDelete(transaction: Transaction) {
    resetMutationFeedback();
    form.clearErrors('root');

    try {
      await deleteTransactionMutation.mutateAsync(transaction);

      if (form.getValues('transactionId') === transaction.id) {
        resetForm();
      }

      await refreshTransactions();
    } catch {
      // Error feedback is rendered from the mutation state.
    }
  }

  function handleCancelEdit() {
    resetMutationFeedback();
    resetForm();
  }

  function handleClearFilters() {
    filtersForm.clearErrors();
    filtersForm.reset(emptyTransactionFiltersFormValues);
    setAppliedFilters(createDefaultFilters());
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
    await Promise.all([transactionsQuery.refetch(), categoriesQuery.refetch()]);
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
    feedbackMessage,
    listErrorMessage,
    categoryLoadErrorMessage,
    hasActiveFilters: hasActiveFilters(appliedFilters),
    hasQueryError: transactionsQuery.isError || categoriesQuery.isError,
    isCategorySelectDisabled:
      categoriesQuery.isLoading ||
      categoriesQuery.isError ||
      categories.length === 0,
    showFormSuccess:
      createTransactionMutation.isSuccess ||
      updateTransactionMutation.isSuccess,
    showDeleteSuccess: deleteTransactionMutation.isSuccess,
    onSubmit,
    onApplyFilters,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onCancelEdit: handleCancelEdit,
    onClearFilters: handleClearFilters,
    onPreviousPage: handlePreviousPage,
    onNextPage: handleNextPage,
    onRetry: handleRetry,
  };
}
