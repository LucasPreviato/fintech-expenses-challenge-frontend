import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Drawer } from '@/components/ui/drawer';
import { TransactionForm } from '@/features/transactions/components/transaction-form';
import { TransactionsFilters } from '@/features/transactions/components/transactions-filters';
import { TransactionsList } from '@/features/transactions/components/transactions-list';
import { TransactionsLoadingState } from '@/features/transactions/components/transactions-loading-state';
import { TransactionsRetryCard } from '@/features/transactions/components/transactions-retry-card';
import { TransactionsSummaryCards } from '@/features/transactions/components/transactions-summary-cards';
import { useTransactionsPage } from '@/features/transactions/hooks/use-transactions-page';
import { CirclePlus } from 'lucide-react';

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
    listErrorMessage,
    categoryLoadErrorMessage,
    summaryDashboard,
    summaryErrorMessage,
    isSummaryLoading,
    hasSummaryScopeNotice,
    hasActiveFilters,
    hasQueryError,
    isCategorySelectDisabled,
    isFormDrawerOpen,
    transactionPendingDelete,
    isConfirmingDelete,
    onSubmit,
    onApplyFilters,
    onEdit,
    onDelete,
    onCancelEdit,
    onOpenCreateDrawer,
    onCloseFormDrawer,
    onCancelDelete,
    onConfirmDelete,
    onClearFilters,
    onPreviousPage,
    onNextPage,
    onRetry,
  } = useTransactionsPage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-[2.5rem] font-semibold tracking-tight text-foreground">
            Transacoes
          </h1>
          <p className="text-base text-muted">
            Registre entradas e saidas, ajuste filtros e acompanhe seus
            lancamentos por categoria.
          </p>
        </div>

        <Button onClick={onOpenCreateDrawer} type="button">
          <CirclePlus className="size-4" />
          Nova transacao
        </Button>
      </div>

      <TransactionsSummaryCards
        dashboard={summaryDashboard}
        isLoading={isSummaryLoading}
      />

      {summaryErrorMessage ? (
        <TransactionsRetryCard
          message={summaryErrorMessage}
          onRetry={onRetry}
        />
      ) : null}

      {hasSummaryScopeNotice ? (
        <div className="rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm text-muted">
          Os indicadores acima consideram somente o periodo selecionado. Filtros
          por tipo e categoria afetam a listagem, mas nao alteram os cards de
          resumo com a API atual.
        </div>
      ) : null}

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
        <TransactionsList
          deletingTransactionId={deletingTransactionId}
          hasActiveFilters={hasActiveFilters}
          listErrorMessage={listErrorMessage}
          onDelete={onDelete}
          onEdit={onEdit}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          onRefresh={onRetry}
          paginationMeta={paginationMeta}
          transactions={transactions}
        />
      )}

      {hasQueryError ? (
        <TransactionsRetryCard
          message={listErrorMessage ?? categoryLoadErrorMessage}
          onRetry={onRetry}
        />
      ) : null}

      <Drawer
        description={
          isEditing
            ? 'Atualize um lancamento existente sem perder o contexto da listagem.'
            : 'Preencha os dados e registre uma nova movimentacao financeira.'
        }
        onClose={onCloseFormDrawer}
        open={isFormDrawerOpen}
        title={isEditing ? 'Editar transacao' : 'Nova transacao'}
      >
        <TransactionForm
          categories={categories}
          categoryLoadErrorMessage={categoryLoadErrorMessage}
          form={form}
          isCategorySelectDisabled={isCategorySelectDisabled}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onCancelEdit={onCancelEdit}
          onClose={onCloseFormDrawer}
          onSubmit={onSubmit}
        />
      </Drawer>

      <ConfirmDialog
        cancelLabel="Voltar"
        confirmLabel="Excluir transacao"
        description={
          transactionPendingDelete
            ? `A transacao "${transactionPendingDelete.description}" sera removida permanentemente.`
            : ''
        }
        isLoading={isConfirmingDelete}
        onCancel={onCancelDelete}
        onConfirm={() => void onConfirmDelete()}
        open={Boolean(transactionPendingDelete)}
        title="Confirmar exclusao"
      />
    </div>
  );
}
