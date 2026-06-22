import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  ToastContext,
  type ToastContextValue,
  type ToastInput,
  type ToastItem,
  type ToastType,
} from '@/providers/toast-context';
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const DEFAULT_TOAST_DURATION_MS = 4_500;

function getToastIcon(type: ToastType) {
  if (type === 'success') {
    return CheckCircle2;
  }

  if (type === 'error') {
    return TriangleAlert;
  }

  return Info;
}

function getToastStyles(type: ToastType) {
  if (type === 'success') {
    return 'border-primary/30 bg-card text-foreground';
  }

  if (type === 'error') {
    return 'border-danger/30 bg-card text-foreground';
  }

  return 'border-accent/25 bg-card text-foreground';
}

function getIconStyles(type: ToastType) {
  if (type === 'success') {
    return 'text-primary';
  }

  if (type === 'error') {
    return 'text-danger';
  }

  return 'text-accent';
}

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== toastId));
  }, []);

  const showToast = useCallback((toast: ToastInput) => {
    const nextToast: ToastItem = {
      ...toast,
      id: `toast-${idRef.current++}`,
    };

    setToasts((current) => [...current, nextToast]);
  }, []);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <ToastCard
            key={toast.id}
            onDismiss={() => dismissToast(toast.id)}
            toast={toast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: () => void;
}

function ToastCard({ toast, onDismiss }: ToastCardProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(
      onDismiss,
      toast.durationMs ?? DEFAULT_TOAST_DURATION_MS,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onDismiss, toast.durationMs]);

  const Icon = getToastIcon(toast.type);

  return (
    <output
      className={cn(
        'pointer-events-auto rounded-lg border p-4 shadow-lg shadow-slate-900/10',
        getToastStyles(toast.type),
      )}
    >
      <div className="flex items-start gap-3">
        <Icon
          className={cn('mt-0.5 h-5 w-5 shrink-0', getIconStyles(toast.type))}
        />

        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.message ? (
            <p className="text-sm leading-5 text-muted">{toast.message}</p>
          ) : null}
        </div>

        <Button
          aria-label="Fechar notificacao"
          className="h-8 w-8 shrink-0 p-0"
          onClick={onDismiss}
          size="sm"
          type="button"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </output>
  );
}
