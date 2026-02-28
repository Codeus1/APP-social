import { trpc } from '@/lib/trpc/client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppNotification {
    id: string;
    type: 'join_accepted' | 'join_declined' | 'join_request' | 'plan_update';
    title: string;
    body: string;
    planId: string | null;
    isRead: boolean;
    createdAt: string;
    sender: {
        id: string;
        name: string;
        avatarUrl: string | null;
    } | null;
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useNotificationsQuery(unreadOnly = false) {
    return trpc.notifications.list.useQuery(
        { limit: 30, unreadOnly },
        {
            staleTime: 1000 * 30, // 30 s – notifications should feel live
            gcTime: 1000 * 60 * 5,
            refetchOnWindowFocus: true,
        },
    );
}

export function useUnreadCountQuery() {
    return trpc.notifications.unreadCount.useQuery(undefined, {
        staleTime: 1000 * 30,
        gcTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchInterval: 1000 * 60, // poll every minute for badge count
    });
}

export function useMarkNotificationRead() {
    const utils = trpc.useUtils();

    return trpc.notifications.markRead.useMutation({
        onSuccess: async () => {
            await utils.notifications.list.invalidate();
            await utils.notifications.unreadCount.invalidate();
        },
    });
}

export function useMarkAllNotificationsRead() {
    const utils = trpc.useUtils();

    return trpc.notifications.markAllRead.useMutation({
        onSuccess: async () => {
            await utils.notifications.list.invalidate();
            await utils.notifications.unreadCount.invalidate();
        },
    });
}

export function useDeleteNotification() {
    const utils = trpc.useUtils();

    return trpc.notifications.deleteOne.useMutation({
        onSuccess: async () => {
            await utils.notifications.list.invalidate();
            await utils.notifications.unreadCount.invalidate();
        },
    });
}
