import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Transacoes</h1>
          <p className="text-sm text-muted">
            Esta area vai receber listagem, filtros, formulario e paginacao.
          </p>
        </div>

        <Button disabled>Novo lancamento</Button>
      </div>

      <EmptyState
        description="O frontend ja reserva a rota e o layout. Quando a API estiver pronta, entram filtros por tipo, categoria e periodo."
        title="Modulo em preparacao"
      />
    </div>
  );
}
