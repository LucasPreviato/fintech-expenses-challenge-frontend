import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { FieldError } from '@/components/ui/field-error';
import type { PaginationMeta } from '@/features/categories/types/category';
import {
  type Transaction,
  transactionTypeLabel,
} from '@/features/transactions/types/transaction';

interface TransactionsListProps {
  transactions: Transaction[];
  paginationMeta?: PaginationMeta;
  deletingTransactionId?: string;
  feedbackMessage?: string;
  listErrorMessage?: string;
  hasActiveFilters: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

function formatCurrency(amount: string) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(amount));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function getTypeStyles(type: Transaction['type']) {
  if (type === 'INCOME') {
    return 'bg-primary/10 text-primary';
  }

  return 'bg-danger/10 text-danger';
}

export function TransactionsList({
  transactions,
  paginationMeta,
  deletingTransactionId,
  feedbackMessage,
  listErrorMessage,
  hasActiveFilters,
  onEdit,
  onDelete,
  onPreviousPage,
  onNextPage,
}: TransactionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suas transacoes</CardTitle>
        <CardDescription>
          Acompanhe seus lancamentos, revise os dados e ajuste o que for
          necessario.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <FieldError message={listErrorMessage} />
        {feedbackMessage ? (
          <p className="text-sm text-primary">{feedbackMessage}</p>
        ) : null}

        {transactions.length === 0 ? (
          <EmptyState
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
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const isDeleting = deletingTransactionId === transaction.id;

              return (
                <div
                  className="flex flex-col gap-4 rounded-lg border p-4"
                  key={transaction.id}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-foreground">
                          {transaction.description}
                        </h2>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${getTypeStyles(transaction.type)}`}
                        >
                          {transactionTypeLabel[transaction.type]}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                        <span>Categoria: {transaction.category.name}</span>
                        <span>Data: {formatDate(transaction.date)}</span>
                        <span>Valor: {formatCurrency(transaction.amount)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => onEdit(transaction)}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        Editar
                      </Button>
                      <Button
                        disabled={isDeleting}
                        onClick={() => onDelete(transaction)}
                        size="sm"
                        type="button"
                        variant="ghost"
                      >
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {paginationMeta && transactions.length > 0 ? (
          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              Pagina {paginationMeta.page} de {paginationMeta.totalPages} ·{' '}
              {paginationMeta.total} transacoes
            </p>

            <div className="flex gap-2">
              <Button
                disabled={!paginationMeta.hasPreviousPage}
                onClick={onPreviousPage}
                type="button"
                variant="secondary"
              >
                Anterior
              </Button>
              <Button
                disabled={!paginationMeta.hasNextPage}
                onClick={onNextPage}
                type="button"
                variant="secondary"
              >
                Proxima
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
