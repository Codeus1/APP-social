import React, { createContext, useCallback, useMemo, useState } from 'react';

import { fetchMe, login, signup, type AuthUserProfile } from './auth-client';
import { clearAuthTokens, getAccessToken, saveAuthTokens } from './auth-storage';

interface AuthState {
  isLoading: boolean;
  user: AuthUserProfile | null;
  accessToken: string | null;
}

interface AuthContextValue extends AuthState {
  bootstrap: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    user: null,
    accessToken: null,
  });

  const bootstrap = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const token = await getAccessToken();

    if (!token) {
      setState({ isLoading: false, user: null, accessToken: null });
      return;
    }

    try {
      const user = await fetchMe(token);
      setState({ isLoading: false, user, accessToken: token });
    } catch {
      await clearAuthTokens();
      setState({ isLoading: false, user: null, accessToken: null });
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await login(email, password);
    await saveAuthTokens(response.accessToken, response.refreshToken);
    setState({ isLoading: false, user: response.user, accessToken: response.accessToken });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const response = await signup(email, password);
    await saveAuthTokens(response.accessToken, response.refreshToken);
    setState({ isLoading: false, user: response.user, accessToken: response.accessToken });
  }, []);

  const signOut = useCallback(async () => {
    await clearAuthTokens();
    setState({ isLoading: false, user: null, accessToken: null });
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      bootstrap,
      signIn,
      register,
      signOut,
    }),
    [bootstrap, register, signIn, signOut, state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.use(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
