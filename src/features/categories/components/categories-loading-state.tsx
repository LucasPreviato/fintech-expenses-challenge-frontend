import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function CategoriesLoadingState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carregando categorias</CardTitle>
        <CardDescription>
          Buscando as categorias ja cadastradas para montar a lista.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
