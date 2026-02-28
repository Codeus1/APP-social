import { Pressable, View, Text, StyleSheet } from 'react-native';
import { noctuaColors } from '@/lib/theme/tokens';

interface PlanAttendeesCardProps {
    attendees: number;
    maxAttendees: number;
    onSeeAll: () => void;
}

export function PlanAttendeesCard({
    attendees,
    maxAttendees,
    onSeeAll,
}: PlanAttendeesCardProps) {
    const spotsLeft = maxAttendees - attendees;

    return (
        <View>
            <View style={styles.whosGoingHeader}>
                <Text style={styles.sectionTitle}>{"Who's Going"}</Text>
                <Pressable onPress={onSeeAll} hitSlop={8}>
                    <Text style={styles.seeAll}>See all</Text>
                </Pressable>
            </View>
            <View style={styles.attendeesCard}>
                <View style={styles.avatarStack}>
                    {[0, 1, 2, 3].map((i) => (
                        <View
                            key={i}
                            style={[styles.stackAvatar, { left: i * 22 }]}
                        >
                            <View style={styles.stackAvatarInner} />
                        </View>
                    ))}
                    {attendees > 4 && (
                        <View
                            style={[
                                styles.stackAvatar,
                                styles.stackAvatarMore,
                                { left: 4 * 22 },
                            ]}
                        >
                            <Text style={styles.stackAvatarMoreText}>
                                +{attendees - 4}
                            </Text>
                        </View>
                    )}
                </View>
                <View style={styles.attendeesInfo}>
                    <Text style={styles.confirmedText}>
                        {attendees} Confirmed
                    </Text>
                    <Text style={styles.spotsText}>{spotsLeft} spots left</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    sectionTitle: {
        color: noctuaColors.text,
        fontSize: 18,
        fontWeight: '800',
        marginTop: 8,
    },
    whosGoingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 8,
    },
    seeAll: {
        color: noctuaColors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    attendeesCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: noctuaColors.surface,
        borderRadius: 18,
        padding: 14,
        gap: 16,
    },
    avatarStack: {
        flexDirection: 'row',
        height: 36,
        width: 130,
        position: 'relative',
    },
    stackAvatar: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: noctuaColors.surface,
        overflow: 'hidden',
    },
    stackAvatarInner: {
        flex: 1,
        backgroundColor: noctuaColors.surfaceSoft,
    },
    stackAvatarMore: {
        backgroundColor: noctuaColors.backgroundSoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stackAvatarMoreText: {
        color: noctuaColors.text,
        fontSize: 11,
        fontWeight: '700',
    },
    attendeesInfo: {
        gap: 2,
    },
    confirmedText: {
        color: noctuaColors.text,
        fontSize: 16,
        fontWeight: '800',
    },
    spotsText: {
        color: noctuaColors.textMuted,
        fontSize: 13,
    },
});
