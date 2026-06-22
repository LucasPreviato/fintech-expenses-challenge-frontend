import {
  categoriesQueryKey,
  createCategory,
  updateCategory,
} from '@/features/categories/api/categories-api';
import type { CategoryFormValues } from '@/features/categories/lib/category-schemas';
import { getApiErrorMessage } from '@/lib/api/client';
import type { ToastContextValue } from '@/providers/toast-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';

interface UseCategorySubmitParams {
  form: UseFormReturn<CategoryFormValues>;
  resetForm: () => void;
  closeDrawer: () => void;
  showToast: ToastContextValue['showToast'];
}

export function useCategorySubmit({
  form,
  resetForm,
  closeDrawer,
  showToast,
}: UseCategorySubmitParams) {
  const queryClient = useQueryClient();
  const createCategoryMutation = useMutation({ mutationFn: createCategory });
  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: { name: string; description: string | null };
    }) => updateCategory(id, values),
  });

  function resetSubmitFeedback() {
    createCategoryMutation.reset();
    updateCategoryMutation.reset();
  }

  async function refreshCategories() {
    await queryClient.invalidateQueries({ queryKey: categoriesQueryKey });
  }

  const onSubmit = form.handleSubmit(async (values) => {
    resetSubmitFeedback();
    form.clearErrors('root');

    const payload = {
      name: values.name,
      description: values.description.length > 0 ? values.description : null,
    };

    try {
      if (values.categoryId) {
        await updateCategoryMutation.mutateAsync({
          id: values.categoryId,
          values: payload,
        });
      } else {
        await createCategoryMutation.mutateAsync(payload);
      }

      showToast({
        type: 'success',
        title: values.categoryId ? 'Categoria atualizada' : 'Categoria criada',
        message: values.categoryId
          ? 'As alteracoes foram salvas com sucesso.'
          : 'A nova categoria ja esta disponivel para uso.',
      });

      resetForm();
      closeDrawer();
      await refreshCategories();
    } catch (error) {
      const isEditing = Boolean(values.categoryId);
      const message = getApiErrorMessage(
        error,
        isEditing
          ? 'Não foi possivel atualizar a categoria agora.'
          : 'Não foi possivel criar a categoria agora.',
      );

      showToast({
        type: 'error',
        title: isEditing ? 'Falha ao atualizar categoria' : 'Falha ao criar categoria',
        message,
      });
      form.setError('root', { message });
    }
  });

  return {
    onSubmit,
    isSubmitting:
      createCategoryMutation.isPending || updateCategoryMutation.isPending,
    resetSubmitFeedback,
  };
}
