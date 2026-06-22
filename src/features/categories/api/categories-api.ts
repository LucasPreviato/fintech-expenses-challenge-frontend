import type {
  Category,
  CreateCategoryRequest,
  PaginatedResponse,
  UpdateCategoryRequest,
} from '@/features/categories/types/category';
import { apiClient } from '@/lib/api/client';

export const categoriesQueryKey = ['categories'] as const;

export async function listCategories(): Promise<Category[]> {
  const response = await apiClient.get<PaginatedResponse<Category>>(
    '/categories',
    {
      params: {
        page: 1,
        perPage: 100,
      },
    },
  );

  return response.data.data;
}

export async function createCategory(
  payload: CreateCategoryRequest,
): Promise<Category> {
  const response = await apiClient.post<Category>('/categories', payload);

  return response.data;
}

export async function updateCategory(
  id: string,
  payload: UpdateCategoryRequest,
): Promise<Category> {
  const response = await apiClient.patch<Category>(`/categories/${id}`, payload);

  return response.data;
}

export async function deleteCategory(id: string): Promise<Category> {
  const response = await apiClient.delete<Category>(`/categories/${id}`);

  return response.data;
}
