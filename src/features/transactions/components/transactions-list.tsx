import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { FieldError } from '@/components/ui/field-error';
import type { PaginationMeta } from '@/features/categories/types/category';
import { formatCurrency } from '@/features/dashboard/lib/dashboard-formatters';
import {
  type Transaction,
  transactionTypeLabel,
} from '@/features/transactions/types/transaction';
import { cn } from '@/lib/utils';
import { PencilLine, RefreshCw, Trash2 } from 'lucide-react';

interface TransactionsListProps {
  transactions: Transaction[];
  paginationMeta?: PaginationMeta;
  deletingTransactionId?: string;
  listErrorMessage?: string;
  hasActiveFilters: boolean;
  onRefresh: () => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function getTypeStyles(type: Transaction['type']) {
  if (type === 'INCOME') {
    return 'bg-emerald-50 text-emerald-600';
  }

  return 'bg-rose-50 text-rose-500';
}

export function TransactionsList({
  transactions,
  paginationMeta,
  deletingTransactionId,
  listErrorMessage,
  hasActiveFilters,
  onRefresh,
  onEdit,
  onDelete,
  onPreviousPage,
  onNextPage,
}: TransactionsListProps) {
  const totalItems = paginationMeta?.total ?? transactions.length;

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/80 bg-card shadow-[0_20px_50px_-30px_rgba(15,23,42,0.22)]">
        <div className="flex flex-col gap-4 border-b border-slate-200/80 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-[2rem] font-semibold leading-none tracking-tight text-foreground">
              Suas transacoes
            </h2>
            <p className="text-sm text-muted">
              Revise os registros e abra o drawer apenas quando precisar criar
              ou editar.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <p className="text-sm text-muted">
              {totalItems}{' '}
              {totalItems === 1
                ? 'transacao encontrada'
                : 'transacoes encontradas'}
            </p>
            <Button onClick={onRefresh} size="sm" type="button" variant="ghost">
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </div>

        <div className="px-6 pt-4">
          <FieldError message={listErrorMessage} />
        </div>

        {transactions.length === 0 ? (
          <div className="px-6 py-8">
            <EmptyState
              className="border-border/80 bg-card"
              description={
                hasActiveFilters
                  ? 'Tente limpar ou ajustar os filtros para encontrar outras movimentacoes.'
                  : 'Assim que voce criar o primeiro lancamento, ele aparecera aqui com categoria, tipo e valor.'
              }
              title={
                hasActiveFilters
                  ? 'Nenhuma transacao encontrada'
                  : 'Nenhuma transacao criada ainda'
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[880px] w-full">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/75">
                  {[
                    'Descricao',
                    'Tipo',
                    'Categoria',
                    'Data',
                    'Valor',
                    'Acoes',
                  ].map((column) => (
                    <th
                      className="px-6 py-3 text-left text-sm font-semibold text-slate-500"
                      key={column}
                      scope="col"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {transactions.map((transaction) => {
                  const isDeleting = deletingTransactionId === transaction.id;

                  return (
                    <tr
                      className="border-b border-slate-100 last:border-b-0"
                      key={transaction.id}
                    >
                      <td className="px-6 py-5">
                        <p className="text-base font-semibold text-foreground">
                          {transaction.description}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                            getTypeStyles(transaction.type),
                          )}
                        >
                          {transactionTypeLabel[transaction.type]}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {transaction.category.name}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {formatDate(transaction.date)}
                      </td>
                      <td
                        className={cn(
                          'px-6 py-5 text-sm font-semibold',
                          transaction.type === 'EXPENSE'
                            ? 'text-rose-500'
                            : 'text-emerald-600',
                        )}
                      >
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Button
                            aria-label={`Editar ${transaction.description}`}
                            onClick={() => onEdit(transaction)}
                            size="sm"
                            type="button"
                            variant="secondary"
                          >
                            <PencilLine className="size-4" />
                          </Button>
                          <Button
                            aria-label={`Excluir ${transaction.description}`}
                            disabled={isDeleting}
                            onClick={() => onDelete(transaction)}
                            size="sm"
                            type="button"
                            variant="ghost"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {paginationMeta && transactions.length > 0 ? (
          <div className="flex flex-col gap-4 border-t border-slate-200/80 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-sm text-muted">
              Pagina {paginationMeta.page} de {paginationMeta.totalPages}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Button
                  disabled={!paginationMeta.hasPreviousPage}
                  onClick={onPreviousPage}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Anterior
                </Button>
                <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary">
                  {paginationMeta.page}
                </div>
                <Button
                  disabled={!paginationMeta.hasNextPage}
                  onClick={onNextPage}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Proxima
                </Button>
              </div>

              <div className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-muted">
                {paginationMeta.perPage} por pagina
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
