import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

const summaryCards = [
  { label: 'Saldo atual', value: 'R$ 0,00' },
  { label: 'Entradas', value: 'R$ 0,00' },
  { label: 'Saidas', value: 'R$ 0,00' },
] as const;

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted">
          Estrutura inicial pronta para receber os indicadores consolidados da
          API.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="pb-3">
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl">{card.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Top categorias de saida</CardTitle>
            <CardDescription>
              Este bloco vai consumir o resumo calculado pela API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              description="Assim que o backend expor o endpoint do dashboard, este painel pode mostrar as tres categorias com maior volume de saida."
              title="Sem dados ainda"
            />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
