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
import { SafeAreaView } from 'react-native-safe-area-context';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
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
    type EnergyLevel,
    type PriceRange,
} from '@/features/plans/constants';

// ─── Constants ────────────────────────────────────────────────────────────────

/** iOS has a native header ~44pt + status bar. On Android with height behaviour
 *  the offset should be 0 to let the OS handle it. */
const KEYBOARD_OFFSET = Platform.OS === 'ios' ? 60 : 0;

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function CreatePlanScreen() {
    const { editId } = useLocalSearchParams<{ editId?: string }>();
    const isEditMode = !!editId;

    const { data: existingPlan, isPending: isFetchingPlan } =
        usePlanQuery(editId);

    const { form, onSubmit, isSubmitting } = useCreatePlanForm({ editId });
    const {
        control,
        reset,
        formState: { errors },
    } = form;

    // Pre-populate form when editing an existing plan
    useEffect(() => {
        if (isEditMode && existingPlan) {
            reset({
                title: existingPlan.title,
                description: existingPlan.description,
                location: existingPlan.location,
                energy: existingPlan.energy as EnergyLevel,
                price: existingPlan.price as PriceRange,
                activityType: existingPlan.activityType ?? 'drinks',
                maxAttendees: existingPlan.maxAttendees,
                tags: existingPlan.tags,
                ageRange: existingPlan.ageRange,
                date: 'Tonight',
                time: '22:00',
                approvalRequired: existingPlan.approvalRequired ?? true,
                imageUrl: existingPlan.imageUrl ?? null,
            });
        }
    }, [isEditMode, existingPlan, reset]);

    if (isEditMode && isFetchingPlan) {
        return (
            <SafeAreaView
                style={styles.safeArea}
                edges={['top', 'left', 'right', 'bottom']}
            >
                <Text style={{ color: 'white', padding: 20 }}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'left', 'right', 'bottom']}
        >
            {/* ── Fixed header – outside ScrollView so it doesn't scroll ── */}
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
                <Text style={styles.headerTitle}>
                    {isEditMode ? 'Edit Plan' : 'Create a Plan'}
                </Text>
                <View style={styles.headerRight} />
            </View>

            {/* ── Keyboard-aware scrollable form ── */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
                keyboardVerticalOffset={KEYBOARD_OFFSET}
            >
                <ScrollView
                    style={styles.flex}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Page title */}
                    <View style={styles.titleBlock}>
                        <Text style={styles.pageTitle}>
                            {isEditMode
                                ? 'Update the details'
                                : "Let's make a plan"}
                        </Text>
                        <Text style={styles.pageSubtitle}>
                            {isEditMode
                                ? 'Changes apply immediately after saving.'
                                : 'Create a vibe for tonight.'}
                        </Text>
                    </View>

                    {/* Cover image */}
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

                    {/* Activity type */}
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

                    {/* Basic details – each field uses useController internally */}
                    <BasicDetailsForm control={control} />

                    {/* Energy level */}
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

                    {/* Price range */}
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

                    {/* Max attendees */}
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

                    {/* Tags */}
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

                    {/* Age range */}
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

                    {/* Approval required toggle */}
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

                    {/* Submit */}
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
                                  : 'Publicar Plan'}
                        </Text>
                        {!isSubmitting && (
                            <Text style={styles.submitButtonArrow}>→</Text>
                        )}
                    </Pressable>

                    <View style={styles.bottomPadding} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: noctuaColors.background,
    },
    flex: {
        flex: 1,
    },

    /* Fixed header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: noctuaColors.border,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(54, 26, 39, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: noctuaColors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    headerRight: {
        width: 40,
    },

    /* Scrollable content */
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    titleBlock: {
        marginBottom: 24,
    },
    pageTitle: {
        color: noctuaColors.text,
        fontSize: 26,
        fontWeight: '800',
    },
    pageSubtitle: {
        color: noctuaColors.textMuted,
        fontSize: 14,
        marginTop: 4,
    },

    /* Submit */
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
        marginTop: 8,
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
        height: 20,
    },
    errors: {},
});
