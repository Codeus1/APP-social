import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Plan } from '@/features/plans/types';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { formatEnergy, formatPrice } from './plan-helpers';

type Props = {
  plan: Plan;
  onPress: () => void;
};

export function MediumPlanCard({ plan, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Host header row */}
      <View style={styles.hostRow}>
        <View style={styles.hostLeft}>
          <View style={styles.hostAvatarWrapper}>
            <Image source={{ uri: plan.host.avatarUrl }} style={styles.hostAvatar} />
            {plan.host.verified && (
              <View style={styles.starBadge}>
                <Text style={styles.starIcon}>★</Text>
              </View>
            )}
          </View>
          <View>
            <Text style={styles.hostedBy}>
              {'Hosted by '}
              <Text style={styles.hostName}>{plan.host.name}</Text>
            </Text>
            <Text style={styles.hostSubtitle}>Ambassador • 4.9 ★</Text>
          </View>
        </View>
        <View style={styles.timeBlock}>
          <Text style={styles.timeText}>{plan.startsAt}</Text>
          <Text style={styles.timeSubtext}>Tonight</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>
        {plan.title}
      </Text>

      {/* Description */}
      <Text style={styles.description} numberOfLines={3}>
        {plan.description}
      </Text>

      {/* Tags */}
      <View style={styles.tagsRow}>
        <View style={styles.energyChip}>
          <Text style={styles.energyChipText}>{formatEnergy(plan.energy)}</Text>
        </View>
        <View style={styles.tagChip}>
          <Text style={styles.tagChipText}>{formatPrice(plan.price)}</Text>
        </View>
        {plan.tags.slice(0, 1).map((tag) => (
          <View key={tag} style={styles.tagChip}>
            <Text style={styles.tagChipText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Gender ratio bar */}
      <View style={styles.genderBar}>
        <View style={styles.genderBarLeft}>
          {/* Avatar stack + Join */}
          <View style={styles.miniAvatarStack}>
            {[0, 1].map((i) => (
              <View key={i} style={[styles.miniAvatar, { left: i * 16 }]}>
                <View style={styles.miniAvatarInner} />
              </View>
            ))}
          </View>
          <View style={styles.joinPill}>
            <Text style={styles.joinPillText}>Join</Text>
          </View>
        </View>
        <View style={styles.genderInfo}>
          <Text style={styles.genderLabel}>GENDER RATIO</Text>
          <Text style={styles.genderText}>
            {plan.genderRatio.female}% women / {plan.genderRatio.male}% men
          </Text>
        </View>
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
    padding: 16,
    gap: 10,
  },
  hostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hostLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hostAvatarWrapper: {
    position: 'relative',
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  starBadge: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: noctuaColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starIcon: {
    color: '#fff',
    fontSize: 9,
  },
  hostedBy: {
    color: noctuaColors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  hostName: {
    color: noctuaColors.text,
    fontWeight: '800',
  },
  hostSubtitle: {
    color: noctuaColors.textMuted,
    fontSize: 12,
  },
  timeBlock: {
    alignItems: 'flex-end',
  },
  timeText: {
    color: noctuaColors.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  timeSubtext: {
    color: noctuaColors.textMuted,
    fontSize: 12,
  },
  title: {
    color: noctuaColors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  description: {
    color: noctuaColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  energyChip: {
    borderRadius: noctuaRadii.chip,
    backgroundColor: 'rgba(244, 37, 140, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  energyChipText: {
    color: noctuaColors.primary,
    fontSize: 12,
    fontWeight: '700',
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
  genderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: noctuaColors.surfaceSoft,
    borderRadius: 16,
    padding: 10,
    marginTop: 4,
  },
  genderBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  miniAvatarStack: {
    flexDirection: 'row',
    height: 28,
    width: 44,
    position: 'relative',
  },
  miniAvatar: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: noctuaColors.surfaceSoft,
    overflow: 'hidden',
  },
  miniAvatarInner: {
    flex: 1,
    backgroundColor: noctuaColors.border,
  },
  joinPill: {
    backgroundColor: noctuaColors.primary,
    borderRadius: noctuaRadii.chip,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 20,
  },
  joinPillText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  genderInfo: {
    alignItems: 'flex-end',
  },
  genderLabel: {
    color: noctuaColors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  genderText: {
    color: noctuaColors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});
