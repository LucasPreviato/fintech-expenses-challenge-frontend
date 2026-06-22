import {
  categoriesQueryKey,
  listCategories,
} from '@/features/categories/api/categories-api';
import {
  buildDashboardQueryKey,
  getDashboard,
} from '@/features/dashboard/api/dashboard-api';
import type { DashboardFilters } from '@/features/dashboard/types/dashboard';
import { getApiErrorMessage } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import {
  buildTransactionsQueryKey,
  listTransactions,
} from '../api/transactions-api';
import type { TransactionFilters } from '../types/transaction';

function getDashboardFilters(filters: TransactionFilters): DashboardFilters {
  return {
    startDate: filters.startDate,
    endDate: filters.endDate,
  };
}

export function useTransactionsQueries(appliedFilters: TransactionFilters) {
  const dashboardFilters = getDashboardFilters(appliedFilters);
  const categoriesQuery = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: listCategories,
  });
  const transactionsQuery = useQuery({
    queryKey: buildTransactionsQueryKey(appliedFilters),
    queryFn: () => listTransactions(appliedFilters),
  });
  const dashboardSummaryQuery = useQuery({
    queryKey: buildDashboardQueryKey(dashboardFilters),
    queryFn: () => getDashboard(dashboardFilters),
  });

  async function onRetry() {
    await Promise.all([
      transactionsQuery.refetch(),
      categoriesQuery.refetch(),
      dashboardSummaryQuery.refetch(),
    ]);
  }

  return {
    categories: categoriesQuery.data ?? [],
    transactions: transactionsQuery.data?.data ?? [],
    paginationMeta: transactionsQuery.data?.meta,
    transactionsTotal: transactionsQuery.data?.meta.total,
    summaryDashboard: dashboardSummaryQuery.data,
    listErrorMessage: transactionsQuery.isError
      ? getApiErrorMessage(
          transactionsQuery.error,
          'Não foi possível carregar as transações agora.',
        )
      : undefined,
    categoryLoadErrorMessage: categoriesQuery.isError
      ? getApiErrorMessage(
          categoriesQuery.error,
          'Não foi possível carregar as categorias agora.',
        )
      : undefined,
    summaryErrorMessage: dashboardSummaryQuery.isError
      ? getApiErrorMessage(
          dashboardSummaryQuery.error,
          'Não foi possível carregar os indicadores agora.',
        )
      : undefined,
    isLoading:
      (transactionsQuery.isLoading && !transactionsQuery.data) ||
      (categoriesQuery.isLoading && !categoriesQuery.data),
    isApplyingFilters: transactionsQuery.isFetching,
    isSummaryLoading:
      dashboardSummaryQuery.isLoading && !dashboardSummaryQuery.data,
    hasQueryError: transactionsQuery.isError || categoriesQuery.isError,
    isCategorySelectDisabled:
      categoriesQuery.isLoading ||
      categoriesQuery.isError ||
      (categoriesQuery.data?.length ?? 0) === 0,
    transactionsQuery,
    onRetry,
  };
}
