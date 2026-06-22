import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface TransactionsRetryCardProps {
  onRetry: () => void;
}

export function TransactionsRetryCard({ onRetry }: TransactionsRetryCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <Button onClick={onRetry} type="button">
          Tentar novamente
        </Button>
      </CardContent>
    </Card>
  );
}
