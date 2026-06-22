import { cn } from '@/lib/utils';
import * as React from 'react';

const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-card text-foreground hover:bg-muted-surface',
  ghost: 'text-muted hover:bg-muted-surface hover:text-foreground',
} as const;

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-11 px-5',
} as const;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
