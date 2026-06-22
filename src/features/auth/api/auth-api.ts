import { apiClient } from '@/lib/api/client';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@/features/auth/types/auth-api';
import type { AppUser } from '@/features/auth/types/session';

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);

  return response.data;
}

export async function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload);

  return response.data;
}

export async function getCurrentUser(): Promise<AppUser> {
  const response = await apiClient.get<AppUser>('/auth/me');

  return response.data;
}
