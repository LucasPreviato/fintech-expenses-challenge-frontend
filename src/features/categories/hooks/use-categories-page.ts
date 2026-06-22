import {
  createCategory,
  categoriesQueryKey,
  deleteCategory,
  listCategories,
  updateCategory,
} from '@/features/categories/api/categories-api';
import {
  categoryFormSchema,
  emptyCategoryFormValues,
  type CategoryFormValues,
} from '@/features/categories/lib/category-schemas';
import type {
  Category,
  CategorySuggestion,
} from '@/features/categories/types/category';
import { getApiErrorMessage } from '@/lib/api/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

export function useCategoriesPage() {
  const queryClient = useQueryClient();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: emptyCategoryFormValues,
  });

  const categoriesQuery = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: listCategories,
  });
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
  });
  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: string;
      values: { name: string; description: string | null };
    }) => updateCategory(id, values),
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: (category: Category) => deleteCategory(category.id),
  });

  const isEditing = Boolean(form.watch('categoryId'));
  const categories = categoriesQuery.data ?? [];
  const addedSuggestionNames = useMemo(
    () =>
      new Set(
        categories.map((category) =>
          category.name.trim().toLocaleLowerCase('pt-BR'),
        ),
      ),
    [categories],
  );

  const feedbackMessage =
    updateCategoryMutation.isSuccess
      ? 'Categoria atualizada com sucesso.'
      : createCategoryMutation.isSuccess
        ? 'Categoria criada com sucesso.'
        : deleteCategoryMutation.isSuccess
          ? 'Categoria excluida com sucesso.'
          : undefined;

  const listErrorMessage = categoriesQuery.isError
    ? getApiErrorMessage(
        categoriesQuery.error,
        'Nao foi possivel carregar as categorias agora.',
      )
    : deleteCategoryMutation.isError
      ? getApiErrorMessage(
          deleteCategoryMutation.error,
          'Nao foi possivel excluir a categoria agora.',
        )
      : undefined;

  function resetMutationFeedback() {
    createCategoryMutation.reset();
    updateCategoryMutation.reset();
    deleteCategoryMutation.reset();
  }

  function resetForm() {
    form.clearErrors();
    form.reset(emptyCategoryFormValues);
  }

  async function refreshCategories() {
    await queryClient.invalidateQueries({
      queryKey: categoriesQueryKey,
    });
  }

  const onSubmit = form.handleSubmit(async (values) => {
    resetMutationFeedback();
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

      resetForm();
      await refreshCategories();
    } catch (error) {
      form.setError('root', {
        message: getApiErrorMessage(
          error,
          values.categoryId
            ? 'Nao foi possivel atualizar a categoria agora.'
            : 'Nao foi possivel criar a categoria agora.',
        ),
      });
    }
  });

  function handleSuggestionSelect(suggestion: CategorySuggestion) {
    resetMutationFeedback();
    form.clearErrors();
    form.setValue('name', suggestion.name, {
      shouldDirty: true,
      shouldValidate: true,
    });
    form.setValue('description', suggestion.description, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleEdit(category: Category) {
    resetMutationFeedback();
    form.clearErrors();
    form.reset({
      categoryId: category.id,
      name: category.name,
      description: category.description ?? '',
    });
  }

  async function handleDelete(category: Category) {
    resetMutationFeedback();
    form.clearErrors('root');

    try {
      await deleteCategoryMutation.mutateAsync(category);

      if (form.getValues('categoryId') === category.id) {
        resetForm();
      }

      await refreshCategories();
    } catch {
      // Error feedback is rendered from the mutation state.
    }
  }

  function handleCancelEdit() {
    resetMutationFeedback();
    resetForm();
  }

  return {
    form,
    categories,
    isEditing,
    isLoading: categoriesQuery.isLoading,
    isSubmitting:
      createCategoryMutation.isPending || updateCategoryMutation.isPending,
    deletingCategoryId: deleteCategoryMutation.variables?.id,
    feedbackMessage,
    listErrorMessage,
    addedSuggestionNames,
    showFormSuccess:
      createCategoryMutation.isSuccess || updateCategoryMutation.isSuccess,
    showDeleteSuccess: deleteCategoryMutation.isSuccess,
    onSubmit,
    onSuggestionSelect: handleSuggestionSelect,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onCancelEdit: handleCancelEdit,
    refetch: categoriesQuery.refetch,
    hasQueryError: categoriesQuery.isError,
  };
}
