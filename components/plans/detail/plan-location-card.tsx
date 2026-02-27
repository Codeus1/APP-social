import { View, Text, StyleSheet } from 'react-native';
import { noctuaColors } from '@/lib/theme/tokens';

interface PlanLocationCardProps {
    location: string;
    distance?: string;
}

export function PlanLocationCard({
    location,
    distance,
}: PlanLocationCardProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationCard}>
                <View style={styles.locationPlaceholder}>
                    <View style={styles.locationPin} />
                    <Text style={styles.locationName}>{location}</Text>
                </View>
            </View>
            <Text style={styles.locationAddress}>
                {location} {distance ? `• ${distance}` : ''}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 16,
    },
    sectionTitle: {
        color: noctuaColors.text,
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 8,
    },
    locationCard: {
        backgroundColor: noctuaColors.surface,
        borderRadius: 18,
        height: 100,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    locationPlaceholder: {
        alignItems: 'center',
        gap: 6,
    },
    locationPin: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: noctuaColors.primary,
        opacity: 0.5,
    },
    locationName: {
        color: noctuaColors.text,
        fontSize: 13,
        fontWeight: '600',
        backgroundColor: noctuaColors.backgroundSoft,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    locationAddress: {
        color: noctuaColors.textMuted,
        fontSize: 13,
        marginTop: 8,
    },
});
