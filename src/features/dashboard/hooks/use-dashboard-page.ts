import { getApiErrorMessage } from '@/lib/api/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { buildDashboardQueryKey, getDashboard } from '../api/dashboard-api';
import {
  type DashboardFiltersFormValues,
  dashboardFiltersSchema,
  emptyDashboardFiltersFormValues,
} from '../lib/dashboard-schemas';
import type { DashboardFilters } from '../types/dashboard';

function createDefaultFilters(): DashboardFilters {
  return {};
}

function hasActiveFilters(filters: DashboardFilters): boolean {
  return Boolean(filters.startDate || filters.endDate);
}

export function useDashboardPage() {
  const [appliedFilters, setAppliedFilters] = useState<DashboardFilters>(
    createDefaultFilters(),
  );

  const form = useForm<DashboardFiltersFormValues>({
    resolver: zodResolver(dashboardFiltersSchema),
    defaultValues: emptyDashboardFiltersFormValues,
  });

  const dashboardQuery = useQuery({
    queryKey: buildDashboardQueryKey(appliedFilters),
    queryFn: () => getDashboard(appliedFilters),
  });

  const errorMessage = dashboardQuery.isError
    ? getApiErrorMessage(
        dashboardQuery.error,
        'Nao foi possivel carregar os indicadores do dashboard agora.',
      )
    : undefined;

  const onApplyFilters = form.handleSubmit((values) => {
    setAppliedFilters({
      startDate: values.startDate || undefined,
      endDate: values.endDate || undefined,
    });
  });

  function onClearFilters() {
    form.clearErrors();
    form.reset(emptyDashboardFiltersFormValues);
    setAppliedFilters(createDefaultFilters());
  }

  return {
    form,
    dashboard: dashboardQuery.data,
    isLoading: dashboardQuery.isLoading && !dashboardQuery.data,
    isApplyingFilters: dashboardQuery.isFetching,
    hasActiveFilters: hasActiveFilters(appliedFilters),
    errorMessage,
    onApplyFilters,
    onClearFilters,
    onRetry: dashboardQuery.refetch,
  };
}
