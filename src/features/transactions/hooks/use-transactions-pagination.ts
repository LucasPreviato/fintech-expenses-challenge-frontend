import type { PaginationMeta } from '@/features/categories/types/category';
import type { Dispatch, SetStateAction } from 'react';
import type { TransactionFilters } from '../types/transaction';

interface UseTransactionsPaginationParams {
  paginationMeta?: PaginationMeta;
  setAppliedFilters: Dispatch<SetStateAction<TransactionFilters>>;
}

export function useTransactionsPagination({
  paginationMeta,
  setAppliedFilters,
}: UseTransactionsPaginationParams) {
  function onPreviousPage() {
    if (!paginationMeta?.hasPreviousPage) {
      return;
    }

    setAppliedFilters((current) => ({ ...current, page: current.page - 1 }));
  }

  function onNextPage() {
    if (!paginationMeta?.hasNextPage) {
      return;
    }

    setAppliedFilters((current) => ({ ...current, page: current.page + 1 }));
  }

  return {
    onPreviousPage,
    onNextPage,
  };
}
