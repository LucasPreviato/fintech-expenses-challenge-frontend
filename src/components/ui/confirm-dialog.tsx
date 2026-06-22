import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancelar',
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/45 px-4">
      <button
        aria-label="Fechar confirmacao"
        className="absolute inset-0"
        disabled={isLoading}
        onClick={onCancel}
        type="button"
      />

      <dialog
        aria-describedby="confirm-dialog-description"
        aria-labelledby="confirm-dialog-title"
        className="relative z-10 w-full max-w-md shadow-xl shadow-slate-900/15"
        open
      >
        <Card>
          <CardHeader className="space-y-2">
            <CardTitle id="confirm-dialog-title">{title}</CardTitle>
            <p
              className="text-sm leading-6 text-muted"
              id="confirm-dialog-description"
            >
              {description}
            </p>
          </CardHeader>

          <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              disabled={isLoading}
              onClick={onCancel}
              type="button"
              variant="secondary"
            >
              {cancelLabel}
            </Button>
            <Button disabled={isLoading} onClick={onConfirm} type="button">
              {isLoading ? 'Confirmando...' : confirmLabel}
            </Button>
          </CardContent>
        </Card>
      </dialog>
    </div>
  );
}
