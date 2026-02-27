import { createClient } from '@supabase/supabase-js';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

export async function createContext(opts: FetchCreateContextFnOptions) {
    const { req, resHeaders } = opts;
    const authHeader = req.headers.get('authorization');

    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
    const supabaseAnonKey =
        process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
        process.env.SUPABASE_PUBLISHABLE_KEY ??
        process.env.SUPABASE_PUBLIC_API_KEY ??
        '';

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false },
        global: {
            headers: authHeader ? { Authorization: authHeader } : {},
        },
    });

    let user = null;
    if (authHeader) {
        console.log('[tRPC Context] Auth header present, fetching user...');
        const token = authHeader.replace('Bearer ', '');
        const { data, error } = await supabase.auth.getUser(token);
        if (error) {
            console.error('[tRPC Context] Supabase auth error:', error.message);
        }
        user = data?.user ?? null;
        console.log('[tRPC Context] User resolved:', user?.id || 'null');
    } else {
        console.log('[tRPC Context] No auth header present in request.');
    }

    return {
        req,
        resHeaders,
        supabase,
        user,
    };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
