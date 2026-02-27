import { router } from '../trpc';
import { plansRouter } from './plans';

export const appRouter = router({
  plans: plansRouter,
});

export type AppRouter = typeof appRouter;
