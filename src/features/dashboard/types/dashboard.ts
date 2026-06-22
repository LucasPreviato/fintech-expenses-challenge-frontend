export interface DashboardPeriod {
  startDate: string | null;
  endDate: string | null;
}

export interface DashboardTopExpenseCategory {
  categoryId: string;
  categoryName: string;
  totalAmount: string;
}

export interface DashboardData {
  balance: string;
  totalIncome: string;
  totalExpense: string;
  topExpenseCategories: DashboardTopExpenseCategory[];
  period: DashboardPeriod;
}

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
}
