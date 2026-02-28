import { router } from '../trpc';
import { plansRouter } from './plans';
import { notificationsRouter } from './notifications';

export const appRouter = router({
    plans: plansRouter,
    notifications: notificationsRouter,
});

export type AppRouter = typeof appRouter;
