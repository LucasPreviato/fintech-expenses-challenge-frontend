import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { type ReactNode, useEffect } from 'react';

interface DrawerProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}

export function Drawer({
  open,
  title,
  description,
  children,
  onClose,
}: DrawerProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        'fixed inset-0 z-50 transition-opacity duration-200',
        open ? 'pointer-events-auto' : 'pointer-events-none',
        open ? 'opacity-100' : 'opacity-0',
      )}
    >
      <button
        aria-label="Fechar painel"
        className={cn(
          'absolute inset-0 bg-slate-950/40 transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        type="button"
      />

      <dialog
        aria-describedby={description ? 'drawer-description' : undefined}
        aria-labelledby="drawer-title"
        className={cn(
          'pointer-events-auto fixed inset-y-0 right-0 left-auto m-0 ml-auto mr-0 flex h-full w-full max-w-xl flex-col border-l bg-card text-card-foreground shadow-2xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
        open
        style={{ marginInlineStart: 'auto', marginInlineEnd: 0 }}
      >
        <header className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div className="space-y-1">
            <h2
              className="text-xl font-semibold tracking-tight"
              id="drawer-title"
            >
              {title}
            </h2>
            {description ? (
              <p className="text-sm text-muted" id="drawer-description">
                {description}
              </p>
            ) : null}
          </div>

          <button
            aria-label="Fechar painel"
            className="rounded-full p-2 text-muted transition hover:bg-muted-surface hover:text-foreground"
            onClick={onClose}
            type="button"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>
      </dialog>
    </div>
  );
}
