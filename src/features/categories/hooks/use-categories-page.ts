import type {
  Category,
  CategorySuggestion,
} from '@/features/categories/types/category';
import { useToast } from '@/providers/toast-context';
import { useCallback } from 'react';
import { useCategoriesQueries } from './use-categories-queries';
import { useCategoryDelete } from './use-category-delete';
import { useCategoryFormState } from './use-category-form-state';
import { useCategorySubmit } from './use-category-submit';

export function useCategoriesPage() {
  const { showToast } = useToast();
  const queriesState = useCategoriesQueries();
  const formState = useCategoryFormState(queriesState.categories);
  const submitState = useCategorySubmit({
    form: formState.form,
    resetForm: formState.resetForm,
    closeDrawer: formState.closeDrawer,
    showToast,
  });
  const deleteState = useCategoryDelete({
    form: formState.form,
    resetForm: formState.resetForm,
    showToast,
  });

  const resetMutationFeedback = useCallback(() => {
    submitState.resetSubmitFeedback();
    deleteState.resetDeleteFeedback();
  }, [deleteState.resetDeleteFeedback, submitState.resetSubmitFeedback]);

  function onSuggestionSelect(suggestion: CategorySuggestion) {
    resetMutationFeedback();
    formState.applySuggestion(suggestion);
  }

  function onEdit(category: Category) {
    resetMutationFeedback();
    formState.populateForm(category);
  }

  function onDelete(category: Category) {
    resetMutationFeedback();
    deleteState.requestDelete(category);
  }

  function onCancelEdit() {
    resetMutationFeedback();
    formState.resetForm();
    formState.closeDrawer();
  }

  function onOpenCreateDrawer() {
    resetMutationFeedback();
    formState.resetForm();
    formState.openCreateDrawer();
  }

  function onCloseFormDrawer() {
    if (submitState.isSubmitting) {
      return;
    }

    onCancelEdit();
  }

  function onCancelDelete() {
    if (deleteState.isConfirmingDelete) {
      return;
    }

    deleteState.clearPendingDelete();
  }

  return {
    form: formState.form,
    categories: queriesState.categories,
    isEditing: formState.isEditing,
    isFormDrawerOpen: formState.isFormDrawerOpen,
    isLoading: queriesState.isLoading,
    isSubmitting: submitState.isSubmitting,
    deletingCategoryId: deleteState.deletingCategoryId,
    listErrorMessage: queriesState.listErrorMessage ?? deleteState.deleteError,
    addedSuggestionNames: formState.addedSuggestionNames,
    onSubmit: submitState.onSubmit,
    onSuggestionSelect,
    onEdit,
    onDelete,
    onCancelEdit,
    onOpenCreateDrawer,
    onCloseFormDrawer,
    categoryPendingDelete: deleteState.categoryPendingDelete,
    isConfirmingDelete: deleteState.isConfirmingDelete,
    onCancelDelete,
    onConfirmDelete: deleteState.confirmDelete,
    refetch: queriesState.refetch,
    hasQueryError: queriesState.hasQueryError,
  };
}
