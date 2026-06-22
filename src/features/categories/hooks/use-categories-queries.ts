import {
  categoriesQueryKey,
  listCategories,
} from '@/features/categories/api/categories-api';
import { getApiErrorMessage } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';

export function useCategoriesQueries() {
  const categoriesQuery = useQuery({
    queryKey: categoriesQueryKey,
    queryFn: listCategories,
  });

  return {
    categories: categoriesQuery.data ?? [],
    listErrorMessage: categoriesQuery.isError
      ? getApiErrorMessage(
          categoriesQuery.error,
          'Não foi possivel carregar as categorias agora.',
        )
      : undefined,
    isLoading: categoriesQuery.isLoading,
    hasQueryError: categoriesQuery.isError,
    refetch: categoriesQuery.refetch,
  };
}
