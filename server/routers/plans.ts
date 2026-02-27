import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import {
    getAllPlans,
    getPlanById,
    createPlan,
    joinPlan,
    updatePlan,
    deletePlan,
} from '../plans-store';

export const plansRouter = router({
    list: publicProcedure.query(() => {
        return getAllPlans();
    }),

    byId: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(({ input }) => {
            return getPlanById(input.id);
        }),

    create: publicProcedure
        .input(
            z.object({
                title: z.string().min(1),
                location: z.string().min(1),
                description: z.string(),
                energy: z.enum(['low', 'medium', 'high']),
                tags: z.array(z.string()),
                maxAttendees: z.number().int().positive(),
                startsAt: z.string().datetime(),
            }),
        )
        .mutation(({ input }) => {
            return createPlan(input);
        }),

    join: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ input }) => {
            return joinPlan(input.id);
        }),

    update: publicProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1).optional(),
                location: z.string().min(1).optional(),
                description: z.string().optional(),
                energy: z.enum(['low', 'medium', 'high']).optional(),
                tags: z.array(z.string()).optional(),
                maxAttendees: z.number().int().positive().optional(),
                startsAt: z.string().datetime().optional(),
            }),
        )
        .mutation(({ input }) => {
            const { id, ...updates } = input;
            return updatePlan(id, updates);
        }),

    delete: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ input }) => {
            deletePlan(input.id);
            return { success: true };
        }),
});
