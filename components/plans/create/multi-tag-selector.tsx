import { Pressable, StyleSheet, Text, View } from 'react-native';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';

interface MultiTagSelectorProps {
    title: string;
    options: readonly string[];
    selectedTags: string[];
    onChange: (tag: string) => void;
}

export function MultiTagSelector({
    title,
    options,
    selectedTags,
    onChange,
}: MultiTagSelectorProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.tagsContainer}>
                {options.map((tag) => {
                    const isActive = selectedTags.includes(tag);
                    return (
                        <Pressable
                            key={tag}
                            onPress={() => onChange(tag)}
                            style={[
                                styles.tagChip,
                                isActive && styles.tagChipActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tagChipText,
                                    isActive && styles.tagChipTextActive,
                                ]}
                            >
                                {tag}
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
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: noctuaRadii.chip,
        backgroundColor: noctuaColors.surface,
        borderWidth: 1,
        borderColor: noctuaColors.border,
    },
    tagChipActive: {
        backgroundColor: noctuaColors.primary,
        borderColor: noctuaColors.primary,
    },
    tagChipText: {
        color: noctuaColors.textMuted,
        fontSize: 13,
        fontWeight: '600',
    },
    tagChipTextActive: {
        color: '#fff',
    },
});
