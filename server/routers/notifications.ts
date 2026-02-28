import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';

export const notificationsRouter = router({
    /**
     * Returns the authenticated user's notifications, newest first.
     * Joins sender profile for avatar & name.
     */
    list: protectedProcedure
        .input(
            z
                .object({
                    limit: z.number().int().min(1).max(50).default(30),
                    unreadOnly: z.boolean().default(false),
                })
                .optional(),
        )
        .query(async ({ ctx, input }) => {
            let query = ctx.supabase
                .from('notifications')
                .select(
                    `id, type, title, body, plan_id, is_read, created_at,
                     sender:profiles!notifications_sender_id_fkey(id, name, avatar_url)`,
                )
                .eq('user_id', ctx.user.id)
                .order('created_at', { ascending: false })
                .limit(input?.limit ?? 30);

            if (input?.unreadOnly) {
                query = query.eq('is_read', false);
            }

            const { data, error } = await query;

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            return (data ?? []).map((n: any) => ({
                id: n.id as string,
                type: n.type as string,
                title: n.title as string,
                body: n.body as string,
                planId: n.plan_id as string | null,
                isRead: n.is_read as boolean,
                createdAt: n.created_at as string,
                sender: n.sender
                    ? {
                          id: (n.sender as any).id as string,
                          name: (n.sender as any).name as string,
                          avatarUrl: (n.sender as any).avatar_url as
                              | string
                              | null,
                      }
                    : null,
            }));
        }),

    /** Unread count (lightweight badge query) */
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
        const { count, error } = await ctx.supabase
            .from('notifications')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', ctx.user.id)
            .eq('is_read', false);

        if (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message,
            });
        }

        return { count: count ?? 0 };
    }),

    /** Mark a single notification as read */
    markRead: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { error } = await ctx.supabase
                .from('notifications')
                .update({ is_read: true })
                .eq('id', input.id)
                .eq('user_id', ctx.user.id);

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            return { success: true };
        }),

    /** Mark all notifications as read */
    markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
        const { error } = await ctx.supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', ctx.user.id)
            .eq('is_read', false);

        if (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message,
            });
        }

        return { success: true };
    }),

    /** Delete a single notification */
    deleteOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { error } = await ctx.supabase
                .from('notifications')
                .delete()
                .eq('id', input.id)
                .eq('user_id', ctx.user.id);

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            return { success: true };
        }),
});
