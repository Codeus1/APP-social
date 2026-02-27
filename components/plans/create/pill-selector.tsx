import { Pressable, StyleSheet, Text, View } from 'react-native';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';

interface BaseOption {
    id: string;
    label: string;
    emoji?: string;
}

interface PillSelectorProps<T extends BaseOption> {
    title: string;
    options: readonly T[];
    value: T['id'];
    onChange: (value: T['id']) => void;
}

export function PillSelector<T extends BaseOption>({
    title,
    options,
    value,
    onChange,
}: PillSelectorProps<T>) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.chipRow}>
                {options.map((option) => {
                    const isActive = value === option.id;
                    return (
                        <Pressable
                            key={option.id}
                            onPress={() => onChange(option.id)}
                            style={[styles.chip, isActive && styles.chipActive]}
                        >
                            <Text
                                style={[
                                    styles.chipText,
                                    isActive && styles.chipTextActive,
                                ]}
                            >
                                {option.emoji ? `${option.emoji} ` : ''}
                                {option.label}
                            </Text>
                        </Pressable>
                    );
                })}
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
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: noctuaRadii.chip,
        backgroundColor: noctuaColors.surface,
        borderWidth: 1,
        borderColor: noctuaColors.border,
    },
    chipActive: {
        backgroundColor: noctuaColors.primary,
        borderColor: noctuaColors.primary,
    },
    chipText: {
        color: noctuaColors.textMuted,
        fontSize: 14,
        fontWeight: '600',
    },
    chipTextActive: {
        color: '#fff',
    },
});
