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

export function useJoinPlan() {
    const utils = trpc.useUtils();

    return trpc.plans.join.useMutation({
        onSuccess: async (updatedPlan) => {
            utils.plans.byId.setData({ id: updatedPlan.id }, updatedPlan);
            await utils.plans.list.invalidate();
        },
    });
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

export function useUpdatePlan() {
    const utils = trpc.useUtils();

    return trpc.plans.update.useMutation({
        onSuccess: async (updatedPlan) => {
            utils.plans.byId.setData({ id: updatedPlan.id }, updatedPlan);
            await utils.plans.list.invalidate();
        },
    });
}

export function useDeletePlan() {
    const utils = trpc.useUtils();

    return trpc.plans.delete.useMutation({
        onSuccess: async (_, { id }) => {
            utils.plans.byId.invalidate({ id });
            await utils.plans.list.invalidate();
        },
    });
}
