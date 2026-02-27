import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

import {
    usePlanQuery,
    useJoinPlan,
    useDeletePlan,
    useJoinRequestsQuery,
    useRespondToJoinRequest,
} from '@/features/plans/hooks';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { useAuth } from '@/lib/auth/auth-context';

import { PlanHeaderImage } from '@/components/plans/detail/plan-header-image';
import { PlanHostCard } from '@/components/plans/detail/plan-host-card';
import { PlanVibeSection } from '@/components/plans/detail/plan-vibe-section';
import { PlanPendingRequests } from '@/components/plans/detail/plan-pending-requests';
import { PlanAttendeesCard } from '@/components/plans/detail/plan-attendees-card';
import { PlanLocationCard } from '@/components/plans/detail/plan-location-card';
import { PlanJoinCta } from '@/components/plans/detail/plan-join-cta';

export default function PlanDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: plan } = usePlanQuery(id);
    const joinPlanMutation = useJoinPlan();
    const deletePlanMutation = useDeletePlan();
    const respondRequestMutation = useRespondToJoinRequest();

    const { user: authUser } = useAuth();
    const isHost = authUser?.id === plan?.host?.id;

    // Only fetch join requests if we are the host
    const { data: joinRequests } = useJoinRequestsQuery(isHost ? id : '');

    if (!plan) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centered}>
                    <Text style={styles.notFoundText}>Plan not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    const spotsLeft = plan.maxAttendees - plan.attendees;
    const isFull = spotsLeft <= 0;

    const handleJoin = async () => {
        try {
            await joinPlanMutation.mutateAsync({ id: plan.id });
        } catch {
            // handled quietly or could show alert
        }
    };

    const handleDelete = async () => {
        try {
            await deletePlanMutation.mutateAsync({ id: plan.id });
            router.replace('/(tabs)/(feed)');
        } catch {
            // handled quietly
        }
    };

    const handleEdit = () => {
        router.push({
            pathname: '/(tabs)/(feed)/create-plan',
            params: { editId: plan.id },
        });
    };

    const handleRespondRequest = (
        requestId: string,
        userId: string,
        status: 'accepted' | 'declined',
    ) => {
        respondRequestMutation.mutate({
            planId: id,
            requestId,
            userId,
            status,
        });
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Hero image and logic */}
                <PlanHeaderImage
                    imageUrl={plan.imageUrl}
                    isHost={isHost}
                    isDeleting={deletePlanMutation.isPending}
                    onBack={() => router.back()}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

                <View style={styles.body}>
                    {/* Tags below image */}
                    <View style={styles.topTags}>
                        {plan.isHappeningNow && (
                            <View style={styles.tonightChip}>
                                <Text style={styles.tonightChipText}>
                                    TONIGHT
                                </Text>
                            </View>
                        )}
                        {plan.tags.slice(0, 2).map((tag: string) => (
                            <View key={tag} style={styles.tagChip}>
                                <Text style={styles.tagChipText}>{tag}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{plan.title}</Text>

                    {/* Time + Location */}
                    <View style={styles.metaRow}>
                        <AntDesign
                            name="clock-circle"
                            size={16}
                            color={noctuaColors.textMuted}
                        />
                        <Text style={styles.metaText}>{plan.startsAt}</Text>
                        <Text style={styles.metaDot}>•</Text>
                        <AntDesign
                            name="environment"
                            size={16}
                            color={noctuaColors.textMuted}
                        />
                        <Text style={styles.metaText}>{plan.location}</Text>
                    </View>

                    {/* Host card */}
                    <PlanHostCard
                        host={plan.host}
                        matchPercentage={plan.matchPercentage}
                    />

                    {/* The Plan section */}
                    <Text style={styles.sectionTitle}>The Plan</Text>
                    <Text style={styles.description}>{plan.description}</Text>

                    {/* Group Vibe */}
                    <PlanVibeSection
                        energy={plan.energy}
                        price={plan.price}
                        ageRange={plan.ageRange}
                    />

                    {/* Who's Going */}
                    <PlanAttendeesCard
                        attendees={plan.attendees}
                        maxAttendees={plan.maxAttendees}
                    />

                    {/* Pending Requests (Host Only) */}
                    {isHost && (
                        <PlanPendingRequests
                            requests={joinRequests || []}
                            onRespond={handleRespondRequest}
                        />
                    )}

                    {/* Location section */}
                    <PlanLocationCard
                        location={plan.location}
                        distance={plan.distance}
                    />
                </View>
            </ScrollView>

            {/* Bottom CTA */}
            <PlanJoinCta
                isFull={isFull}
                isPendingNetwork={joinPlanMutation.isPending}
                userJoinStatus={plan.userJoinStatus}
                onJoin={handleJoin}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: noctuaColors.background,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notFoundText: {
        color: noctuaColors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    body: {
        padding: 20,
        gap: 12,
    },
    topTags: {
        flexDirection: 'row',
        gap: 8,
    },
    tonightChip: {
        backgroundColor: noctuaColors.primary,
        borderRadius: noctuaRadii.chip,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tonightChipText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    tagChip: {
        backgroundColor: noctuaColors.surface,
        borderRadius: noctuaRadii.chip,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tagChipText: {
        color: noctuaColors.text,
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        color: noctuaColors.text,
        fontSize: 28,
        fontWeight: '800',
        lineHeight: 34,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        color: noctuaColors.textMuted,
        fontSize: 14,
        fontWeight: '500',
    },
    metaDot: {
        color: noctuaColors.textMuted,
        marginHorizontal: 4,
    },
    sectionTitle: {
        color: noctuaColors.text,
        fontSize: 18,
        fontWeight: '800',
        marginTop: 8,
    },
    description: {
        color: noctuaColors.textMuted,
        fontSize: 15,
        lineHeight: 22,
    },
});
