import { TransactionForm } from '@/features/transactions/components/transaction-form';
import { TransactionsFilters } from '@/features/transactions/components/transactions-filters';
import { TransactionsList } from '@/features/transactions/components/transactions-list';
import { TransactionsLoadingState } from '@/features/transactions/components/transactions-loading-state';
import { TransactionsRetryCard } from '@/features/transactions/components/transactions-retry-card';
import { useTransactionsPage } from '@/features/transactions/hooks/use-transactions-page';

export function TransactionsPage() {
  const {
    form,
    filtersForm,
    categories,
    transactions,
    paginationMeta,
    isEditing,
    isLoading,
    isSubmitting,
    isApplyingFilters,
    deletingTransactionId,
    feedbackMessage,
    listErrorMessage,
    categoryLoadErrorMessage,
    hasActiveFilters,
    hasQueryError,
    isCategorySelectDisabled,
    showFormSuccess,
    showDeleteSuccess,
    onSubmit,
    onApplyFilters,
    onEdit,
    onDelete,
    onCancelEdit,
    onClearFilters,
    onPreviousPage,
    onNextPage,
    onRetry,
  } = useTransactionsPage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Transacoes</h1>
          <p className="text-sm text-muted">
            Registre entradas e saidas, ajuste filtros e acompanhe seus
            lancamentos por categoria.
          </p>
        </div>
      </div>

      <TransactionsFilters
        categories={categories}
        categoryLoadErrorMessage={categoryLoadErrorMessage}
        form={filtersForm}
        hasActiveFilters={hasActiveFilters}
        isApplyingFilters={isApplyingFilters}
        isCategorySelectDisabled={isCategorySelectDisabled}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
      />

      {isLoading ? (
        <TransactionsLoadingState />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <TransactionForm
            categories={categories}
            categoryLoadErrorMessage={categoryLoadErrorMessage}
            form={form}
            isCategorySelectDisabled={isCategorySelectDisabled}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            onCancelEdit={onCancelEdit}
            onSubmit={onSubmit}
            successMessage={showFormSuccess ? feedbackMessage : undefined}
          />

          <TransactionsList
            deletingTransactionId={deletingTransactionId}
            feedbackMessage={showDeleteSuccess ? feedbackMessage : undefined}
            hasActiveFilters={hasActiveFilters}
            listErrorMessage={listErrorMessage}
            onDelete={onDelete}
            onEdit={onEdit}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            paginationMeta={paginationMeta}
            transactions={transactions}
          />
        </div>
      )}

      {hasQueryError ? <TransactionsRetryCard onRetry={onRetry} /> : null}
    </div>
  );
}
