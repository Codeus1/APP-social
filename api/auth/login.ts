import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? '';

function createSupabaseClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function assertEnv() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    assertEnv();
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session || !data.user) {
      res.status(401).json({ message: error?.message ?? 'Invalid credentials' });
      return;
    }

    res.status(200).json({
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user: {
        id: data.user.id,
        name: data.user.user_metadata?.name ?? data.user.email ?? '',
        avatarUrl: data.user.user_metadata?.avatar_url ?? '',
        hostLevel: 'Newcomer',
        rating: 0,
        totalPlans: 0,
        bio: '',
        interests: [],
        badges: [],
        stats: { plansHosted: 0, plansJoined: 0, connections: 0 },
        reviews: [],
      },
    });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
}
