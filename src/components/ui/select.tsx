import { cn } from '@/lib/utils';
import * as React from 'react';

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      className={cn(
        'flex h-10 w-full rounded-md border bg-card px-3 py-2 pr-9 text-sm text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

Select.displayName = 'Select';
