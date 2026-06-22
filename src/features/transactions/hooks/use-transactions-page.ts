import { useToast } from '@/providers/toast-context';
import { useCallback } from 'react';
import type { Transaction } from '../types/transaction';
import { useTransactionDelete } from './use-transaction-delete';
import { useTransactionFormState } from './use-transaction-form-state';
import { useTransactionSubmit } from './use-transaction-submit';
import { useTransactionsFilterFeedback } from './use-transactions-filter-feedback';
import { useTransactionsFilters } from './use-transactions-filters';
import { useTransactionsPagination } from './use-transactions-pagination';
import { useTransactionsQueries } from './use-transactions-queries';

export function useTransactionsPage() {
  const { showToast } = useToast();
  const formState = useTransactionFormState();
  const filtersState = useTransactionsFilters(showToast);
  const queriesState = useTransactionsQueries(filtersState.appliedFilters);
  const submitState = useTransactionSubmit({
    form: formState.form,
    resetForm: formState.resetForm,
    closeDrawer: formState.closeDrawer,
    showToast,
  });
  const deleteState = useTransactionDelete({
    form: formState.form,
    resetForm: formState.resetForm,
    showToast,
  });
  const paginationState = useTransactionsPagination({
    paginationMeta: queriesState.paginationMeta,
    setAppliedFilters: filtersState.setAppliedFilters,
  });

  const resetMutationFeedback = useCallback(() => {
    submitState.resetSubmitFeedback();
    deleteState.resetDeleteFeedback();
  }, [deleteState.resetDeleteFeedback, submitState.resetSubmitFeedback]);

  useTransactionsFilterFeedback({
    pendingMessage: filtersState.pendingFilterToastMessage,
    clearPendingMessage: filtersState.clearPendingFilterToastMessage,
    isFetching: queriesState.transactionsQuery.isFetching,
    isError: queriesState.transactionsQuery.isError,
    error: queriesState.transactionsQuery.error,
    total: queriesState.transactionsTotal,
    showToast,
  });

  function onEdit(transaction: Transaction) {
    resetMutationFeedback();
    formState.populateForm(transaction);
  }

  function onDelete(transaction: Transaction) {
    resetMutationFeedback();
    deleteState.requestDelete(transaction);
  }

  function onCancelEdit() {
    resetMutationFeedback();
    formState.resetForm();
    formState.closeDrawer();
  }

  function onOpenCreateDrawer() {
    resetMutationFeedback();
    formState.resetForm();
    formState.openCreateDrawer();
  }

  function onCloseFormDrawer() {
    if (submitState.isSubmitting) {
      return;
    }

    onCancelEdit();
  }

  function onCancelDelete() {
    if (deleteState.isConfirmingDelete) {
      return;
    }

    deleteState.clearPendingDelete();
  }

  return {
    form: formState.form,
    filtersForm: filtersState.filtersForm,
    categories: queriesState.categories,
    transactions: queriesState.transactions,
    paginationMeta: queriesState.paginationMeta,
    isEditing: formState.isEditing,
    isLoading: queriesState.isLoading,
    isSubmitting: submitState.isSubmitting,
    isApplyingFilters: queriesState.isApplyingFilters,
    deletingTransactionId: deleteState.deletingTransactionId,
    listErrorMessage: queriesState.listErrorMessage ?? deleteState.deleteError,
    categoryLoadErrorMessage: queriesState.categoryLoadErrorMessage,
    summaryDashboard: queriesState.summaryDashboard,
    summaryErrorMessage: queriesState.summaryErrorMessage,
    isSummaryLoading: queriesState.isSummaryLoading,
    hasSummaryScopeNotice: filtersState.hasSummaryScopeNotice,
    hasActiveFilters: filtersState.hasActiveFilters,
    hasQueryError: queriesState.hasQueryError,
    isCategorySelectDisabled: queriesState.isCategorySelectDisabled,
    isFormDrawerOpen: formState.isFormDrawerOpen,
    onSubmit: submitState.onSubmit,
    onApplyFilters: filtersState.onApplyFilters,
    onEdit,
    onDelete,
    onCancelEdit,
    onOpenCreateDrawer,
    onCloseFormDrawer,
    transactionPendingDelete: deleteState.transactionPendingDelete,
    isConfirmingDelete: deleteState.isConfirmingDelete,
    onCancelDelete,
    onConfirmDelete: deleteState.confirmDelete,
    onClearFilters: filtersState.onClearFilters,
    onPreviousPage: paginationState.onPreviousPage,
    onNextPage: paginationState.onNextPage,
    onRetry: queriesState.onRetry,
  };
}
