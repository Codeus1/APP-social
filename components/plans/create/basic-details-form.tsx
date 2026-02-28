import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useController, type Control } from 'react-hook-form';
import { noctuaColors } from '@/lib/theme/tokens';
import type { PlanFormData } from '@/features/plans/schemas/plan-schema';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BasicDetailsFormProps {
    control: Control<PlanFormData>;
}

// ─── Individual field components using useController ─────────────────────────
// Each subscribes only to its own field value, preventing full re-renders

function TitleField({ control }: BasicDetailsFormProps) {
    const { field, fieldState } = useController({ control, name: 'title' });

    return (
        <>
            <View
                style={[
                    styles.inputRow,
                    fieldState.error ? styles.inputRowError : null,
                ]}
            >
                <AntDesign
                    name="edit"
                    size={16}
                    color={
                        fieldState.error ? '#ff4444' : noctuaColors.textMuted
                    }
                    style={styles.inputIcon}
                />
                <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Plan Title (e.g. Tapas & Sangria)"
                    placeholderTextColor={noctuaColors.textMuted}
                    style={styles.textInput}
                />
            </View>
            {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
            )}
        </>
    );
}

function DescriptionField({ control }: BasicDetailsFormProps) {
    const { field } = useController({ control, name: 'description' });

    return (
        <View style={[styles.inputRow, styles.descriptionRow]}>
            <AntDesign
                name="message"
                size={16}
                color={noctuaColors.textMuted}
                style={styles.inputIcon}
            />
            <TextInput
                value={field.value}
                onChangeText={field.onChange}
                onBlur={field.onBlur}
                placeholder="What's the vibe? What should people expect?"
                placeholderTextColor={noctuaColors.textMuted}
                style={[styles.textInput, styles.descriptionInput]}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
            />
        </View>
    );
}

function LocationField({ control }: BasicDetailsFormProps) {
    const { field, fieldState } = useController({ control, name: 'location' });

    return (
        <>
            <View
                style={[
                    styles.inputRow,
                    fieldState.error ? styles.inputRowError : null,
                ]}
            >
                <AntDesign
                    name="environment"
                    size={16}
                    color={
                        fieldState.error ? '#ff4444' : noctuaColors.textMuted
                    }
                    style={styles.inputIcon}
                />
                <TextInput
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Where? (e.g. El Born, Barcelona)"
                    placeholderTextColor={noctuaColors.textMuted}
                    style={styles.textInput}
                />
            </View>
            {fieldState.error && (
                <Text style={styles.errorText}>{fieldState.error.message}</Text>
            )}
        </>
    );
}

function DateTimeFields({ control }: BasicDetailsFormProps) {
    const { field: dateField } = useController({ control, name: 'date' });
    const { field: timeField } = useController({ control, name: 'time' });

    return (
        <View style={styles.dateTimeRow}>
            <View style={[styles.inputRow, styles.dateInput]}>
                <AntDesign
                    name="calendar"
                    size={16}
                    color={noctuaColors.textMuted}
                    style={styles.inputIcon}
                />
                <TextInput
                    value={dateField.value}
                    onChangeText={dateField.onChange}
                    onBlur={dateField.onBlur}
                    placeholder="Date"
                    placeholderTextColor={noctuaColors.textMuted}
                    style={[styles.textInput, styles.dateTimeInput]}
                />
            </View>
            <View style={[styles.inputRow, styles.timeInput]}>
                <AntDesign
                    name="clock-circle"
                    size={16}
                    color={noctuaColors.textMuted}
                    style={styles.inputIcon}
                />
                <TextInput
                    value={timeField.value}
                    onChangeText={timeField.onChange}
                    onBlur={timeField.onBlur}
                    placeholder="22:00"
                    placeholderTextColor={noctuaColors.textMuted}
                    style={[styles.textInput, styles.dateTimeInput]}
                    keyboardType="numbers-and-punctuation"
                />
            </View>
        </View>
    );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function BasicDetailsForm({ control }: BasicDetailsFormProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>The Basics</Text>
            <TitleField control={control} />
            <DescriptionField control={control} />
            <LocationField control={control} />
            <DateTimeFields control={control} />
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: noctuaColors.surface,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 4,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputRowError: {
        borderColor: '#ff4444',
        backgroundColor: 'rgba(255, 68, 68, 0.05)',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 12,
        marginLeft: 4,
    },
    inputIcon: {
        fontSize: 18,
        marginRight: 10,
    },
    textInput: {
        flex: 1,
        color: noctuaColors.text,
        fontSize: 16,
        paddingVertical: 14,
    },
    descriptionRow: {
        alignItems: 'flex-start',
    },
    descriptionInput: {
        minHeight: 80,
        paddingTop: 14,
    },
    dateTimeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    dateInput: {
        flex: 2,
    },
    timeInput: {
        flex: 1,
    },
    dateTimeInput: {
        textAlign: 'center',
    },
});
