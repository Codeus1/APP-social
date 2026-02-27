import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import superjson from 'superjson';

import { trpc } from './client';

import Constants from 'expo-constants';

function getBaseUrl() {
    if (typeof window !== 'undefined') {
        // browser should use relative url
        return '';
    }

    const debuggerHost = Constants.expoConfig?.hostUri;
    const localhost = debuggerHost?.split(':')[0];

    if (localhost) {
        return `http://${localhost}:8081`;
    }

    return 'http://localhost:8081';
}

function resolveApiUrl(): string {
    return `${getBaseUrl()}/api/trpc`;
}

const API_URL = resolveApiUrl();

interface TRPCProviderProps {
    queryClient: QueryClient;
    children: React.ReactNode;
}

export function TRPCProvider({ queryClient, children }: TRPCProviderProps) {
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: API_URL,
                    transformer: superjson,
                }),
            ],
        }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            {children}
        </trpc.Provider>
    );
}
