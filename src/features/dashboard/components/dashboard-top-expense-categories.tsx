import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { formatCurrency } from '../lib/dashboard-formatters';
import type { DashboardTopExpenseCategory } from '../types/dashboard';

interface DashboardTopExpenseCategoriesProps {
  categories: DashboardTopExpenseCategory[];
}

export function DashboardTopExpenseCategories({
  categories,
}: DashboardTopExpenseCategoriesProps) {
  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>Top categorias de saida</CardTitle>
          <CardDescription>
            As tres categorias com maior volume de despesas no período
            selecionado.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {categories.length === 0 ? (
            <EmptyState
              description="Assim que houver saidas registradas no período, o ranking aparece aqui."
              title="Sem categorias para exibir"
            />
          ) : (
            <ol className="space-y-3">
              {categories.map((category, index) => (
                <li
                  className="flex items-center justify-between gap-4 rounded-lg border bg-slate-50 px-4 py-3"
                  key={category.categoryId}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      #{index + 1}
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {category.categoryName}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(category.totalAmount)}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
