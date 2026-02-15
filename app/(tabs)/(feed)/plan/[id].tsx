import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { usePlanQuery } from '@/features/plans/hooks';
import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plan } = usePlanQuery(id);

  if (!plan) {
    return (
      <ScreenContainer>
        <Text selectable style={styles.notFoundText}>
          Plan no encontrado
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.headerBlock}>
        <Text selectable style={styles.planTitle}>
          {plan.title}
        </Text>
        <Text selectable style={styles.planHost}>
          Hosted by {plan.host} • {plan.location}
        </Text>
      </View>

      <View style={styles.detailCard}>
        <Text selectable style={styles.detailTime}>
          {plan.startsAt}
        </Text>
        <Text selectable style={styles.detailDescription}>
          {plan.description}
        </Text>
        <Text selectable style={styles.detailAttendees}>
          {plan.attendees}/{plan.maxAttendees} asistentes
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  notFoundText: {
    color: noctuaColors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  headerBlock: {
    gap: 8,
  },
  planTitle: {
    color: noctuaColors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  planHost: {
    color: noctuaColors.textMuted,
    fontWeight: '600',
  },
  detailCard: {
    gap: 10,
    backgroundColor: noctuaColors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: noctuaColors.border,
  },
  detailTime: {
    color: noctuaColors.primary,
    fontWeight: '700',
  },
  detailDescription: {
    color: noctuaColors.text,
    lineHeight: 22,
  },
  detailAttendees: {
    color: noctuaColors.textMuted,
    fontVariant: ['tabular-nums'],
  },
});
