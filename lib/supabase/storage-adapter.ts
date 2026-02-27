import { Platform } from 'react-native';
import type { SupportedStorage } from '@supabase/supabase-js';

/**
 * Universal storage adapter for Supabase auth.
 * - Web: uses localStorage (available in browser)
 * - Native (iOS/Android): uses AsyncStorage
 */
function createStorageAdapter(): SupportedStorage {
    if (Platform.OS === 'web') {
        // In web environment, use localStorage
        return {
            getItem: (key: string) => {
                if (typeof localStorage === 'undefined') return null;
                return localStorage.getItem(key);
            },
            setItem: (key: string, value: string) => {
                if (typeof localStorage === 'undefined') return;
                localStorage.setItem(key, value);
            },
            removeItem: (key: string) => {
                if (typeof localStorage === 'undefined') return;
                localStorage.removeItem(key);
            },
        };
    }

    // Native environment: use AsyncStorage
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const AsyncStorage =
        require('@react-native-async-storage/async-storage').default;
    return AsyncStorage;
}

export const storageAdapter = createStorageAdapter();
