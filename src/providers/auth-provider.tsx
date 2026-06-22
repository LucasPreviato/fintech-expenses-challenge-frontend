import type {
  LoginFormValues,
  RegisterFormValues,
} from '@/features/auth/lib/auth-schemas';
import type { AppUser, AuthSession } from '@/features/auth/types/session';
import { AuthContext, type AuthContextValue } from '@/providers/auth-context';
import { type PropsWithChildren, useCallback, useMemo, useState } from 'react';

function buildMockUser({
  email,
  name,
}: {
  email: string;
  name?: string;
}): AppUser {
  return {
    id: crypto.randomUUID(),
    name: name ?? email.split('@')[0] ?? 'Usuario',
    email,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession>({
    user: null,
    accessToken: null,
  });

  const login = useCallback(async (values: LoginFormValues) => {
    const user = buildMockUser({ email: values.email });

    setSession({
      user,
      accessToken: 'mock-access-token',
    });
  }, []);

  const register = useCallback(async (values: RegisterFormValues) => {
    const user = buildMockUser({ email: values.email, name: values.name });

    setSession({
      user,
      accessToken: 'mock-access-token',
    });
  }, []);

  const logout = useCallback(() => {
    setSession({
      user: null,
      accessToken: null,
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...session,
      isAuthenticated: Boolean(session.user && session.accessToken),
      login,
      register,
      logout,
    }),
    [login, logout, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
