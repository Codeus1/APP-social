import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCreatePlan } from '@/features/plans/hooks';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

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
  const createPlanMutation = useCreatePlan();

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

  // Validation
  const isFormValid = title.trim().length > 0 && location.trim().length > 0;

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert('Missing Fields', 'Please fill in the title and location.');
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
      const result = await createPlanMutation.mutateAsync({
        title: title.trim(),
        location: location.trim(),
        description: description.trim(),
        energy,
        tags: selectedTags,
        maxAttendees,
        startsAt: startsAt.toISOString(),
      });

      Alert.alert('Plan Created!', `Your plan "${title}" has been published.`, [
        {
          text: 'View Plan',
          onPress: () => router.replace(`/plan/${result.id}`),
        },
        {
          text: 'Create Another',
          style: 'cancel',
        },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to create plan. Please try again.');
    }
  };

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
              <AntDesign name="arrow-left" size={20} color={noctuaColors.text} />
            </Pressable>
            <Text style={styles.headerTitle}>Create a Plan</Text>
            <View style={styles.headerRight} />
          </View>

          {/* Page Title */}
          <View style={styles.titleBlock}>
            <Text style={styles.pageTitle}>Let&apos;s make a plan</Text>
            <Text style={styles.pageSubtitle}>Create a vibe for tonight.</Text>
          </View>

          {/* Cover Image Section */}
          <Pressable style={styles.coverImageSection}>
            <View style={styles.coverImagePlaceholder}>
              <AntDesign name="plus" size={24} color={noctuaColors.primary} />
              <Text style={styles.coverImageText}>Add cover photo</Text>
            </View>
          </Pressable>

          {/* Section 1: Activity Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What&apos;s the move?</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.activityScroll}
            >
              {ACTIVITY_TYPES.map((activity) => (
                <Pressable
                  key={activity.id}
                  onPress={() => setActivityType(activity.id)}
                  style={[
                    styles.activityItem,
                    activityType === activity.id && styles.activityItemActive,
                  ]}
                >
                  <View
                    style={[
                      styles.activityIconBox,
                      activityType === activity.id && styles.activityIconBoxActive,
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
                      color={activityType === activity.id ? noctuaColors.text : noctuaColors.textMuted}
                    />
                  </View>
                  <Text
                    style={[
                      styles.activityLabel,
                      activityType === activity.id && styles.activityLabelActive,
                    ]}
                  >
                    {activity.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Section 2: The Basics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>The Basics</Text>

            {/* Title Input */}
            <View style={styles.inputRow}>
              <AntDesign name="edit" size={16} color={noctuaColors.textMuted} style={styles.inputIcon} />
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Plan Title (e.g. Tapas & Sangria)"
                placeholderTextColor={noctuaColors.textMuted}
                style={styles.textInput}
              />
            </View>

            {/* Description Input */}
            <View style={[styles.inputRow, styles.descriptionRow]}>
              <AntDesign name="message" size={16} color={noctuaColors.textMuted} style={styles.inputIcon} />
              <TextInput
                value={description}
                onChangeText={setDescription}
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
              <AntDesign name="environment" size={16} color={noctuaColors.textMuted} style={styles.inputIcon} />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Where? (e.g. El Born, Barcelona)"
                placeholderTextColor={noctuaColors.textMuted}
                style={styles.textInput}
              />
            </View>

            {/* Date & Time Row */}
            <View style={styles.dateTimeRow}>
              <View style={[styles.inputRow, styles.dateInput]}>
                <AntDesign name="calendar" size={16} color={noctuaColors.textMuted} style={styles.inputIcon} />
                <TextInput
                  value={date}
                  onChangeText={setDate}
                  placeholder="Date"
                  placeholderTextColor={noctuaColors.textMuted}
                  style={[styles.textInput, styles.dateTimeInput]}
                />
              </View>
              <View style={[styles.inputRow, styles.timeInput]}>
                <AntDesign name="clock-circle" size={16} color={noctuaColors.textMuted} style={styles.inputIcon} />
                <TextInput
                  value={time}
                  onChangeText={setTime}
                  placeholder="Time"
                  placeholderTextColor={noctuaColors.textMuted}
                  style={[styles.textInput, styles.dateTimeInput]}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>
          </View>

          {/* Section 3: Energy Level */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Energy Level</Text>
            <View style={styles.chipRow}>
              {ENERGY_LEVELS.map((level) => (
                <Pressable
                  key={level.id}
                  onPress={() => setEnergy(level.id)}
                  style={[
                    styles.chip,
                    energy === level.id && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      energy === level.id && styles.chipTextActive,
                    ]}
                  >
                    {level.emoji} {level.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Section 4: Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.chipRow}>
              {PRICE_RANGES.map((range) => (
                <Pressable
                  key={range.id}
                  onPress={() => setPrice(range.id)}
                  style={[
                    styles.chip,
                    price === range.id && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      price === range.id && styles.chipTextActive,
                    ]}
                  >
                    {range.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Section 5: Max Attendees */}
          <View style={styles.section}>
            <View style={styles.sliderHeader}>
              <Text style={styles.sectionTitle}>Max Participants</Text>
              <View style={styles.sliderValueBadge}>
                <Text style={styles.sliderValueText}>{maxAttendees} People</Text>
              </View>
            </View>
            <View style={styles.sliderContainer}>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${((maxAttendees - 2) / 48) * 100}%` },
                  ]}
                />
              </View>
              <View style={styles.sliderButtons}>
                <Pressable
                  onPress={() => setMaxAttendees((prev) => Math.max(2, prev - 1))}
                  style={styles.sliderButton}
                >
                  <Text style={styles.sliderButtonText}>−</Text>
                </Pressable>
                <Text style={styles.sliderValue}>{maxAttendees}</Text>
                <Pressable
                  onPress={() => setMaxAttendees((prev) => Math.min(50, prev + 1))}
                  style={styles.sliderButton}
                >
                  <Text style={styles.sliderButtonText}>+</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>2</Text>
              <Text style={styles.sliderLabel}>50</Text>
            </View>
          </View>

          {/* Section 6: Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {TAG_OPTIONS.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => toggleTag(tag)}
                  style={[
                    styles.tagChip,
                    selectedTags.includes(tag) && styles.tagChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagChipText,
                      selectedTags.includes(tag) && styles.tagChipTextActive,
                    ]}
                  >
                    {tag}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Section 7: Age Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Age Range</Text>
            <View style={styles.chipRow}>
              {AGE_RANGES.map((range) => (
                <Pressable
                  key={range}
                  onPress={() => setAgeRange(range)}
                  style={[
                    styles.chip,
                    ageRange === range && styles.chipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      ageRange === range && styles.chipTextActive,
                    ]}
                  >
                    {range}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Section 8: Safety Toggle */}
          <View style={styles.section}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleIconBox}>
                <AntDesign name="safety" size={18} color={noctuaColors.primary} />
              </View>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Approval Required</Text>
                <Text style={styles.toggleSubtitle}>
                  Curate your crowd for safety
                </Text>
              </View>
              <Pressable
                onPress={() => setApprovalRequired((prev) => !prev)}
                style={[
                  styles.toggleSwitch,
                  approvalRequired && styles.toggleSwitchActive,
                ]}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    approvalRequired && styles.toggleKnobActive,
                  ]}
                />
              </Pressable>
            </View>
          </View>

          {/* Submit Button */}
          <Pressable
            onPress={handleSubmit}
            disabled={!isFormValid || createPlanMutation.isPending}
            style={[
              styles.submitButton,
              (!isFormValid || createPlanMutation.isPending) &&
                styles.submitButtonDisabled,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {createPlanMutation.isPending ? 'Creating...' : 'Publish Plan'}
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
  coverImageSection: {
    marginBottom: 24,
  },
  coverImagePlaceholder: {
    height: 160,
    borderRadius: 20,
    backgroundColor: noctuaColors.surface,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImageIcon: {
    color: noctuaColors.textMuted,
    fontSize: 36,
    fontWeight: '300',
  },
  coverImageText: {
    color: noctuaColors.textMuted,
    fontSize: 14,
    marginTop: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: noctuaColors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  activityScroll: {
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
    shadowColor: noctuaColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  activityIcon: {
    fontSize: 28,
  },
  activityLabel: {
    color: noctuaColors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  activityLabelActive: {
    color: noctuaColors.text,
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
  toggleIcon: {
    fontSize: 20,
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
