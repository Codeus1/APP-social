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

function getTokenFromHeader(header?: string) {
  if (!header) return null;
  const [, token] = header.split(' ');
  return token ?? null;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    assertEnv();
    const token = getTokenFromHeader(req.headers.authorization);

    if (!token) {
      res.status(401).json({ message: 'Missing bearer token' });
      return;
    }

    const supabase = createSupabaseAdmin();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      res.status(401).json({ message: error?.message ?? 'Invalid token' });
      return;
    }

    res.status(200).json({
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
    });
  } catch (error) {
    res.status(500).json({ message: error instanceof Error ? error.message : 'Server error' });
  }
}
