import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';

export function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Categorias</h1>
          <p className="text-sm text-muted">
            Area reservada para CRUD de categorias do usuario autenticado.
          </p>
        </div>

        <Button disabled>Nova categoria</Button>
      </div>

      <EmptyState
        description="A pagina ja esta pronta para evoluir com formulario, listagem e acoes assim que o modulo existir na API."
        title="Sem categorias conectadas"
      />
    </div>
  );
}
