import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '../lib/dashboard-formatters';
import type { DashboardData } from '../types/dashboard';

interface DashboardSummaryCardsProps {
  dashboard: DashboardData;
}

const summaryCardConfig = [
  {
    label: 'Saldo atual',
    field: 'balance',
  },
  {
    label: 'Entradas',
    field: 'totalIncome',
  },
  {
    label: 'Saidas',
    field: 'totalExpense',
  },
] as const;

export function DashboardSummaryCards({
  dashboard,
}: DashboardSummaryCardsProps) {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {summaryCardConfig.map((card) => (
        <Card key={card.label}>
          <CardHeader className="pb-3">
            <CardDescription>{card.label}</CardDescription>
            <CardTitle className="text-2xl">
              {formatCurrency(dashboard[card.field])}
            </CardTitle>
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}
