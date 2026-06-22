import type {
  LoginFormValues,
  RegisterFormValues,
} from '@/features/auth/lib/auth-schemas';
import type { AuthSession } from '@/features/auth/types/session';
import { createContext, useContext } from 'react';

export interface AuthContextValue extends AuthSession {
  isAuthenticated: boolean;
  login: (values: LoginFormValues) => Promise<void>;
  register: (values: RegisterFormValues) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
