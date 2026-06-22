import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

interface TransactionsRetryCardProps {
  message?: string;
  onRetry: () => void;
}

export function TransactionsRetryCard({
  message,
  onRetry,
}: TransactionsRetryCardProps) {
  return (
    <EmptyState
      action={
        <Button onClick={onRetry} type="button">
          Tentar novamente
        </Button>
      }
      description={
        message ?? 'Atualize os dados para tentar carregar a página novamente.'
      }
      title="Não foi possível carregar as transações"
    />
  );
}
