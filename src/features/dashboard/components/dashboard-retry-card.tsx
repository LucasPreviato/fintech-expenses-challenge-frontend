import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

interface DashboardRetryCardProps {
  message: string;
  onRetry: () => void;
}

export function DashboardRetryCard({
  message,
  onRetry,
}: DashboardRetryCardProps) {
  return (
    <EmptyState
      action={
        <Button onClick={onRetry} type="button">
          Tentar novamente
        </Button>
      }
      description={message}
      title="Não foi possivel carregar o dashboard"
    />
  );
}
