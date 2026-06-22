import { Button } from '@/components/ui/button';
import { FieldError } from '@/components/ui/field-error';
import { CategoriesList } from '@/features/categories/components/categories-list';
import { CategoriesLoadingState } from '@/features/categories/components/categories-loading-state';
import { CategoryForm } from '@/features/categories/components/category-form';
import { CategoriesRetryCard } from '@/features/categories/components/categories-retry-card';
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
    feedbackMessage,
    listErrorMessage,
    addedSuggestionNames,
    showFormSuccess,
    showDeleteSuccess,
    onSubmit,
    onSuggestionSelect,
    onEdit,
    onDelete,
    onCancelEdit,
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
        successMessage={showFormSuccess ? feedbackMessage : undefined}
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
            feedbackMessage={showDeleteSuccess ? feedbackMessage : undefined}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      )}

      {hasQueryError ? (
        <CategoriesRetryCard onRetry={() => void refetch()} />
      ) : null}
    </div>
  );
}
