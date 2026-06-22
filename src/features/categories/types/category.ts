export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CreateCategoryRequest {
  name: string;
  description: string | null;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string | null;
}

export type CategorySuggestionGroup = 'Do desafio' | 'Outras ideias';

export interface CategorySuggestion {
  name: string;
  description: string;
  group: CategorySuggestionGroup;
}
