import { createContext, useContext } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastInput {
  type: ToastType;
  title: string;
  message?: string;
  durationMs?: number;
}

export interface ToastItem extends ToastInput {
  id: string;
}

export interface ToastContextValue {
  showToast: (toast: ToastInput) => void;
  dismissToast: (toastId: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.');
  }

  return context;
}
