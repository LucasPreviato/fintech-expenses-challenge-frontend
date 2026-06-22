import { cn } from '@/lib/utils';
import type * as React from 'react';

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    /* biome-ignore lint/a11y/noLabelWithoutControl: this wrapper forwards htmlFor and children to concrete form labels at usage sites */
    <label
      className={cn('text-sm font-medium text-foreground', className)}
      {...props}
    />
  );
}
