import {
  getCurrentUser,
  login as loginRequest,
  register as registerRequest,
} from '@/features/auth/api/auth-api';
import type {
  LoginFormValues,
  RegisterFormValues,
} from '@/features/auth/lib/auth-schemas';
import {
  clearStoredSession,
  loadStoredSession,
  persistSession,
} from '@/features/auth/lib/auth-storage';
import type { AuthResponse } from '@/features/auth/types/auth-api';
import type { AuthSession } from '@/features/auth/types/session';
import {
  getApiErrorMessage,
  onApiUnauthorized,
  setApiClientAccessToken,
} from '@/lib/api/client';
import { AuthContext, type AuthContextValue } from '@/providers/auth-context';
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const EMPTY_SESSION: AuthSession = {
  user: null,
  accessToken: null,
};

function getResponseStatus(error: unknown): number | undefined {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('response' in error) ||
    typeof (error as { response?: { status?: number } }).response?.status !==
      'number'
  ) {
    return undefined;
  }

  return (error as { response?: { status?: number } }).response?.status;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession>(
    () => loadStoredSession() ?? EMPTY_SESSION,
  );
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const applyAuthResponse = useCallback((response: AuthResponse) => {
    const nextSession: AuthSession = {
      user: response.user,
      accessToken: response.accessToken,
    };

    persistSession(nextSession);
    setApiClientAccessToken(response.accessToken);
    setSession(nextSession);
  }, []);

  const clearSession = useCallback(() => {
    clearStoredSession();
    setApiClientAccessToken(null);
    setSession(EMPTY_SESSION);
  }, []);

  useEffect(() => {
    return onApiUnauthorized(() => {
      clearSession();
      setIsBootstrapping(false);
    });
  }, [clearSession]);

  useEffect(() => {
    const storedSession = loadStoredSession();

    if (!storedSession?.accessToken) {
      setApiClientAccessToken(null);
      setIsBootstrapping(false);
      return;
    }

    let isMounted = true;

    setApiClientAccessToken(storedSession.accessToken);

    const bootstrapSession = async () => {
      try {
        const user = await getCurrentUser();

        if (!isMounted) {
          return;
        }

        const nextSession: AuthSession = {
          user,
          accessToken: storedSession.accessToken,
        };

        persistSession(nextSession);
        setSession(nextSession);
      } catch (error) {
        if (getResponseStatus(error) === 401 && isMounted) {
          clearSession();
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    void bootstrapSession();

    return () => {
      isMounted = false;
    };
  }, [clearSession]);

  const login = useCallback(
    async (values: LoginFormValues) => {
      try {
        const response = await loginRequest(values);

        applyAuthResponse(response);
      } catch (error) {
        throw new Error(
          getApiErrorMessage(error, 'Não foi possivel fazer login agora.'),
        );
      }
    },
    [applyAuthResponse],
  );

  const register = useCallback(
    async (values: RegisterFormValues) => {
      try {
        const response = await registerRequest({
          name: values.name,
          email: values.email,
          password: values.password,
        });

        applyAuthResponse(response);
      } catch (error) {
        throw new Error(
          getApiErrorMessage(error, 'Não foi possivel criar a conta agora.'),
        );
      }
    },
    [applyAuthResponse],
  );

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...session,
      isAuthenticated: Boolean(session.user && session.accessToken),
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [isBootstrapping, login, logout, register, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
