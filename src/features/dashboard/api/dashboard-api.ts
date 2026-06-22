import { apiClient } from '@/lib/api/client';
import type { DashboardData, DashboardFilters } from '../types/dashboard';

export const dashboardQueryKey = ['dashboard'] as const;

export function buildDashboardQueryKey(filters: DashboardFilters) {
  return [...dashboardQueryKey, filters] as const;
}

export async function getDashboard(
  filters: DashboardFilters,
): Promise<DashboardData> {
  const response = await apiClient.get<DashboardData>('/dashboard', {
    params: {
      startDate: filters.startDate,
      endDate: filters.endDate,
    },
  });

  return response.data;
}
