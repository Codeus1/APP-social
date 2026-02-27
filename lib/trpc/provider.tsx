import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { Platform } from 'react-native';
import superjson from 'superjson';

import { trpc } from './client';

function resolveApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  const normalizeUrl = (value: string) => {
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }

    return `http://${value}`;
  };

  if (envUrl) {
    const normalizedEnvUrl = normalizeUrl(envUrl);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const parsedUrl = new URL(normalizedEnvUrl);
        const isSameHost = parsedUrl.hostname === window.location.hostname;
        const isMetroPort = parsedUrl.port === '8081' || parsedUrl.port === '8082';

        if (isSameHost && isMetroPort) {
          return `http://${window.location.hostname}:3000`;
        }
      } catch {
        return normalizedEnvUrl;
      }
    }

    return normalizedEnvUrl;
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return `http://${window.location.hostname}:3000`;
  }

  return 'http://localhost:3000';
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
