import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Drawer } from '@/components/ui/drawer';
import { FieldError } from '@/components/ui/field-error';
import { CategoriesList } from '@/features/categories/components/categories-list';
import { CategoriesLoadingState } from '@/features/categories/components/categories-loading-state';
import { CategoriesRetryCard } from '@/features/categories/components/categories-retry-card';
import { CategoryForm } from '@/features/categories/components/category-form';
import { useCategoriesPage } from '@/features/categories/hooks/use-categories-page';
import { categorySuggestions } from '@/features/categories/lib/category-suggestions';
import { CirclePlus } from 'lucide-react';

export function CategoriesPage() {
  const {
    form,
    categories,
    isEditing,
    isFormDrawerOpen,
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
    onOpenCreateDrawer,
    onCloseFormDrawer,
    onCancelDelete,
    onConfirmDelete,
    refetch,
    hasQueryError,
  } = useCategoriesPage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-[2.5rem] font-semibold tracking-tight text-foreground">
            Categorias
          </h1>
          <p className="text-base text-muted">
            Faça gestão de suas categorias e organizar suas
            movimentacoes.
          </p>
        </div>

        <Button onClick={onOpenCreateDrawer} type="button">
          <CirclePlus className="size-4" />
          Nova categoria
        </Button>
      </div>

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

      <Drawer
        description={
          isEditing
            ? 'Atualize uma categoria existente sem sair da listagem atual.'
            : 'Escolha uma sugestão pronta ou descreva uma categoria personalizada.'
        }
        onClose={onCloseFormDrawer}
        open={isFormDrawerOpen}
        title={isEditing ? 'Editar categoria' : 'Nova categoria'}
      >
        <CategoryForm
          addedSuggestionNames={addedSuggestionNames}
          form={form}
          isEditing={isEditing}
          isSubmitting={isSubmitting}
          onCancelEdit={onCancelEdit}
          onClose={onCloseFormDrawer}
          onSubmit={onSubmit}
          onSuggestionSelect={onSuggestionSelect}
          suggestions={categorySuggestions}
        />
      </Drawer>

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
        title="Confirmar exclusão"
      />
    </div>
  );
}
