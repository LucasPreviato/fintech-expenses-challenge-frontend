import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { Category } from '@/features/categories/types/category';

interface CategoriesListProps {
  categories: Category[];
  deletingCategoryId?: string;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoriesList({
  categories,
  deletingCategoryId,
  onEdit,
  onDelete,
}: CategoriesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suas categorias</CardTitle>
        <CardDescription>
          Organize as movimentacoes por contextos que facam sentido para voce.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {categories.length === 0 ? (
          <EmptyState
            description="Comece por uma sugestao rapida ou crie uma categoria totalmente personalizada."
            title="Nenhuma categoria criada ainda"
          />
        ) : (
          <div className="space-y-3">
            {categories.map((category) => {
              const isDeleting = deletingCategoryId === category.id;

              return (
                <div
                  className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between"
                  key={category.id}
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-foreground">
                      {category.name}
                    </h2>
                    <p className="text-sm leading-6 text-muted">
                      {category.description || 'Sem descricao informada.'}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => onEdit(category)}
                      size="sm"
                      type="button"
                      variant="secondary"
                    >
                      Editar
                    </Button>
                    <Button
                      disabled={isDeleting}
                      onClick={() => onDelete(category)}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
