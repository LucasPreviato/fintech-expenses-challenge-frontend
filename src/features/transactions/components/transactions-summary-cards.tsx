import { formatCurrency } from '@/features/dashboard/lib/dashboard-formatters';
import type { DashboardData } from '@/features/dashboard/types/dashboard';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, WalletCards } from 'lucide-react';

interface TransactionsSummaryCardsProps {
  dashboard?: DashboardData;
  isLoading: boolean;
}

const summaryCards = [
  {
    key: 'totalIncome',
    label: 'Entradas',
    helper: 'Resumo do periodo',
    icon: ArrowDown,
    iconClassName: 'bg-emerald-50 text-emerald-600',
    amountClassName: 'text-emerald-600',
  },
  {
    key: 'totalExpense',
    label: 'Saidas',
    helper: 'Resumo do periodo',
    icon: ArrowUp,
    iconClassName: 'bg-rose-50 text-rose-500',
    amountClassName: 'text-rose-500',
  },
  {
    key: 'balance',
    label: 'Saldo',
    helper: 'Total liquido',
    icon: WalletCards,
    iconClassName: 'bg-cyan-50 text-cyan-700',
    amountClassName: 'text-primary',
  },
] as const;

export function TransactionsSummaryCards({
  dashboard,
  isLoading,
}: TransactionsSummaryCardsProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-3">
      {summaryCards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            className="rounded-3xl border border-white/80 bg-card px-5 py-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.22)]"
            key={card.key}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  'flex size-14 shrink-0 items-center justify-center rounded-full',
                  card.iconClassName,
                )}
              >
                <Icon className="size-6" strokeWidth={1.8} />
              </div>

              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold text-muted">{card.label}</p>
                {isLoading || !dashboard ? (
                  <>
                    <div className="h-8 w-36 animate-pulse rounded-md bg-muted-surface" />
                    <div className="h-4 w-24 animate-pulse rounded-md bg-muted-surface" />
                  </>
                ) : (
                  <>
                    <p
                      className={cn(
                        'text-[2rem] font-semibold leading-none',
                        card.amountClassName,
                      )}
                    >
                      {formatCurrency(dashboard[card.key])}
                    </p>
                    <p className="text-sm text-muted">{card.helper}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
