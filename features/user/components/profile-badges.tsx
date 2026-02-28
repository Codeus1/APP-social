import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { noctuaColors } from '@/lib/theme/tokens';
import type { UserBadge } from '@/features/user/types';

interface Props {
    badges: UserBadge[];
}

export function ProfileBadges({ badges }: Props) {
    if (!badges || badges.length === 0) return null;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <FlatList
                data={badges}
                renderItem={({ item }) => (
                    <View style={styles.badgeItem}>
                        <View style={styles.badgeIconContainer}>
                            <Text style={styles.badgeIcon}>{item.icon}</Text>
                        </View>
                        <Text style={styles.badgeName} numberOfLines={1}>
                            {item.name}
                        </Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.badgesList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: noctuaColors.text,
        marginBottom: 12,
    },
    badgesList: {
        gap: 12,
    },
    badgeItem: {
        alignItems: 'center',
        width: 80,
    },
    badgeIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: noctuaColors.surface,
        borderWidth: 1,
        borderColor: noctuaColors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    badgeIcon: {
        fontSize: 28,
    },
    badgeName: {
        fontSize: 11,
        color: noctuaColors.textMuted,
        textAlign: 'center',
    },
});
