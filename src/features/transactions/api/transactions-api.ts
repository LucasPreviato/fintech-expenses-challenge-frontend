import type { PaginatedResponse } from '@/features/categories/types/category';
import { apiClient } from '@/lib/api/client';
import type {
  CreateTransactionRequest,
  Transaction,
  TransactionFilters,
  UpdateTransactionRequest,
} from '../types/transaction';

export const transactionsQueryKey = ['transactions'] as const;

export function buildTransactionsQueryKey(filters: TransactionFilters) {
  return [...transactionsQueryKey, filters] as const;
}

export async function listTransactions(
  filters: TransactionFilters,
): Promise<PaginatedResponse<Transaction>> {
  const response = await apiClient.get<PaginatedResponse<Transaction>>(
    '/transactions',
    {
      params: {
        page: filters.page,
        perPage: filters.perPage,
        type: filters.type,
        categoryId: filters.categoryId,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    },
  );

  return response.data;
}

export async function createTransaction(
  payload: CreateTransactionRequest,
): Promise<Transaction> {
  const response = await apiClient.post<Transaction>('/transactions', payload);

  return response.data;
}

export async function updateTransaction(
  id: string,
  payload: UpdateTransactionRequest,
): Promise<Transaction> {
  const response = await apiClient.patch<Transaction>(
    `/transactions/${id}`,
    payload,
  );

  return response.data;
}

export async function deleteTransaction(id: string): Promise<Transaction> {
  const response = await apiClient.delete<Transaction>(`/transactions/${id}`);

  return response.data;
}
