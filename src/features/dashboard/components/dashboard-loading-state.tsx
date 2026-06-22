import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function DashboardLoadingState() {
  const summaryCardPlaceholders = ['balance', 'income', 'expense'] as const;
  const categoryPlaceholders = ['first', 'second', 'third'] as const;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        {summaryCardPlaceholders.map((placeholder) => (
          <Card key={placeholder}>
            <CardHeader className="pb-3">
              <CardDescription>Carregando indicador...</CardDescription>
              <CardTitle className="text-2xl">R$ 0,00</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Top categorias de saida</CardTitle>
          <CardDescription>
            Buscando o resumo consolidado da API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categoryPlaceholders.map((placeholder) => (
              <div
                className="rounded-lg border bg-slate-50 px-4 py-4"
                key={placeholder}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
