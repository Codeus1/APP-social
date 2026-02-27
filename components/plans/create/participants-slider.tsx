import { Pressable, StyleSheet, Text, View } from 'react-native';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';

interface ParticipantsSliderProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export function ParticipantsSlider({
    value,
    onChange,
    min = 2,
    max = 50,
}: ParticipantsSliderProps) {
    return (
        <View style={styles.section}>
            <View style={styles.sliderHeader}>
                <Text style={styles.sectionTitle}>Max Participants</Text>
                <View style={styles.sliderValueBadge}>
                    <Text style={styles.sliderValueText}>{value} People</Text>
                </View>
            </View>
            <View style={styles.sliderContainer}>
                <View style={styles.sliderTrack}>
                    <View
                        style={[
                            styles.sliderFill,
                            {
                                width: `${((value - min) / (max - min)) * 100}%`,
                            },
                        ]}
                    />
                </View>
                <View style={styles.sliderButtons}>
                    <Pressable
                        onPress={() => onChange(Math.max(min, value - 1))}
                        style={styles.sliderButton}
                    >
                        <Text style={styles.sliderButtonText}>−</Text>
                    </Pressable>
                    <Text style={styles.sliderValue}>{value}</Text>
                    <Pressable
                        onPress={() => onChange(Math.min(max, value + 1))}
                        style={styles.sliderButton}
                    >
                        <Text style={styles.sliderButtonText}>+</Text>
                    </Pressable>
                </View>
            </View>
            <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>{min}</Text>
                <Text style={styles.sliderLabel}>{max}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: noctuaColors.text,
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sliderValueBadge: {
        backgroundColor: noctuaColors.primary,
        paddingVertical: 4,
        paddingHorizontal: 12,
        borderRadius: noctuaRadii.chip,
    },
    sliderValueText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    sliderContainer: {
        backgroundColor: noctuaColors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    sliderTrack: {
        height: 4,
        backgroundColor: noctuaColors.background,
        borderRadius: 2,
        marginBottom: 16,
    },
    sliderFill: {
        height: '100%',
        backgroundColor: noctuaColors.primary,
        borderRadius: 2,
    },
    sliderButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sliderButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: noctuaColors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sliderButtonText: {
        color: noctuaColors.text,
        fontSize: 24,
        fontWeight: '300',
    },
    sliderValue: {
        color: noctuaColors.text,
        fontSize: 24,
        fontWeight: '700',
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    sliderLabel: {
        color: noctuaColors.textMuted,
        fontSize: 12,
        fontWeight: '500',
    },
});
