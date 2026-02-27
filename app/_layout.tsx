import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import Toast from 'react-native-toast-message';

import { navigationTheme } from '@/lib/theme/navigation-theme';
import { TRPCProvider } from '@/lib/trpc/provider';
import { AuthProvider } from '@/lib/auth/auth-context';
import { tamaguiConfig } from '../tamagui.config';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 60,
            retry: 2,
            retryOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            networkMode: 'offlineFirst',
        },
        mutations: {
            retry: 1,
            networkMode: 'online',
        },
    },
});

export default function RootLayout() {
    return (
        <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
            <ThemeProvider value={navigationTheme}>
                <QueryClientProvider client={queryClient}>
                    <TRPCProvider queryClient={queryClient}>
                        <AuthProvider>
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="splash" />
                                <Stack.Screen name="onboarding" />
                                <Stack.Screen name="(auth)" />
                                <Stack.Screen name="(tabs)" />
                            </Stack>
                        </AuthProvider>
                    </TRPCProvider>
                </QueryClientProvider>
            </ThemeProvider>
            <Toast />
        </TamaguiProvider>
    );
}
