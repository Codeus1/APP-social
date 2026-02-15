import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';


import { usePlanQuery } from '@/features/plans/hooks';
import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

export default function PlanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: plan } = usePlanQuery(id);

  if (!plan) {
    return (
      <ScreenContainer>
        <Text selectable style={{ color: noctuaColors.text, fontSize: 22, fontWeight: '800' }}>
          Plan no encontrado
        </Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={{ gap: 18 }}>
      <View style={{ gap: 8 }}>
        <Text selectable style={{ color: noctuaColors.text, fontSize: 30, fontWeight: '800' }}>
          {plan.title}
        </Text>
        <Text selectable style={{ color: noctuaColors.textMuted, fontWeight: '600' }}>
          Hosted by {plan.host} • {plan.location}
        </Text>
      </View>

      <View style={{ gap: 10, backgroundColor: noctuaColors.surface, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: noctuaColors.border }}>
        <Text selectable style={{ color: noctuaColors.primary, fontWeight: '700' }}>
          {plan.startsAt}
        </Text>
        <Text selectable style={{ color: noctuaColors.text, lineHeight: 22 }}>
          {plan.description}
        </Text>
        <Text selectable style={{ color: noctuaColors.textMuted, fontVariant: ['tabular-nums'] }}>
          {plan.attendees}/{plan.maxAttendees} asistentes
        </Text>
      </View>
    </ScreenContainer>
  );
}

