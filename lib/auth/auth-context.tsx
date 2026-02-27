import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';

import { supabaseClient } from '@/lib/supabase/client';

export interface AuthUserProfile {
    id: string;
    name: string;
    avatarUrl: string;
    hostLevel: 'Newcomer' | 'Regular' | 'Ambassador' | 'Legend';
    rating: number;
    totalPlans: number;
    bio: string;
    interests: string[];
    badges: Array<{
        id: string;
        name: string;
        icon: string;
        description: string;
    }>;
    stats: { plansHosted: number; plansJoined: number; connections: number };
    reviews: Array<{
        id: string;
        reviewerName: string;
        reviewerAvatarUrl: string;
        rating: number;
        text: string;
        createdAt: string;
    }>;
}

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

function buildUserProfile(supabaseUser: {
    id: string;
    email?: string;
    user_metadata?: Record<string, string>;
}): AuthUserProfile {
    return {
        id: supabaseUser.id,
        name:
            supabaseUser.user_metadata?.full_name ??
            supabaseUser.user_metadata?.name ??
            supabaseUser.email ??
            'Usuario',
        avatarUrl: supabaseUser.user_metadata?.avatar_url ?? '',
        hostLevel: 'Newcomer',
        rating: 0,
        totalPlans: 0,
        bio: '',
        interests: [],
        badges: [],
        stats: { plansHosted: 0, plansJoined: 0, connections: 0 },
        reviews: [],
    };
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

        const { data } = await supabaseClient.auth.getSession();
        const session = data.session;

        if (!session?.user) {
            setState({ isLoading: false, user: null, accessToken: null });
            return;
        }

        setState({
            isLoading: false,
            user: buildUserProfile(session.user),
            accessToken: session.access_token,
        });
    }, []);

    // Escuchar cambios de sesión automáticamente (token refresh, logout, etc.)
    useEffect(() => {
        const { data: listener } = supabaseClient.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.user) {
                    setState({
                        isLoading: false,
                        user: buildUserProfile(session.user),
                        accessToken: session.access_token,
                    });
                } else {
                    setState({
                        isLoading: false,
                        user: null,
                        accessToken: null,
                    });
                }
            },
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        if (!data.session) throw new Error('No se pudo iniciar sesión');

        setState({
            isLoading: false,
            user: buildUserProfile(data.user),
            accessToken: data.session.access_token,
        });
    }, []);

    const register = useCallback(async (email: string, password: string) => {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
        });

        if (error) throw new Error(error.message);
        if (!data.user) throw new Error('No se pudo crear la cuenta');

        // Si hay sesión (confirmación de email desactivada), logueamos directamente
        if (data.session) {
            setState({
                isLoading: false,
                user: buildUserProfile(data.user),
                accessToken: data.session.access_token,
            });
        } else {
            // Si Supabase requiere confirmar email, el usuario verá un mensaje
            throw new Error(
                'Revisa tu email para confirmar tu cuenta antes de iniciar sesión.',
            );
        }
    }, []);

    const signOut = useCallback(async () => {
        await supabaseClient.auth.signOut();
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

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = React.use(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }

    return context;
}
