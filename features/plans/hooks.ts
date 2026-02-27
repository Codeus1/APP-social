import { trpc } from '@/lib/trpc/client';

export function usePlansQuery() {
  return trpc.plans.list.useQuery(undefined, {
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 30,
    retry: 1,
  });
}

export function usePlanQuery(id?: string) {
  return trpc.plans.byId.useQuery(
    { id: id ?? '' },
    {
      enabled: Boolean(id),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
    },
  );
}

export function useCreatePlan() {
  const utils = trpc.useUtils();

  return trpc.plans.create.useMutation({
    onSuccess: async (newPlan) => {
      utils.plans.byId.setData({ id: newPlan.id }, newPlan);
      await utils.plans.list.invalidate();
    },
  });
}
