import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { FieldError } from '@/components/ui/field-error';
import { CategoriesList } from '@/features/categories/components/categories-list';
import { CategoriesLoadingState } from '@/features/categories/components/categories-loading-state';
import { CategoriesRetryCard } from '@/features/categories/components/categories-retry-card';
import { CategoryForm } from '@/features/categories/components/category-form';
import { useCategoriesPage } from '@/features/categories/hooks/use-categories-page';
import { categorySuggestions } from '@/features/categories/lib/category-suggestions';

export function CategoriesPage() {
  const {
    form,
    categories,
    isEditing,
    isLoading,
    isSubmitting,
    deletingCategoryId,
    listErrorMessage,
    addedSuggestionNames,
    categoryPendingDelete,
    isConfirmingDelete,
    onSubmit,
    onSuggestionSelect,
    onEdit,
    onDelete,
    onCancelEdit,
    onCancelDelete,
    onConfirmDelete,
    refetch,
    hasQueryError,
  } = useCategoriesPage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Categorias</h1>
          <p className="text-sm text-muted">
            Crie, ajuste e mantenha categorias prontas para organizar suas
            movimentacoes.
          </p>
        </div>

        <Button onClick={onCancelEdit} type="button" variant="secondary">
          {isEditing ? 'Nova categoria' : 'Limpar formulario'}
        </Button>
      </div>

      <CategoryForm
        addedSuggestionNames={addedSuggestionNames}
        form={form}
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        onCancelEdit={onCancelEdit}
        onSubmit={onSubmit}
        onSuggestionSelect={onSuggestionSelect}
        suggestions={categorySuggestions}
      />

      {isLoading ? (
        <CategoriesLoadingState />
      ) : (
        <div className="space-y-4">
          <FieldError message={listErrorMessage} />
          <CategoriesList
            categories={categories}
            deletingCategoryId={deletingCategoryId}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      )}

      {hasQueryError ? (
        <CategoriesRetryCard onRetry={() => void refetch()} />
      ) : null}

      <ConfirmDialog
        cancelLabel="Voltar"
        confirmLabel="Excluir categoria"
        description={
          categoryPendingDelete
            ? `A categoria "${categoryPendingDelete.name}" sera removida permanentemente.`
            : ''
        }
        isLoading={isConfirmingDelete}
        onCancel={onCancelDelete}
        onConfirm={() => void onConfirmDelete()}
        open={Boolean(categoryPendingDelete)}
        title="Confirmar exclusao"
      />
    </div>
  );
}
