import {
  categoriesQueryKey,
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '@/features/categories/api/categories-api';
import {
  type CategoryFormValues,
  categoryFormSchema,
  emptyCategoryFormValues,
} from '@/features/categories/lib/category-schemas';
import type {
  Category,
  CategorySuggestion,
} from '@/features/categories/types/category';
import { getApiErrorMessage } from '@/lib/api/client';
import { useToast } from '@/providers/toast-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

export function useCategoriesPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [categoryPendingDelete, setCategoryPendingDelete] =
    useState<Category | null>(null);
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
        showToast({
          type: 'success',
          title: 'Categoria atualizada',
          message: 'As alteracoes foram salvas com sucesso.',
        });
      } else {
        await createCategoryMutation.mutateAsync(payload);
        showToast({
          type: 'success',
          title: 'Categoria criada',
          message: 'A nova categoria ja esta disponivel para uso.',
        });
      }

      resetForm();
      await refreshCategories();
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        values.categoryId
          ? 'Nao foi possivel atualizar a categoria agora.'
          : 'Nao foi possivel criar a categoria agora.',
      );

      showToast({
        type: 'error',
        title: values.categoryId
          ? 'Falha ao atualizar categoria'
          : 'Falha ao criar categoria',
        message,
      });

      form.setError('root', {
        message,
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

  function handleRequestDelete(category: Category) {
    resetMutationFeedback();
    setCategoryPendingDelete(category);
  }

  function handleCancelDelete() {
    if (deleteCategoryMutation.isPending) {
      return;
    }

    setCategoryPendingDelete(null);
  }

  async function handleConfirmDelete() {
    const category = categoryPendingDelete;

    if (!category) {
      return;
    }

    resetMutationFeedback();
    form.clearErrors('root');

    try {
      await deleteCategoryMutation.mutateAsync(category);

      if (form.getValues('categoryId') === category.id) {
        resetForm();
      }

      await refreshCategories();
      showToast({
        type: 'success',
        title: 'Categoria excluida',
        message: `"${category.name}" foi removida com sucesso.`,
      });
      setCategoryPendingDelete(null);
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Falha ao excluir categoria',
        message: getApiErrorMessage(
          error,
          'Nao foi possivel excluir a categoria agora.',
        ),
      });
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
    listErrorMessage,
    addedSuggestionNames,
    onSubmit,
    onSuggestionSelect: handleSuggestionSelect,
    onEdit: handleEdit,
    onDelete: handleRequestDelete,
    onCancelEdit: handleCancelEdit,
    categoryPendingDelete,
    isConfirmingDelete: deleteCategoryMutation.isPending,
    onCancelDelete: handleCancelDelete,
    onConfirmDelete: handleConfirmDelete,
    refetch: categoriesQuery.refetch,
    hasQueryError: categoriesQuery.isError,
  };
}
