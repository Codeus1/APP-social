import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { noctuaColors } from '@/lib/theme/tokens';

interface SafetyToggleProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export function SafetyToggle({ value, onChange }: SafetyToggleProps) {
    return (
        <View style={styles.section}>
            <View style={styles.toggleContainer}>
                <View style={styles.toggleIconBox}>
                    <AntDesign
                        name="safety"
                        size={18}
                        color={noctuaColors.primary}
                    />
                </View>
                <View style={styles.toggleTextContainer}>
                    <Text style={styles.toggleTitle}>Approval Required</Text>
                    <Text style={styles.toggleSubtitle}>
                        Curate your crowd for safety
                    </Text>
                </View>
                <Pressable
                    onPress={() => onChange(!value)}
                    style={[
                        styles.toggleSwitch,
                        value && styles.toggleSwitchActive,
                    ]}
                >
                    <View
                        style={[
                            styles.toggleKnob,
                            value && styles.toggleKnobActive,
                        ]}
                    />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: noctuaColors.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    toggleIconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(244, 37, 140, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    toggleTextContainer: {
        flex: 1,
    },
    toggleTitle: {
        color: noctuaColors.text,
        fontSize: 14,
        fontWeight: '600',
    },
    toggleSubtitle: {
        color: noctuaColors.textMuted,
        fontSize: 12,
        marginTop: 2,
    },
    toggleSwitch: {
        width: 44,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 2,
    },
    toggleSwitchActive: {
        backgroundColor: noctuaColors.primary,
    },
    toggleKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    toggleKnobActive: {
        alignSelf: 'flex-end',
    },
});
