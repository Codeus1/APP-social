import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../trpc';

// Mapper to convert from database snake_case to frontend camelCase
function mapDbPlanToFrontend(
    dbPlan: any,
    userJoinStatus: 'none' | 'pending' | 'joined' = 'none',
) {
    // Extract count from relation if available, fallback to 1 (the host)
    const countData = Array.isArray(dbPlan.plan_attendees)
        ? dbPlan.plan_attendees[0]?.count
        : dbPlan.plan_attendees?.count;
    const attendeesCount = countData ?? 1;

    // Derived properties
    const now = new Date();
    const startsAt = new Date(dbPlan.starts_at);
    const isHappeningNow = dbPlan.status === 'published' && startsAt <= now;

    return {
        id: dbPlan.id,
        title: dbPlan.title,
        description: dbPlan.description,
        location: dbPlan.location,
        coordinates: {
            lat: dbPlan.lat ?? 0,
            lng: dbPlan.lng ?? 0,
        },
        host: dbPlan.host ?? {
            id: dbPlan.host_id,
            name: dbPlan.profiles?.name ?? 'Unknown Host',
            avatarUrl: dbPlan.profiles?.avatar_url ?? null,
            verified: dbPlan.profiles?.is_verified ?? false,
            hostLevel: dbPlan.profiles?.host_level ?? 'Newcomer',
            rating: dbPlan.profiles?.rating ?? 0.0,
        },
        startsAt: dbPlan.starts_at,
        energy: dbPlan.energy,
        activityType: dbPlan.activity_type ?? 'drinks',
        tags: dbPlan.tags ?? [],
        attendees: attendeesCount,
        maxAttendees: dbPlan.max_attendees,
        price: dbPlan.price,
        ageRange: dbPlan.age_range,
        approvalRequired: dbPlan.approval_required ?? true,
        imageUrl: dbPlan.image_url ?? null,
        isHappeningNow,
        status: dbPlan.status ?? 'published',
        visibility: dbPlan.visibility ?? 'public',
        userJoinStatus,
    };
}

export const plansRouter = router({
    list: publicProcedure.query(async ({ ctx }) => {
        const { data, error } = await ctx.supabase
            .from('plans')
            .select(
                `
                *,
                profiles:host_id (
                    name,
                    avatar_url,
                    is_verified
                ),
                plan_attendees (count)
            `,
            )
            .eq('status', 'published')
            .order('starts_at', { ascending: true });

        if (error) {
            console.error('Error fetching plans:', error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message,
            });
        }

        return data.map((p) => mapDbPlanToFrontend(p));
    }),

    /** Returns the list of confirmed attendees for a plan */
    getAttendees: publicProcedure
        .input(z.object({ planId: z.string() }))
        .query(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('plan_attendees')
                .select(
                    `user_id,
                     profiles (
                         id,
                         name,
                         avatar_url
                     )`,
                )
                .eq('plan_id', input.planId)
                .order('joined_at', { ascending: true });

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            return (data ?? []).map((row: any) => ({
                id: row.profiles?.id ?? row.user_id,
                name: row.profiles?.name ?? 'Unknown',
                avatarUrl: row.profiles?.avatar_url ?? null,
            }));
        }),

    byId: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('plans')
                .select(
                    `
                    *,
                    profiles:host_id (
                        name,
                        avatar_url,
                        is_verified
                    ),
                    plan_attendees (count)
                `,
                )
                .eq('id', input.id)
                .single();

            if (error) {
                console.error('Error fetching plan by id:', error);
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plan not found',
                });
            }

            let userJoinStatus: 'none' | 'pending' | 'joined' = 'none';

            if (ctx.user) {
                if (ctx.user.id === data.host_id) {
                    userJoinStatus = 'joined';
                } else {
                    // Check joined
                    const { data: attendee } = await ctx.supabase
                        .from('plan_attendees')
                        .select('user_id')
                        .eq('plan_id', input.id)
                        .eq('user_id', ctx.user.id)
                        .maybeSingle();

                    if (attendee) {
                        userJoinStatus = 'joined';
                    } else {
                        // Check pending
                        const { data: req, error: reqError } =
                            await ctx.supabase
                                .from('join_requests')
                                .select('status')
                                .eq('plan_id', input.id)
                                .eq('user_id', ctx.user.id)
                                .eq('status', 'pending')
                                .maybeSingle();

                        console.log(
                            `[byId Debug] pending check for user ${ctx.user.id} on plan ${input.id}:`,
                            { req, reqError },
                        );

                        if (req) userJoinStatus = 'pending';
                    }
                }
            }

            return mapDbPlanToFrontend(data, userJoinStatus);
        }),

    create: protectedProcedure
        .input(
            z.object({
                title: z.string().min(1),
                location: z.string().min(1),
                description: z.string(),
                energy: z.enum(['low', 'medium', 'high']),
                activityType: z.string(),
                price: z.enum(['cheap', 'moderate', 'expensive']),
                ageRange: z.string(),
                tags: z.array(z.string()),
                approvalRequired: z.boolean(),
                maxAttendees: z.number().int().positive(),
                startsAt: z.string().datetime(),
                imageUrl: z.string().nullable().optional(),
                lat: z.number().optional(),
                lng: z.number().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const newPlan = {
                title: input.title,
                location: input.location,
                description: input.description,
                energy: input.energy,
                activity_type: input.activityType,
                price: input.price,
                age_range: input.ageRange,
                tags: input.tags,
                approval_required: input.approvalRequired,
                max_attendees: input.maxAttendees,
                starts_at: input.startsAt,
                host_id: ctx.user.id,
                image_url: input.imageUrl || undefined,
                lat: input.lat || 0,
                lng: input.lng || 0,
                status: 'published',
                visibility: 'public',
            };

            const { data, error } = await ctx.supabase
                .from('plans')
                .insert(newPlan)
                .select()
                .single();

            if (error) {
                console.error('Error creating plan:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            // Also join the plan automatically
            await ctx.supabase
                .from('plan_attendees')
                .insert({ plan_id: data.id, user_id: ctx.user.id });

            return mapDbPlanToFrontend(data);
        }),

    join: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // First check if already fully joined or plan is full
            const { data: plan, error: planError } = await ctx.supabase
                .from('plans')
                .select('max_attendees, plan_attendees(count)')
                .eq('id', input.id)
                .single();

            if (planError || !plan)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plan not found',
                });

            const currentAttendees = Array.isArray(plan.plan_attendees)
                ? (plan.plan_attendees[0]?.count ?? 0)
                : ((plan.plan_attendees as any)?.count ?? 0);

            if (currentAttendees >= plan.max_attendees) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Plan is full',
                });
            }

            const { error: joinError } = await ctx.supabase
                .from('join_requests')
                .insert({
                    plan_id: input.id,
                    user_id: ctx.user.id,
                    status: 'pending',
                });

            if (joinError) {
                if (joinError.code === '23505') {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'Already requested to join',
                    });
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: joinError.message,
                });
            }

            return { success: true };
        }),

    getJoinRequests: protectedProcedure
        .input(z.object({ planId: z.string() }))
        .query(async ({ ctx, input }) => {
            // Check if host
            const { data: plan } = await ctx.supabase
                .from('plans')
                .select('host_id')
                .eq('id', input.planId)
                .single();

            if (plan?.host_id !== ctx.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Not the host',
                });
            }

            const { data, error } = await ctx.supabase
                .from('join_requests')
                .select(
                    `
                    id, status, created_at,
                    user:profiles(id, name, avatar_url, host_level)
                `,
                )
                .eq('plan_id', input.planId)
                .eq('status', 'pending');

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            return data.map((d: any) => ({
                id: d.id,
                status: d.status,
                created_at: d.created_at,
                user: Array.isArray(d.user) ? d.user[0] : d.user,
            }));
        }),

    respondToJoinRequest: protectedProcedure
        .input(
            z.object({
                requestId: z.string(),
                planId: z.string(),
                userId: z.string(),
                status: z.enum(['accepted', 'declined']),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // Verify host
            const { data: plan } = await ctx.supabase
                .from('plans')
                .select('host_id, max_attendees, plan_attendees(count)')
                .eq('id', input.planId)
                .single();

            if (plan?.host_id !== ctx.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Not the host',
                });
            }

            const currentAttendees = Array.isArray(plan.plan_attendees)
                ? (plan.plan_attendees[0]?.count ?? 0)
                : ((plan.plan_attendees as any)?.count ?? 0);

            if (
                input.status === 'accepted' &&
                currentAttendees >= plan.max_attendees
            ) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Plan is full',
                });
            }

            // Update request status
            const { error: updateReqError } = await ctx.supabase
                .from('join_requests')
                .update({ status: input.status })
                .eq('id', input.requestId);

            if (updateReqError) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: updateReqError.message,
                });
            }

            if (input.status === 'accepted') {
                // Add to plan attendees
                const { error: insertError } = await ctx.supabase
                    .from('plan_attendees')
                    .insert({ plan_id: input.planId, user_id: input.userId });

                if (insertError) {
                    console.error(
                        '[respondToJoinRequest] Failed to add attendee:',
                        insertError,
                    );
                    // Rollback request status in a real world app, but for now throw
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message:
                            'Failed to add user to plan attendees: ' +
                            insertError.message,
                    });
                }
            }

            // ── Fetch plan title + host profile name for the notification body ──
            const { data: planMeta } = await ctx.supabase
                .from('plans')
                .select('title, profiles!plans_host_id_fkey(name)')
                .eq('id', input.planId)
                .single();

            const planTitle = (planMeta as any)?.title ?? 'the plan';
            const hostName = (planMeta as any)?.profiles?.name ?? 'The host';

            // ── Insert in-app notification for the requester ──
            await ctx.supabase.from('notifications').insert({
                user_id: input.userId,
                type:
                    input.status === 'accepted'
                        ? 'join_accepted'
                        : 'join_declined',
                title:
                    input.status === 'accepted'
                        ? "🎉 You're in!"
                        : 'Request not accepted',
                body:
                    input.status === 'accepted'
                        ? `${hostName} accepted your request to join "${planTitle}". See you there!`
                        : `${hostName} couldn't fit you into "${planTitle}" this time. Keep exploring!`,
                plan_id: input.planId,
                sender_id: ctx.user.id,
            });

            return { success: true };
        }),

    update: protectedProcedure
        .input(
            z.object({
                id: z.string(),
                title: z.string().min(1).optional(),
                location: z.string().min(1).optional(),
                description: z.string().optional(),
                energy: z.enum(['low', 'medium', 'high']).optional(),
                activityType: z.string().optional(),
                price: z.enum(['cheap', 'moderate', 'expensive']).optional(),
                ageRange: z.string().optional(),
                approvalRequired: z.boolean().optional(),
                tags: z.array(z.string()).optional(),
                maxAttendees: z.number().int().positive().optional(),
                startsAt: z.string().datetime().optional(),
                imageUrl: z.string().nullable().optional(),
                lat: z.number().optional(),
                lng: z.number().optional(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...updates } = input;

            // Verify ownership
            const { data: checkData } = await ctx.supabase
                .from('plans')
                .select('host_id')
                .eq('id', id)
                .single();

            if (checkData?.host_id !== ctx.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Not authorized to edit this plan',
                });
            }

            const dbUpdates: any = {};
            if (updates.title !== undefined) dbUpdates.title = updates.title;
            if (updates.location !== undefined)
                dbUpdates.location = updates.location;
            if (updates.description !== undefined)
                dbUpdates.description = updates.description;
            if (updates.energy !== undefined) dbUpdates.energy = updates.energy;
            if (updates.activityType !== undefined)
                dbUpdates.activity_type = updates.activityType;
            if (updates.price !== undefined) dbUpdates.price = updates.price;
            if (updates.ageRange !== undefined)
                dbUpdates.age_range = updates.ageRange;
            if (updates.approvalRequired !== undefined)
                dbUpdates.approval_required = updates.approvalRequired;
            if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
            if (updates.maxAttendees !== undefined)
                dbUpdates.max_attendees = updates.maxAttendees;
            if (updates.startsAt !== undefined)
                dbUpdates.starts_at = updates.startsAt;
            if (updates.imageUrl !== undefined)
                dbUpdates.image_url = updates.imageUrl;
            if (updates.lat !== undefined) dbUpdates.lat = updates.lat;
            if (updates.lng !== undefined) dbUpdates.lng = updates.lng;

            const { data, error } = await ctx.supabase
                .from('plans')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating plan:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            return mapDbPlanToFrontend(data);
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            // Verify ownership
            const { data: checkData } = await ctx.supabase
                .from('plans')
                .select('host_id')
                .eq('id', input.id)
                .single();

            if (checkData?.host_id !== ctx.user.id) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Not authorized to delete this plan',
                });
            }

            const { error } = await ctx.supabase
                .from('plans')
                .delete()
                .eq('id', input.id);

            if (error) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: error.message,
                });
            }

            return { success: true };
        }),
});
