import { router } from '../trpc';
import { plansRouter } from './plans';
import { notificationsRouter } from './notifications';
import { chatsRouter } from './chats';
import { userRouter } from './user';

export const appRouter = router({
    plans: plansRouter,
    notifications: notificationsRouter,
    chats: chatsRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
