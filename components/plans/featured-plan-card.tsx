import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Plan } from '@/features/plans/types';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { formatEnergy, formatPrice } from './plan-helpers';

type Props = {
  plan: Plan;
  onPress: () => void;
};

export function FeaturedPlanCard({ plan, onPress }: Props) {
  const spotsLeft = plan.maxAttendees - plan.attendees;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Image section */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: plan.imageUrl }} style={styles.image} />
        {/* Badges */}
        {plan.isHappeningNow && (
          <View style={styles.happeningBadge}>
            <Text style={styles.happeningDot}>●</Text>
            <Text style={styles.happeningText}>HAPPENING NOW</Text>
          </View>
        )}
        <View style={styles.matchBadge}>
          <Text style={styles.matchText}>{plan.matchPercentage}% Match</Text>
        </View>
        {/* Host avatar */}
        <View style={styles.hostAvatarWrapper}>
          <Image source={{ uri: plan.host.avatarUrl }} style={styles.hostAvatar} />
          {plan.host.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
            </View>
          )}
        </View>
      </View>

      {/* Title row */}
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={1}>
          {plan.title}
        </Text>
        <Text style={styles.hostLabel}>HOST</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        {plan.startsAt} • {plan.location}
      </Text>

      {/* Tags */}
      <View style={styles.tagsRow}>
        <View style={styles.energyChip}>
          <Text style={styles.energyChipText}>{formatEnergy(plan.energy)}</Text>
        </View>
        <View style={styles.tagChip}>
          <Text style={styles.tagChipText}>{formatPrice(plan.price)}</Text>
        </View>
        <View style={styles.tagChip}>
          <Text style={styles.tagChipText}>{plan.ageRange}</Text>
        </View>
      </View>

      {/* Who's going section */}
      <View style={styles.whosGoingSection}>
        <View style={styles.mapPlaceholder}>
          <View style={styles.mapPin} />
        </View>
        <View style={styles.whosGoingInfo}>
          <View style={styles.whosGoingHeader}>
            <Text style={styles.whosGoingLabel}>{"Who's going"}</Text>
            {spotsLeft > 0 && (
              <View style={styles.spotsLeftBadge}>
                <Text style={styles.spotsLeftText}>{spotsLeft} spots left</Text>
              </View>
            )}
          </View>
          <View style={styles.avatarStackRow}>
            {/* Avatar stack placeholder */}
            <View style={styles.avatarStack}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={[styles.stackAvatar, { left: i * 18 }]}>
                  <View style={styles.stackAvatarInner} />
                </View>
              ))}
              <View style={[styles.stackAvatar, styles.stackAvatarMore, { left: 3 * 18 }]}>
                <Text style={styles.stackAvatarMoreText}>+{Math.max(0, plan.attendees - 3)}</Text>
              </View>
            </View>
            <Text style={styles.genderText}>
              {plan.genderRatio.female}% women / {plan.genderRatio.male}% men
            </Text>
          </View>
        </View>
      </View>

      {/* Join button */}
      <View style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Request to Join →</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: noctuaColors.surface,
    borderRadius: noctuaRadii.card,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    overflow: 'hidden',
  },
  imageWrapper: {
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: noctuaRadii.card,
    borderTopRightRadius: noctuaRadii.card,
  },
  happeningBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: noctuaRadii.chip,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  happeningDot: {
    color: noctuaColors.success,
    fontSize: 8,
  },
  happeningText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  matchBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: noctuaColors.primary,
    borderRadius: noctuaRadii.chip,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  matchText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  hostAvatarWrapper: {
    position: 'absolute',
    bottom: -22,
    right: 16,
  },
  hostAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: noctuaColors.surface,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  title: {
    color: noctuaColors.text,
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
  },
  hostLabel: {
    color: noctuaColors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: noctuaColors.textMuted,
    fontSize: 13,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
    gap: 8,
    flexWrap: 'wrap',
  },
  energyChip: {
    borderRadius: noctuaRadii.chip,
    borderWidth: 1,
    borderColor: noctuaColors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  energyChipText: {
    color: noctuaColors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  tagChip: {
    borderRadius: noctuaRadii.chip,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagChipText: {
    color: noctuaColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  whosGoingSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 12,
    alignItems: 'center',
  },
  mapPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: noctuaColors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: noctuaColors.primary,
    opacity: 0.6,
  },
  whosGoingInfo: {
    flex: 1,
    gap: 6,
  },
  whosGoingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whosGoingLabel: {
    color: noctuaColors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
  spotsLeftBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderRadius: noctuaRadii.chip,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  spotsLeftText: {
    color: noctuaColors.success,
    fontSize: 11,
    fontWeight: '700',
  },
  avatarStackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarStack: {
    flexDirection: 'row',
    height: 28,
    width: 90,
    position: 'relative',
  },
  stackAvatar: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 10,
    fontWeight: '700',
  },
  genderText: {
    color: noctuaColors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  joinButton: {
    backgroundColor: '#fff',
    borderRadius: noctuaRadii.button,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  joinButtonText: {
    color: noctuaColors.background,
    fontSize: 15,
    fontWeight: '800',
  },
});
