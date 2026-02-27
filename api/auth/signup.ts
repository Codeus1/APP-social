import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL ?? '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

function createSupabaseAdmin() {
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function assertEnv() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
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

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error || !data.user) {
      res.status(400).json({ message: error?.message ?? 'Unable to create user' });
      return;
    }

    const login = await supabase.auth.signInWithPassword({ email, password });

    if (login.error || !login.data.session || !login.data.user) {
      res.status(400).json({ message: login.error?.message ?? 'Unable to login' });
      return;
    }

    res.status(201).json({
      accessToken: login.data.session.access_token,
      refreshToken: login.data.session.refresh_token,
      user: {
        id: login.data.user.id,
        name: login.data.user.user_metadata?.name ?? login.data.user.email ?? '',
        avatarUrl: login.data.user.user_metadata?.avatar_url ?? '',
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
