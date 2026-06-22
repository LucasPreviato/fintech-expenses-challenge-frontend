import { DashboardFilters } from '@/features/dashboard/components/dashboard-filters';
import { DashboardLoadingState } from '@/features/dashboard/components/dashboard-loading-state';
import { DashboardRetryCard } from '@/features/dashboard/components/dashboard-retry-card';
import { DashboardSummaryCards } from '@/features/dashboard/components/dashboard-summary-cards';
import { DashboardTopExpenseCategories } from '@/features/dashboard/components/dashboard-top-expense-categories';
import { useDashboardPage } from '@/features/dashboard/hooks/use-dashboard-page';
import { formatPeriodLabel } from '@/features/dashboard/lib/dashboard-formatters';

export function DashboardPage() {
  const {
    form,
    dashboard,
    isLoading,
    isApplyingFilters,
    hasActiveFilters,
    errorMessage,
    onApplyFilters,
    onClearFilters,
    onRetry,
  } = useDashboardPage();

  const periodLabel = formatPeriodLabel(
    dashboard?.period.startDate,
    dashboard?.period.endDate,
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted">
          Acompanhe o saldo consolidado, compare entradas e saidas e veja onde
          estão concentradas as maiores despesas.
        </p>
      </div>

      <DashboardFilters
        form={form}
        hasActiveFilters={hasActiveFilters}
        isApplyingFilters={isApplyingFilters}
        periodLabel={periodLabel}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
      />

      {errorMessage ? (
        <DashboardRetryCard
          message={errorMessage}
          onRetry={() => void onRetry()}
        />
      ) : null}

      {isLoading ? (
        <DashboardLoadingState />
      ) : dashboard ? (
        <div className="space-y-6">
          <DashboardSummaryCards dashboard={dashboard} />
          <DashboardTopExpenseCategories
            categories={dashboard.topExpenseCategories}
          />
        </div>
      ) : null}
    </div>
  );
}
