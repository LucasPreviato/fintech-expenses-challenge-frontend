import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CategoriesRetryCardProps {
  onRetry: () => void;
}

export function CategoriesRetryCard({
  onRetry,
}: CategoriesRetryCardProps) {
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
