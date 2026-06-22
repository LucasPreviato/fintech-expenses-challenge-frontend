import {
  categoriesQueryKey,
  deleteCategory,
} from '@/features/categories/api/categories-api';
import type { CategoryFormValues } from '@/features/categories/lib/category-schemas';
import type { Category } from '@/features/categories/types/category';
import { getApiErrorMessage } from '@/lib/api/client';
import type { ToastContextValue } from '@/providers/toast-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

interface UseCategoryDeleteParams {
  form: UseFormReturn<CategoryFormValues>;
  resetForm: () => void;
  showToast: ToastContextValue['showToast'];
}

export function useCategoryDelete({
  form,
  resetForm,
  showToast,
}: UseCategoryDeleteParams) {
  const queryClient = useQueryClient();
  const [categoryPendingDelete, setCategoryPendingDelete] =
    useState<Category | null>(null);
  const deleteCategoryMutation = useMutation({
    mutationFn: (category: Category) => deleteCategory(category.id),
  });

  function resetDeleteFeedback() {
    deleteCategoryMutation.reset();
  }

  async function refreshCategories() {
    await queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
  }

  async function confirmDelete() {
    if (!categoryPendingDelete) {
      return;
    }

    resetDeleteFeedback();
    form.clearErrors('root');

    try {
      await deleteCategoryMutation.mutateAsync(categoryPendingDelete);

      if (form.getValues('categoryId') === categoryPendingDelete.id) {
        resetForm();
      }

      await refreshCategories();
      showToast({
        type: 'success',
        title: 'Categoria excluida',
        message: `"${categoryPendingDelete.name}" foi removida com sucesso.`,
      });
      setCategoryPendingDelete(null);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Falha ao excluir categoria',
        message: getApiErrorMessage(
          error,
          'Não foi possivel excluir a categoria agora.',
        ),
      });
    }
  }

  return {
    categoryPendingDelete,
    deletingCategoryId: deleteCategoryMutation.variables?.id,
    isConfirmingDelete: deleteCategoryMutation.isPending,
    deleteError: deleteCategoryMutation.isError
      ? getApiErrorMessage(
          deleteCategoryMutation.error,
          'Não foi possivel excluir a categoria agora.',
        )
      : undefined,
    requestDelete: (category: Category) => setCategoryPendingDelete(category),
    clearPendingDelete: () => setCategoryPendingDelete(null),
    confirmDelete,
    resetDeleteFeedback,
  };
}
