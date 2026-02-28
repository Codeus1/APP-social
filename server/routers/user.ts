import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const userRouter = router({
    getProfile: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.user.id;

        // Fetch hosted count
        const { count: plansHosted } = await ctx.supabase
            .from('plans')
            .select('*', { count: 'exact', head: true })
            .eq('host_id', userId);

        // Fetch joined count
        const { count: plansJoined } = await ctx.supabase
            .from('plan_attendees')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        // Fetch connections count (followers + following where status might be accepted)
        const { count: followersCount } = await ctx.supabase
            .from('connections')
            .select('*', { count: 'exact', head: true })
            .eq('following_id', userId)
            .eq('status', 'accepted');

        const { count: followingCount } = await ctx.supabase
            .from('connections')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', userId)
            .eq('status', 'accepted');

        const connections = (followersCount || 0) + (followingCount || 0);

        // Fetch recent plans
        const { data: recentPlansDb, error: recentPlansError } =
            await ctx.supabase
                .from('plan_attendees')
                .select('joined_at, plans(id, title, image_url, starts_at)')
                .eq('user_id', userId)
                .order('joined_at', { ascending: false })
                .limit(5);

        const recentPlans = (recentPlansDb || []).map((p: any) => ({
            id: p.plans.id,
            title: p.plans.title,
            imageUrl:
                p.plans.image_url ||
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
            date: p.plans.starts_at
                ? new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                  }).format(new Date(p.plans.starts_at))
                : 'TBD',
        }));

        // Fetch badges
        const { data: profileBadges } = await ctx.supabase
            .from('profile_badges')
            .select('earned_at, badges(id, name, icon, description)')
            .eq('profile_id', userId);

        const badges = (profileBadges || []).map((pb: any) => ({
            id: pb.badges.id,
            name: pb.badges.name,
            icon: pb.badges.icon,
            description: pb.badges.description,
        }));

        // Fetch reviews
        const { data: reviewsDb } = await ctx.supabase
            .from('reviews')
            .select(
                'id, rating, text, created_at, profiles!reviews_reviewer_id_fkey(name, avatar_url)',
            )
            .eq('reviewed_user_id', userId)
            .order('created_at', { ascending: false })
            .limit(5);

        const reviews = (reviewsDb || []).map((r: any) => ({
            id: r.id,
            reviewerName: r.profiles?.name || 'Unknown',
            reviewerAvatarUrl:
                r.profiles?.avatar_url || 'https://i.pravatar.cc/150',
            rating: r.rating,
            text: r.text,
            createdAt: r.created_at
                ? new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      year: 'numeric',
                  }).format(new Date(r.created_at))
                : 'TBD',
        }));

        return {
            stats: {
                plansHosted: plansHosted || 0,
                plansJoined: plansJoined || 0,
                connections,
            },
            recentPlans,
            badges,
            reviews,
        };
    }),
});
