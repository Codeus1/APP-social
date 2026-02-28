import { router } from '../trpc';
import { plansRouter } from './plans';
import { notificationsRouter } from './notifications';
import { chatsRouter } from './chats';

export const appRouter = router({
    plans: plansRouter,
    notifications: notificationsRouter,
    chats: chatsRouter,
});

export type AppRouter = typeof appRouter;
