import { ApiError, apiRequest } from '@/lib/http/api-client';
import { mockPlans } from '@/features/plans/mock-data';
import { Plan } from '@/features/plans/types';

type PlansResponse = { plans: Plan[] };
type PlanResponse = { plan: Plan };

const apiBase = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

function resolveApiPath(path: string) {
  if (apiBase) {
    return `${apiBase}${path}`;
  }

  if (typeof window !== 'undefined') {
    return path;
  }

  throw new ApiError('EXPO_PUBLIC_API_URL is not configured', 0, 'MISSING_API_URL');
}

export async function fetchPlans(): Promise<Plan[]> {
  try {
    const data = await apiRequest<PlansResponse>(resolveApiPath('/api/plans'));
    return data.plans;
  } catch {
    return mockPlans;
  }
}

export async function fetchPlanById(planId: string): Promise<Plan | null> {
  try {
    const data = await apiRequest<PlanResponse>(resolveApiPath(`/api/plans/${planId}`));
    return data.plan;
  } catch {
    return mockPlans.find((item) => item.id === planId) ?? null;
  }
}

