import { cn } from '@/lib/utils';
import * as React from 'react';

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded-md border bg-card px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    />
  );
});

Input.displayName = 'Input';
