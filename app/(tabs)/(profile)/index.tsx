import { StyleSheet, Text, View } from 'react-native';

import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

export default function ProfileScreen() {
  return (
    <ScreenContainer>
      <View style={styles.profileCard}>
        <Text selectable style={styles.profileName}>
          Sofía Martínez
        </Text>
        <Text selectable style={styles.profileLevel}>
          Host level: Ambassador
        </Text>
        <Text selectable style={styles.profileStats}>
          4.9 rating • 128 plans
        </Text>
      </View>

      <View style={styles.bioCard}>
        <Text selectable style={styles.bioTitle}>
          Bio
        </Text>
        <Text selectable style={styles.bioText}>
          Diseñando noches memorables, mezclando música, gente nueva y lugares con vibra auténtica.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    padding: 18,
    gap: 8,
  },
  profileName: {
    color: noctuaColors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  profileLevel: {
    color: noctuaColors.textMuted,
  },
  profileStats: {
    color: noctuaColors.primary,
    fontWeight: '700',
  },
  bioCard: {
    backgroundColor: noctuaColors.backgroundSoft,
    borderRadius: 18,
    borderColor: noctuaColors.border,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  bioTitle: {
    color: noctuaColors.text,
    fontWeight: '700',
  },
  bioText: {
    color: noctuaColors.textMuted,
    lineHeight: 20,
  },
});
