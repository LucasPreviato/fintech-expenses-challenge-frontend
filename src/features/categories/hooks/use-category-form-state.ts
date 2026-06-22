import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type CategoryFormValues,
  categoryFormSchema,
  emptyCategoryFormValues,
} from '@/features/categories/lib/category-schemas';
import type {
  Category,
  CategorySuggestion,
} from '@/features/categories/types/category';

export function useCategoryFormState(categories: Category[]) {
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: emptyCategoryFormValues,
  });
  const isEditing = Boolean(form.watch('categoryId'));
  const addedSuggestionNames = useMemo(
    () =>
      new Set(
        categories.map((category) =>
          category.name.trim().toLocaleLowerCase('pt-BR'),
        ),
      ),
    [categories],
  );

  function resetForm() {
    form.clearErrors();
    form.reset(emptyCategoryFormValues);
  }

  function populateForm(category: Category) {
    form.clearErrors();
    form.reset({
      categoryId: category.id,
      name: category.name,
      description: category.description ?? '',
    });
    setIsFormDrawerOpen(true);
  }

  function applySuggestion(suggestion: CategorySuggestion) {
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

  return {
    form,
    isEditing,
    isFormDrawerOpen,
    addedSuggestionNames,
    resetForm,
    populateForm,
    applySuggestion,
    openCreateDrawer: () => setIsFormDrawerOpen(true),
    closeDrawer: () => setIsFormDrawerOpen(false),
  };
}
