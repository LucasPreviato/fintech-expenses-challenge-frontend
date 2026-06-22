import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-dashed bg-card p-6 text-card-foreground',
        className,
      )}
    >
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm leading-6 text-muted">{description}</p>
      </div>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
