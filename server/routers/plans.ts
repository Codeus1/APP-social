import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure, protectedProcedure } from '../trpc';

// Mapper to convert from database snake_case to frontend camelCase
function mapDbPlanToFrontend(dbPlan: any) {
    if (!dbPlan) return null;

    // Determine attendees count from plan_attendees optionally joined, or the attendees_count column
    const attendeesCount = dbPlan.attendees_count ?? 1;

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
            name: dbPlan.profiles?.name ?? 'Unknown Host',
            avatarUrl:
                dbPlan.profiles?.avatar_url ?? 'https://i.pravatar.cc/150',
            verified: dbPlan.profiles?.is_verified ?? false,
        },
        startsAt: dbPlan.starts_at,
        energy: dbPlan.energy,
        tags: dbPlan.tags ?? [],
        attendees: attendeesCount,
        maxAttendees: dbPlan.max_attendees,
        matchPercentage: 100, // Placeholder
        genderRatio: {
            male: dbPlan.gender_ratio_male ?? 50,
            female: dbPlan.gender_ratio_female ?? 50,
        },
        price: dbPlan.price,
        ageRange: dbPlan.age_range,
        imageUrl:
            dbPlan.image_url ??
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        isHappeningNow: dbPlan.is_happening_now ?? false,
        distance: '0 km', // Placeholder, needs geospatial query for real distance
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
                )
            `,
            )
            .order('starts_at', { ascending: true });

        if (error) {
            console.error('Error fetching plans:', error);
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error.message,
            });
        }

        return data.map(mapDbPlanToFrontend);
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
                    )
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

            return mapDbPlanToFrontend(data);
        }),

    create: protectedProcedure
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
        .mutation(async ({ ctx, input }) => {
            const newPlan = {
                title: input.title,
                location: input.location,
                description: input.description,
                energy: input.energy,
                tags: input.tags,
                max_attendees: input.maxAttendees,
                starts_at: input.startsAt,
                host_id: ctx.user.id,
                // Additional defaults
                attendees_count: 1,
                price: 'moderate',
                age_range: '18-99',
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
                .select('max_attendees, attendees_count')
                .eq('id', input.id)
                .single();

            if (planError || !plan)
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plan not found',
                });

            if (plan.attendees_count >= plan.max_attendees) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Plan is full',
                });
            }

            const { error: joinError } = await ctx.supabase
                .from('plan_attendees')
                .insert({ plan_id: input.id, user_id: ctx.user.id });

            if (joinError) {
                if (joinError.code === '23505') {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'Already joined',
                    });
                }
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: joinError.message,
                });
            }

            // Increment count in plans table
            const { data: updatedPlan, error: updateError } = await ctx.supabase
                .rpc('increment_attendees', { p_plan_id: input.id }) // We assuming you might have something like this
                .single();

            // If they don't have RPC, we can just do a normal update for now.
            // In a highly concurrent system, this can cause lost updates, but for MVP it's okay.
            if (updateError) {
                await ctx.supabase
                    .from('plans')
                    .update({ attendees_count: plan.attendees_count + 1 })
                    .eq('id', input.id);
            }

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
                tags: z.array(z.string()).optional(),
                maxAttendees: z.number().int().positive().optional(),
                startsAt: z.string().datetime().optional(),
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
            if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
            if (updates.maxAttendees !== undefined)
                dbUpdates.max_attendees = updates.maxAttendees;
            if (updates.startsAt !== undefined)
                dbUpdates.starts_at = updates.startsAt;

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
