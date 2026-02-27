import { apiRequest } from '@/lib/http/api-client';

export interface AuthUserProfile {
  id: string;
  name: string;
  avatarUrl: string;
  hostLevel: 'Newcomer' | 'Regular' | 'Ambassador' | 'Legend';
  rating: number;
  totalPlans: number;
  bio: string;
  interests: string[];
  badges: Array<{ id: string; name: string; icon: string; description: string }>;
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

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserProfile;
}

function resolveApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (!envUrl) return '';

  if (envUrl.startsWith('http://') || envUrl.startsWith('https://')) {
    return envUrl;
  }

  return `http://${envUrl}`;
}

const API_BASE_URL = resolveApiBaseUrl();

function buildUrl(path: string): string {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL}${path}`;
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(buildUrl('/api/auth/signup'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(buildUrl('/api/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchMe(accessToken: string): Promise<AuthUserProfile> {
  return apiRequest<AuthUserProfile>(buildUrl('/api/auth/me'), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
