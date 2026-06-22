import { ChartColumn, FolderKanban, ReceiptText } from 'lucide-react';

export const navigationItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: ChartColumn,
  },
  {
    label: 'Transacoes',
    to: '/transactions',
    icon: ReceiptText,
  },
  {
    label: 'Categorias',
    to: '/categories',
    icon: FolderKanban,
  },
] as const;
