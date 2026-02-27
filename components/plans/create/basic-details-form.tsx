import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { noctuaColors } from '@/lib/theme/tokens';

interface BasicDetailsFormProps {
    title: string;
    description: string;
    location: string;
    date: string;
    time: string;
    onTitleChange: (text: string) => void;
    onDescriptionChange: (text: string) => void;
    onLocationChange: (text: string) => void;
    onDateChange: (text: string) => void;
    onTimeChange: (text: string) => void;
}

export function BasicDetailsForm({
    title,
    description,
    location,
    date,
    time,
    onTitleChange,
    onDescriptionChange,
    onLocationChange,
    onDateChange,
    onTimeChange,
}: BasicDetailsFormProps) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>The Basics</Text>

            {/* Title Input */}
            <View style={styles.inputRow}>
                <AntDesign
                    name="edit"
                    size={16}
                    color={noctuaColors.textMuted}
                    style={styles.inputIcon}
                />
                <TextInput
                    value={title}
                    onChangeText={onTitleChange}
                    placeholder="Plan Title (e.g. Tapas & Sangria)"
                    placeholderTextColor={noctuaColors.textMuted}
                    style={styles.textInput}
                />
            </View>

            {/* Description Input */}
            <View style={[styles.inputRow, styles.descriptionRow]}>
                <AntDesign
                    name="message"
                    size={16}
                    color={noctuaColors.textMuted}
                    style={styles.inputIcon}
                />
                <TextInput
                    value={description}
                    onChangeText={onDescriptionChange}
                    placeholder="What's the vibe? What should people expect?"
                    placeholderTextColor={noctuaColors.textMuted}
                    style={[styles.textInput, styles.descriptionInput]}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                />
            </View>

            {/* Location Input */}
            <View style={styles.inputRow}>
                <AntDesign
                    name="environment"
                    size={16}
                    color={noctuaColors.textMuted}
                    style={styles.inputIcon}
                />
                <TextInput
                    value={location}
                    onChangeText={onLocationChange}
                    placeholder="Where? (e.g. El Born, Barcelona)"
                    placeholderTextColor={noctuaColors.textMuted}
                    style={styles.textInput}
                />
            </View>

            {/* Date & Time Row */}
            <View style={styles.dateTimeRow}>
                <View style={[styles.inputRow, styles.dateInput]}>
                    <AntDesign
                        name="calendar"
                        size={16}
                        color={noctuaColors.textMuted}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        value={date}
                        onChangeText={onDateChange}
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
                        value={time}
                        onChangeText={onTimeChange}
                        placeholder="Time"
                        placeholderTextColor={noctuaColors.textMuted}
                        style={[styles.textInput, styles.dateTimeInput]}
                        keyboardType="numbers-and-punctuation"
                    />
                </View>
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
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: noctuaColors.surface,
        borderRadius: 16,
        paddingHorizontal: 14,
        paddingVertical: 4,
        marginBottom: 12,
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
