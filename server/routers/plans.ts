import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { getAllPlans, getPlanById, createPlan } from '../plans-store';

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
});
