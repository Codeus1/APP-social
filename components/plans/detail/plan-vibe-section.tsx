import { View, Text, StyleSheet } from 'react-native';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { formatEnergy, formatPrice } from '@/components/plans/plan-helpers';
import type { EnergyLevel, PriceRange } from '@/features/plans/constants';

interface PlanVibeSectionProps {
    energy: EnergyLevel | string;
    price: PriceRange | string;
    ageRange: string;
}

export function PlanVibeSection({
    energy,
    price,
    ageRange,
}: PlanVibeSectionProps) {
    return (
        <View>
            <Text style={styles.sectionTitle}>Group Vibe</Text>
            <View style={styles.vibeRow}>
                <View style={styles.vibeChip}>
                    <Text style={styles.vibeChipText}>
                        {formatEnergy(energy as EnergyLevel)}
                    </Text>
                </View>
                <View style={styles.vibeChip}>
                    <Text style={styles.vibeChipText}>
                        {formatPrice(price as PriceRange)}
                    </Text>
                </View>
                <View style={styles.vibeChip}>
                    <Text style={styles.vibeChipText}>{ageRange}</Text>
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
        marginBottom: 12,
    },
    vibeRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    vibeChip: {
        borderRadius: noctuaRadii.chip,
        borderWidth: 1,
        borderColor: noctuaColors.border,
        paddingHorizontal: 14,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    vibeChipText: {
        color: noctuaColors.text,
        fontSize: 13,
        fontWeight: '600',
    },
});
