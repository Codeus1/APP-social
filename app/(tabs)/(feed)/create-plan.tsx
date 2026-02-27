import { useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller } from 'react-hook-form';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';
import { ActivitySelector } from '@/components/plans/create/activity-selector';
import { BasicDetailsForm } from '@/components/plans/create/basic-details-form';
import { PillSelector } from '@/components/plans/create/pill-selector';
import { MultiTagSelector } from '@/components/plans/create/multi-tag-selector';
import { ParticipantsSlider } from '@/components/plans/create/participants-slider';
import { SafetyToggle } from '@/components/plans/create/safety-toggle';
import { CoverImagePicker } from '@/components/plans/create/cover-image-picker';
import { usePlanQuery } from '@/features/plans/hooks';
import { useCreatePlanForm } from '@/features/plans/hooks/useCreatePlanForm';
import {
    ACTIVITY_TYPES,
    ENERGY_LEVELS,
    PRICE_RANGES,
    TAG_OPTIONS,
    AGE_RANGES,
    EnergyLevel,
    PriceRange,
} from '@/features/plans/constants';

export default function CreatePlanScreen() {
    const { editId } = useLocalSearchParams<{ editId?: string }>();
    const isEditMode = !!editId;

    const { data: existingPlan, isLoading: isFetchingPlan } =
        usePlanQuery(editId);

    const { form, onSubmit, isSubmitting } = useCreatePlanForm({ editId });
    const {
        control,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = form;

    const formValues = watch();

    // Populate state if editing
    useEffect(() => {
        if (isEditMode && existingPlan) {
            reset({
                title: existingPlan.title,
                description: existingPlan.description,
                location: existingPlan.location,
                energy: existingPlan.energy as EnergyLevel,
                price: existingPlan.price as PriceRange,
                activityType: 'drinks',
                maxAttendees: existingPlan.maxAttendees,
                tags: existingPlan.tags,
                ageRange: existingPlan.ageRange,
                date: 'Tonight',
                time: '22:00',
                approvalRequired: true,
                imageUrl: null,
            });
        }
    }, [isEditMode, existingPlan, reset]);

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

                    {/* Modular Form Components using Controllers */}
                    <Controller
                        control={control}
                        name="imageUrl"
                        render={({ field }) => (
                            <CoverImagePicker
                                imageUrl={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="activityType"
                        render={({ field }) => (
                            <ActivitySelector
                                options={ACTIVITY_TYPES}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <BasicDetailsForm
                        title={formValues.title}
                        description={formValues.description}
                        location={formValues.location}
                        date={formValues.date}
                        time={formValues.time}
                        onTitleChange={(val) =>
                            setValue('title', val, { shouldValidate: true })
                        }
                        onDescriptionChange={(val) =>
                            setValue('description', val)
                        }
                        onLocationChange={(val) =>
                            setValue('location', val, { shouldValidate: true })
                        }
                        onDateChange={(val) => setValue('date', val)}
                        onTimeChange={(val) => setValue('time', val)}
                        titleError={errors.title?.message}
                        locationError={errors.location?.message}
                    />

                    <Controller
                        control={control}
                        name="energy"
                        render={({ field }) => (
                            <PillSelector
                                title="Energy Level"
                                options={ENERGY_LEVELS}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="price"
                        render={({ field }) => (
                            <PillSelector
                                title="Price Range"
                                options={PRICE_RANGES}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="maxAttendees"
                        render={({ field }) => (
                            <ParticipantsSlider
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="tags"
                        render={({ field }) => (
                            <MultiTagSelector
                                title="Tags"
                                options={TAG_OPTIONS}
                                selectedTags={field.value}
                                onChange={(tag) => {
                                    const next = field.value.includes(tag)
                                        ? field.value.filter(
                                              (t: string) => t !== tag,
                                          )
                                        : [...field.value, tag];
                                    field.onChange(next);
                                }}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="ageRange"
                        render={({ field }) => (
                            <PillSelector
                                title="Age Range"
                                options={AGE_RANGES.map((age) => ({
                                    id: age,
                                    label: age,
                                }))}
                                value={field.value as any}
                                onChange={(v) => field.onChange(v)}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="approvalRequired"
                        render={({ field }) => (
                            <SafetyToggle
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />

                    {/* Submit Button */}
                    <Pressable
                        onPress={onSubmit}
                        disabled={isSubmitting}
                        style={[
                            styles.submitButton,
                            isSubmitting && styles.submitButtonDisabled,
                        ]}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator
                                color="#fff"
                                style={{ marginRight: 8 }}
                            />
                        ) : null}
                        <Text style={styles.submitButtonText}>
                            {isEditMode
                                ? isSubmitting
                                    ? 'Guardando...'
                                    : 'Guardar Cambios'
                                : isSubmitting
                                  ? 'Enviando...'
                                  : 'Publish Plan'}
                        </Text>
                        {!isSubmitting && (
                            <Text style={styles.submitButtonArrow}>→</Text>
                        )}
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
