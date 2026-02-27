import { useLocalSearchParams, router } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

import { usePlanQuery } from '@/features/plans/hooks';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { formatEnergy, formatPrice } from '@/components/plans/plan-helpers';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plan } = usePlanQuery(id);

  if (!plan) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          <Text style={styles.notFoundText}>Plan not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const spotsLeft = plan.maxAttendees - plan.attendees;

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Hero image */}
        <View style={styles.heroWrapper}>
          <Image source={{ uri: plan.imageUrl }} style={styles.heroImage} />
          {/* Top bar overlay */}
          <SafeAreaView style={styles.topBar} edges={['top']}>
            <Pressable style={styles.topButton} onPress={() => router.back()}>
              <AntDesign name="arrow-left" size={20} color="#fff" />
            </Pressable>
            <View style={styles.topBarRight}>
              <Pressable style={styles.topButton}>
                <AntDesign name="heart" size={20} color="#fff" />
              </Pressable>
              <Pressable style={styles.topButton}>
                <AntDesign name="share-alt" size={20} color="#fff" />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        {/* Tags below image */}
        <View style={styles.body}>
          <View style={styles.topTags}>
            {plan.isHappeningNow && (
              <View style={styles.tonightChip}>
                <Text style={styles.tonightChipText}>TONIGHT</Text>
              </View>
            )}
            {plan.tags.slice(0, 2).map((tag) => (
              <View key={tag} style={styles.tagChip}>
                <Text style={styles.tagChipText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Title */}
          <Text style={styles.title}>{plan.title}</Text>

          {/* Time + Location */}
          <View style={styles.metaRow}>
            <AntDesign name="clock-circle" size={16} color={noctuaColors.textMuted} />
            <Text style={styles.metaText}>{plan.startsAt}</Text>
            <Text style={styles.metaDot}>•</Text>
            <AntDesign name="environment" size={16} color={noctuaColors.textMuted} />
            <Text style={styles.metaText}>{plan.location}</Text>
          </View>

          {/* Host card */}
          <View style={styles.hostCard}>
            <View style={styles.hostLeft}>
              <View style={styles.hostAvatarWrapper}>
                <Image source={{ uri: plan.host.avatarUrl }} style={styles.hostAvatar} />
                <View style={styles.hostBadge}>
                  <Text style={styles.hostBadgeText}>HOST</Text>
                </View>
              </View>
              <View>
                <Text style={styles.hostName}>
                  {plan.host.name}
                  <Text style={styles.hostAge}> (24)</Text>
                </Text>
                <Text style={styles.hostTrust}>{`Trust score: ${plan.matchPercentage}%`}</Text>
              </View>
            </View>
            <Pressable style={styles.chatButton}>
              <AntDesign name="message" size={18} color={noctuaColors.text} />
            </Pressable>
          </View>

          {/* The Plan section */}
          <Text style={styles.sectionTitle}>The Plan</Text>
          <Text style={styles.description}>{plan.description}</Text>

          {/* Group Vibe */}
          <Text style={styles.sectionTitle}>Group Vibe</Text>
          <View style={styles.vibeRow}>
            <View style={styles.vibeChip}>
              <Text style={styles.vibeChipText}>{formatEnergy(plan.energy)}</Text>
            </View>
            <View style={styles.vibeChip}>
              <Text style={styles.vibeChipText}>{formatPrice(plan.price)}</Text>
            </View>
            <View style={styles.vibeChip}>
              <Text style={styles.vibeChipText}>{plan.ageRange}</Text>
            </View>
          </View>

          {/* Who's Going */}
          <View style={styles.whosGoingHeader}>
            <Text style={styles.sectionTitle}>{"Who's Going"}</Text>
            <Text style={styles.seeAll}>See all</Text>
          </View>
          <View style={styles.attendeesCard}>
            <View style={styles.avatarStack}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={[styles.stackAvatar, { left: i * 22 }]}>
                  <View style={styles.stackAvatarInner} />
                </View>
              ))}
              {plan.attendees > 4 && (
                <View style={[styles.stackAvatar, styles.stackAvatarMore, { left: 4 * 22 }]}>
                  <Text style={styles.stackAvatarMoreText}>+{plan.attendees - 4}</Text>
                </View>
              )}
            </View>
            <View style={styles.attendeesInfo}>
              <Text style={styles.confirmedText}>
                {plan.attendees} Confirmed
              </Text>
              <Text style={styles.spotsText}>
                {spotsLeft} spots left
              </Text>
            </View>
          </View>

          {/* Location section */}
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationPlaceholder}>
              <View style={styles.locationPin} />
              <Text style={styles.locationName}>{plan.location}</Text>
            </View>
          </View>
          <Text style={styles.locationAddress}>{plan.location} • {plan.distance}</Text>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <Pressable style={styles.joinCta}>
          <Text style={styles.joinCtaText}>Request to Join →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: noctuaColors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    color: noctuaColors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },

  /* Hero */
  heroWrapper: {
    height: 320,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  topBarRight: {
    flexDirection: 'row',
    gap: 10,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topButtonText: {
    color: '#fff',
    fontSize: 20,
  },

  /* Body */
  body: {
    padding: 20,
    gap: 12,
  },

  /* Top tags */
  topTags: {
    flexDirection: 'row',
    gap: 8,
  },
  tonightChip: {
    backgroundColor: noctuaColors.primary,
    borderRadius: noctuaRadii.chip,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tonightChipText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  tagChip: {
    backgroundColor: noctuaColors.surface,
    borderRadius: noctuaRadii.chip,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagChipText: {
    color: noctuaColors.text,
    fontSize: 12,
    fontWeight: '600',
  },

  /* Title */
  title: {
    color: noctuaColors.text,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },

  /* Meta */
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    color: noctuaColors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  metaDot: {
    color: noctuaColors.textMuted,
    marginHorizontal: 4,
  },

  /* Host */
  hostCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: noctuaColors.surface,
    borderRadius: 18,
    padding: 14,
    marginTop: 4,
  },
  hostLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hostAvatarWrapper: {
    position: 'relative',
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  hostBadge: {
    position: 'absolute',
    bottom: -4,
    left: 4,
    backgroundColor: noctuaColors.primary,
    borderRadius: noctuaRadii.chip,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hostBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
  },
  hostName: {
    color: noctuaColors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  hostAge: {
    color: noctuaColors.textMuted,
    fontWeight: '500',
  },
  hostTrust: {
    color: noctuaColors.success,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButtonText: {
    fontSize: 18,
  },

  /* Sections */
  sectionTitle: {
    color: noctuaColors.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 8,
  },
  description: {
    color: noctuaColors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },

  /* Vibe */
  vibeRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  vibeChip: {
    borderRadius: noctuaRadii.chip,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vibeChipText: {
    color: noctuaColors.text,
    fontSize: 13,
    fontWeight: '600',
  },

  /* Who's Going */
  whosGoingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  seeAll: {
    color: noctuaColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  attendeesCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: noctuaColors.surface,
    borderRadius: 18,
    padding: 14,
    gap: 16,
  },
  avatarStack: {
    flexDirection: 'row',
    height: 36,
    width: 130,
    position: 'relative',
  },
  stackAvatar: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: noctuaColors.surface,
    overflow: 'hidden',
  },
  stackAvatarInner: {
    flex: 1,
    backgroundColor: noctuaColors.surfaceSoft,
  },
  stackAvatarMore: {
    backgroundColor: noctuaColors.backgroundSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackAvatarMoreText: {
    color: noctuaColors.text,
    fontSize: 11,
    fontWeight: '700',
  },
  attendeesInfo: {
    gap: 2,
  },
  confirmedText: {
    color: noctuaColors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  spotsText: {
    color: noctuaColors.textMuted,
    fontSize: 13,
  },

  /* Location */
  locationCard: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 18,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  locationPlaceholder: {
    alignItems: 'center',
    gap: 6,
  },
  locationPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: noctuaColors.primary,
    opacity: 0.5,
  },
  locationName: {
    color: noctuaColors.text,
    fontSize: 13,
    fontWeight: '600',
    backgroundColor: noctuaColors.backgroundSoft,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  locationAddress: {
    color: noctuaColors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },

  /* Bottom CTA */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: noctuaColors.background,
  },
  joinCta: {
    backgroundColor: noctuaColors.primary,
    borderRadius: noctuaRadii.button,
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinCtaText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
  },
});
