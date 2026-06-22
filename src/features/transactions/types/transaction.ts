import type { PaginationMeta } from '@/features/categories/types/category';

export const transactionTypeValues = ['INCOME', 'EXPENSE'] as const;

export type TransactionType = (typeof transactionTypeValues)[number];

export const transactionTypeLabel: Record<TransactionType, string> = {
  INCOME: 'Entrada',
  EXPENSE: 'Saída',
};

export interface TransactionCategorySummary {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: string;
  date: string;
  type: TransactionType;
  category: TransactionCategorySummary;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFilters {
  page: number;
  perPage: number;
  type?: TransactionType;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateTransactionRequest {
  description: string;
  amount: string;
  date: string;
  type: TransactionType;
  categoryId: string;
}

export interface UpdateTransactionRequest {
  description?: string;
  amount?: string;
  date?: string;
  type?: TransactionType;
  categoryId?: string;
}

export interface TransactionsResponse {
  data: Transaction[];
  meta: PaginationMeta;
}
