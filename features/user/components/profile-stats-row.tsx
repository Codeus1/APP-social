import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { noctuaColors } from '@/lib/theme/tokens';

interface Props {
    plansHosted: number;
    plansJoined: number;
    connections: number;
}

export function ProfileStatsRow({
    plansHosted,
    plansJoined,
    connections,
}: Props) {
    return (
        <View style={styles.statsRow}>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{plansHosted}</Text>
                <Text style={styles.statLabel}>Plans Hosted</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{plansJoined}</Text>
                <Text style={styles.statLabel}>Plans Joined</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>{connections}</Text>
                <Text style={styles.statLabel}>Connections</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statsRow: {
        flexDirection: 'row',
        backgroundColor: noctuaColors.surface,
        borderRadius: 16,
        marginHorizontal: 20,
        marginTop: 24,
        paddingVertical: 20,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: noctuaColors.text,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: noctuaColors.textMuted,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: noctuaColors.border,
        alignSelf: 'center',
    },
});
