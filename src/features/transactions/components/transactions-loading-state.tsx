import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function TransactionsLoadingState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carregando transacoes</CardTitle>
        <CardDescription>
          Buscando suas transacoes e categorias para montar a pagina.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
