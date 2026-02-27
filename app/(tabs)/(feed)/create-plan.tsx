import { useState, useEffect } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import {
    useCreatePlan,
    useUpdatePlan,
    usePlanQuery,
} from '@/features/plans/hooks';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ActivitySelector } from '@/components/plans/create/activity-selector';
import { BasicDetailsForm } from '@/components/plans/create/basic-details-form';
import { PillSelector } from '@/components/plans/create/pill-selector';
import { MultiTagSelector } from '@/components/plans/create/multi-tag-selector';
import { ParticipantsSlider } from '@/components/plans/create/participants-slider';
import { SafetyToggle } from '@/components/plans/create/safety-toggle';
import { CoverImagePicker } from '@/components/plans/create/cover-image-picker';

// Activity type options
const ACTIVITY_TYPES = [
    { id: 'drinks', label: 'Drinks', icon: 'DR' },
    { id: 'dance', label: 'Dance', icon: 'DA' },
    { id: 'dinner', label: 'Dinner', icon: 'DI' },
    { id: 'event', label: 'Event', icon: 'EV' },
] as const;

// Energy level options
const ENERGY_LEVELS = [
    { id: 'low', label: 'Chill', emoji: 'LOW' },
    { id: 'medium', label: 'Social', emoji: 'MID' },
    { id: 'high', label: 'High Energy', emoji: 'HIGH' },
] as const;

// Price range options
const PRICE_RANGES = [
    { id: 'cheap', label: '€ Cheap' },
    { id: 'moderate', label: '€€ Moderate' },
    { id: 'expensive', label: '€€€ Expensive' },
] as const;

// Tag options
const TAG_OPTIONS = [
    'Techno',
    'Jazz',
    'Rooftop',
    'Cocktails',
    'Dancing',
    'Food',
    'Wine',
    'Speakeasy',
] as const;

// Age range options
const AGE_RANGES = ['18-25', '25-30', '30-35', '35+'] as const;

type EnergyLevel = (typeof ENERGY_LEVELS)[number]['id'];
type PriceRange = (typeof PRICE_RANGES)[number]['id'];
type ActivityType = (typeof ACTIVITY_TYPES)[number]['id'];

export default function CreatePlanScreen() {
    const { editId } = useLocalSearchParams<{ editId?: string }>();
    const isEditMode = !!editId;

    const { data: existingPlan, isLoading: isFetchingPlan } =
        usePlanQuery(editId);

    const createPlanMutation = useCreatePlan();
    const updatePlanMutation = useUpdatePlan();

    // Form state
    const [activityType, setActivityType] = useState<ActivityType>('drinks');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('Tonight');
    const [time, setTime] = useState('22:00');
    const [energy, setEnergy] = useState<EnergyLevel>('medium');
    const [price, setPrice] = useState<PriceRange>('moderate');
    const [maxAttendees, setMaxAttendees] = useState(6);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [ageRange, setAgeRange] = useState<string>('25-30');
    const [approvalRequired, setApprovalRequired] = useState(true);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    // Populate state if editing
    useEffect(() => {
        if (isEditMode && existingPlan) {
            setTitle(existingPlan.title);
            setDescription(existingPlan.description);
            setLocation(existingPlan.location);
            setEnergy(existingPlan.energy as EnergyLevel);
            setPrice(existingPlan.price as PriceRange);
            setMaxAttendees(existingPlan.maxAttendees);
            setSelectedTags(existingPlan.tags);
            setAgeRange(existingPlan.ageRange);

            // Basic date parsing for the demo (we'll just set it to 'Tonight' for simplicity here)
            // In a real app we'd parse existingPlan.startsAt properly.
        }
    }, [isEditMode, existingPlan]);

    // Validation
    const isFormValid = title.trim().length > 0 && location.trim().length > 0;

    // Toggle tag selection
    const toggleTag = (tag: string) => {
        setSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
        );
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!isFormValid) {
            Alert.alert(
                'Missing Fields',
                'Please fill in the title and location.',
            );
            return;
        }

        // Create datetime for tonight at selected time
        const now = new Date();
        const [hours, minutes] = time.split(':').map(Number);
        const startsAt = new Date(now);
        startsAt.setHours(hours, minutes, 0, 0);
        // If the time has passed today, set it for tomorrow
        if (startsAt <= now) {
            startsAt.setDate(startsAt.getDate() + 1);
        }

        try {
            if (isEditMode) {
                await updatePlanMutation.mutateAsync({
                    id: editId!,
                    title: title.trim(),
                    location: location.trim(),
                    description: description.trim(),
                    energy,
                    tags: selectedTags,
                    maxAttendees,
                    // If unchanged, it sends tonight's date. Good enough for simple CRUD demo.
                    startsAt: startsAt.toISOString(),
                });

                Alert.alert(
                    'Plan Updated!',
                    `Your plan "${title}" has been updated.`,
                    [
                        {
                            text: 'View Plan',
                            onPress: () => router.replace(`/plan/${editId}`),
                        },
                    ],
                );
            } else {
                const result = await createPlanMutation.mutateAsync({
                    title: title.trim(),
                    location: location.trim(),
                    description: description.trim(),
                    energy,
                    tags: selectedTags,
                    maxAttendees,
                    startsAt: startsAt.toISOString(),
                });

                Alert.alert(
                    'Plan Created!',
                    `Your plan "${title}" has been published.`,
                    [
                        {
                            text: 'View Plan',
                            onPress: () => {
                                if (result && result.id) {
                                    router.replace(`/plan/${result.id}`);
                                } else {
                                    router.replace('/');
                                }
                            },
                        },
                        {
                            text: 'Create Another',
                            style: 'cancel',
                        },
                    ],
                );
            }
        } catch {
            Alert.alert(
                'Error',
                `Failed to ${isEditMode ? 'update' : 'create'} plan. Please try again.`,
            );
        }
    };

    // Show empty screen or loading while fetching edit plan
    if (isEditMode && isFetchingPlan) {
        return (
            <ScreenContainer>
                <Text style={{ color: 'white', padding: 20 }}>Loading...</Text>
            </ScreenContainer>
        );
    }

    return (
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Pressable
                            onPress={() => router.back()}
                            style={styles.backButton}
                            hitSlop={8}
                        >
                            <AntDesign
                                name="arrow-left"
                                size={20}
                                color={noctuaColors.text}
                            />
                        </Pressable>
                        <Text style={styles.headerTitle}>Create a Plan</Text>
                        <View style={styles.headerRight} />
                    </View>

                    {/* Page Title */}
                    <View style={styles.titleBlock}>
                        <Text style={styles.pageTitle}>
                            {isEditMode ? 'Edit Plan' : "Let's make a plan"}
                        </Text>
                        <Text style={styles.pageSubtitle}>
                            {isEditMode
                                ? 'Update the details below.'
                                : 'Create a vibe for tonight.'}
                        </Text>
                    </View>

                    {/* Modular Form Components */}
                    <CoverImagePicker
                        imageUrl={imageUrl}
                        onChange={setImageUrl}
                    />

                    <ActivitySelector
                        options={ACTIVITY_TYPES}
                        value={activityType}
                        onChange={setActivityType}
                    />

                    <BasicDetailsForm
                        title={title}
                        description={description}
                        location={location}
                        date={date}
                        time={time}
                        onTitleChange={setTitle}
                        onDescriptionChange={setDescription}
                        onLocationChange={setLocation}
                        onDateChange={setDate}
                        onTimeChange={setTime}
                    />

                    <PillSelector
                        title="Energy Level"
                        options={ENERGY_LEVELS}
                        value={energy}
                        onChange={setEnergy}
                    />

                    <PillSelector
                        title="Price Range"
                        options={PRICE_RANGES}
                        value={price}
                        onChange={setPrice}
                    />

                    <ParticipantsSlider
                        value={maxAttendees}
                        onChange={setMaxAttendees}
                    />

                    <MultiTagSelector
                        title="Tags"
                        options={TAG_OPTIONS}
                        selectedTags={selectedTags}
                        onChange={toggleTag}
                    />

                    <PillSelector
                        title="Age Range"
                        options={AGE_RANGES.map((age) => ({
                            id: age,
                            label: age,
                        }))}
                        value={ageRange}
                        onChange={setAgeRange}
                    />

                    <SafetyToggle
                        value={approvalRequired}
                        onChange={setApprovalRequired}
                    />

                    {/* Submit Button */}
                    <Pressable
                        onPress={handleSubmit}
                        disabled={
                            !isFormValid ||
                            createPlanMutation.isPending ||
                            updatePlanMutation.isPending
                        }
                        style={[
                            styles.submitButton,
                            (!isFormValid ||
                                createPlanMutation.isPending ||
                                updatePlanMutation.isPending) &&
                                styles.submitButtonDisabled,
                        ]}
                    >
                        <Text style={styles.submitButtonText}>
                            {isEditMode
                                ? updatePlanMutation.isPending
                                    ? 'Saving...'
                                    : 'Save Changes'
                                : createPlanMutation.isPending
                                  ? 'Creating...'
                                  : 'Publish Plan'}
                        </Text>
                        <Text style={styles.submitButtonArrow}>→</Text>
                    </Pressable>

                    {/* Bottom padding */}
                    <View style={styles.bottomPadding} />
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    keyboardAvoid: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingTop: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(54, 26, 39, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        color: noctuaColors.text,
        fontSize: 20,
        fontWeight: '600',
    },
    headerTitle: {
        color: noctuaColors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    headerRight: {
        width: 40,
    },
    titleBlock: {
        marginBottom: 24,
    },
    pageTitle: {
        color: noctuaColors.text,
        fontSize: 28,
        fontWeight: '800',
    },
    pageSubtitle: {
        color: noctuaColors.textMuted,
        fontSize: 14,
        marginTop: 4,
    },
    submitButton: {
        backgroundColor: noctuaColors.primary,
        borderRadius: noctuaRadii.button,
        paddingVertical: 18,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: noctuaColors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    submitButtonDisabled: {
        backgroundColor: noctuaColors.surface,
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    submitButtonArrow: {
        color: '#fff',
        fontSize: 18,
        marginLeft: 8,
    },
    bottomPadding: {
        height: 40,
    },
});
