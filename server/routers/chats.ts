import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const chatsRouter = router({
    getOrCreateDirectChat: protectedProcedure
        .input(z.object({ targetUserId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (ctx.user.id === input.targetUserId) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Cannot chat with yourself',
                });
            }

            // Find existing direct chat between these two users
            // A direct chat where both are members
            const { data: myChats, error: myChatsError } = await ctx.supabase
                .from('chat_members')
                .select('chat_id, chats!inner(type)')
                .eq('user_id', ctx.user.id)
                .eq('chats.type', 'direct');

            if (myChatsError) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: myChatsError.message,
                });
            }

            const myChatIds = myChats.map((c) => c.chat_id);

            if (myChatIds.length > 0) {
                const { data: commonChats, error: commonChatsError } =
                    await ctx.supabase
                        .from('chat_members')
                        .select('chat_id')
                        .in('chat_id', myChatIds)
                        .eq('user_id', input.targetUserId);

                if (commonChats.length > 0) {
                    return { chatId: commonChats[0].chat_id };
                }
            }

            // Chat doesn't exist, create it (Bypass RLS using admin)
            const { data: newChat, error: createError } =
                await ctx.supabaseAdmin
                    .from('chats')
                    .insert({ type: 'direct' })
                    .select()
                    .single();

            if (createError) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: createError.message,
                });
            }

            // Add members (Bypass RLS using admin)
            const { error: membersError } = await ctx.supabaseAdmin
                .from('chat_members')
                .insert([
                    { chat_id: newChat.id, user_id: ctx.user.id },
                    { chat_id: newChat.id, user_id: input.targetUserId },
                ]);

            if (membersError) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: membersError.message,
                });
            }

            return { chatId: newChat.id };
        }),

    getChatMeta: protectedProcedure
        .input(z.object({ chatId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('chats')
                .select(
                    `
                    id, type, plan_id,
                    members:chat_members(user_id, profiles!chat_members_user_id_fkey(name, avatar_url))
                `,
                )
                .eq('id', input.chatId)
                .single();

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            const isMember = data.members.some(
                (m: any) => m.user_id === ctx.user.id,
            );
            if (!isMember) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Not a member of this chat',
                });
            }

            const otherMembers = data.members.filter(
                (m: any) => m.user_id !== ctx.user.id,
            );

            return {
                id: data.id,
                type: data.type,
                planId: data.plan_id,
                title:
                    data.type === 'direct' && otherMembers.length > 0
                        ? ((otherMembers[0] as any).profiles?.name ??
                          'Unknown User')
                        : 'Chat',
                subtitle:
                    data.type === 'direct' ? 'Direct Message' : 'Plan Chat',
                avatarUrl:
                    data.type === 'direct' && otherMembers.length > 0
                        ? ((otherMembers[0] as any).profiles?.avatar_url ??
                          'https://i.pravatar.cc/150')
                        : 'https://i.pravatar.cc/150',
            };
        }),

    getMessages: protectedProcedure
        .input(z.object({ chatId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('messages')
                .select(
                    `
                    id, content, created_at, is_system_message, sender_id,
                    sender:profiles!messages_sender_id_fkey(name, avatar_url)
                `,
                )
                .eq('chat_id', input.chatId)
                .order('created_at', { ascending: true });

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            return data.map((msg: any) => ({
                id: msg.id,
                chatId: input.chatId,
                senderId: msg.sender_id,
                senderName: msg.sender?.name ?? 'Unknown',
                senderAvatarUrl: msg.sender?.avatar_url ?? null,
                content: msg.content,
                createdAt: msg.created_at,
                isCurrentUser: msg.sender_id === ctx.user.id,
                isSystemMessage: msg.is_system_message,
            }));
        }),

    sendMessage: protectedProcedure
        .input(z.object({ chatId: z.string(), content: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            // Ensure user is member
            const { data: member, error: memberError } = await ctx.supabase
                .from('chat_members')
                .select('user_id')
                .eq('chat_id', input.chatId)
                .eq('user_id', ctx.user.id)
                .single();

            if (!member) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You are not a member of this chat',
                });
            }

            const { data, error } = await ctx.supabase
                .from('messages')
                .insert({
                    chat_id: input.chatId,
                    sender_id: ctx.user.id,
                    content: input.content,
                })
                .select()
                .single();

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            // Update chat last message
            await ctx.supabase
                .from('chats')
                .update({
                    last_message: input.content,
                    last_message_at: new Date().toISOString(),
                })
                .eq('id', input.chatId);

            return data;
        }),
});
