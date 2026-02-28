import { Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { noctuaColors } from '@/lib/theme/tokens';

export interface ActivityOption {
    id: string;
    label: string;
    icon: string;
}

interface ActivitySelectorProps<T extends string> {
    options: readonly { id: T; label: string; icon: string }[];
    value: T;
    onChange: (value: T) => void;
}

export function ActivitySelector<T extends string>({
    options,
    value,
    onChange,
}: ActivitySelectorProps<T>) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>What&apos;s the move?</Text>
            <View style={styles.activityContainer}>
                {options.map((activity) => {
                    const isActive = value === activity.id;
                    return (
                        <Pressable
                            key={activity.id}
                            onPress={() => onChange(activity.id)}
                            style={[
                                styles.activityItem,
                                isActive && styles.activityItemActive,
                            ]}
                        >
                            <View
                                style={[
                                    styles.activityIconBox,
                                    isActive && styles.activityIconBoxActive,
                                ]}
                            >
                                <AntDesign
                                    name={
                                        activity.id === 'drinks'
                                            ? 'appstore'
                                            : activity.id === 'dance'
                                              ? 'play-circle'
                                              : activity.id === 'dinner'
                                                ? 'profile'
                                                : 'calendar'
                                    }
                                    size={16}
                                    color={
                                        isActive
                                            ? noctuaColors.text
                                            : noctuaColors.textMuted
                                    }
                                />
                            </View>
                            <Text
                                style={[
                                    styles.activityLabel,
                                    isActive && styles.activityLabelActive,
                                ]}
                            >
                                {activity.label}
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
    activityContainer: {
        flexDirection: 'row',
        paddingVertical: 4,
        gap: 12,
    },
    activityItem: {
        alignItems: 'center',
        minWidth: 72,
    },
    activityItemActive: {
        // Active state styling handled by child elements
    },
    activityIconBox: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: noctuaColors.surface,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
    },
    activityIconBoxActive: {
        backgroundColor: noctuaColors.primary,
        borderWidth: 0,
        ...Platform.select({
            web: {
                boxShadow: `0px 0px 12px ${noctuaColors.primary}66`,
            },
            default: {
                shadowColor: noctuaColors.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.4,
                shadowRadius: 12,
            },
        }),
        elevation: 8,
    },
    activityLabel: {
        color: noctuaColors.textMuted,
        fontSize: 12,
        fontWeight: '500',
    },
    activityLabelActive: {
        color: noctuaColors.text,
    },
});
