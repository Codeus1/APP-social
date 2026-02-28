import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import { noctuaColors } from '@/lib/theme/tokens';
import type { RecentPlan } from '@/features/user/types';

interface Props {
    plans: RecentPlan[];
}

export function ProfileRecentPlans({ plans }: Props) {
    if (!plans || plans.length === 0) return null;

    return (
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Plans</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllLink}>See all →</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={plans}
                renderItem={({ item }) => (
                    <View style={styles.recentPlanCard}>
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={styles.recentPlanImage}
                        />
                        <View style={styles.recentPlanInfo}>
                            <Text
                                style={styles.recentPlanTitle}
                                numberOfLines={1}
                            >
                                {item.title}
                            </Text>
                            <Text style={styles.recentPlanDate}>
                                {item.date}
                            </Text>
                        </View>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.recentPlansList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: noctuaColors.text,
        marginBottom: 12,
    },
    seeAllLink: {
        fontSize: 14,
        color: noctuaColors.primary,
        fontWeight: '600',
    },
    recentPlansList: {
        gap: 12,
    },
    recentPlanCard: {
        width: 140,
        backgroundColor: noctuaColors.surface,
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: noctuaColors.border,
    },
    recentPlanImage: {
        width: '100%',
        height: 90,
    },
    recentPlanInfo: {
        padding: 10,
    },
    recentPlanTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: noctuaColors.text,
        marginBottom: 2,
    },
    recentPlanDate: {
        fontSize: 11,
        color: noctuaColors.textMuted,
    },
});
