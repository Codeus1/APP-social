import { useQuery } from '@tanstack/react-query';

import { fetchPlanById, fetchPlans } from '@/features/plans/api';

export function usePlansQuery() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
    staleTime: 1000 * 60 * 3,
  });
}

export function usePlanQuery(planId?: string) {
  return useQuery({
    queryKey: ['plans', planId],
    queryFn: () => fetchPlanById(planId ?? ''),
    enabled: Boolean(planId),
    staleTime: 1000 * 60 * 3,
  });
}

