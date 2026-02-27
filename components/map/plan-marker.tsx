import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import type { Plan } from '../../features/plans/types';
import { noctuaColors } from '../../lib/theme/tokens';

type PlanMarkerProps = {
  plan: Plan;
  onPress?: () => void;
};

function getPlanMarkerLabel(tags: string[]): string {
  if (tags.includes('jazz') || tags.includes('live music')) return 'JAZZ';
  if (tags.includes('techno') || tags.includes('dancing')) return 'DANCE';
  if (tags.includes('food')) return 'FOOD';
  if (tags.includes('salsa') || tags.includes('latin')) return 'LATIN';
  if (tags.includes('cocktails') || tags.includes('wine')) return 'SOCIAL';
  return 'PLAN';
}

export function PlanMarker({ plan, onPress }: PlanMarkerProps) {
  const label = getPlanMarkerLabel(plan.tags);

  return (
    <Marker
      coordinate={{
        latitude: plan.coordinates.lat,
        longitude: plan.coordinates.lng,
      }}
      onPress={onPress}
      tracksViewChanges={false}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.marker, plan.isHappeningNow && styles.markerActive]}>
          <Text style={styles.markerText}>{label}</Text>
        </View>
        {plan.isHappeningNow && <View style={styles.pulseRing} />}
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: noctuaColors.surface,
    borderWidth: 3,
    borderColor: noctuaColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: noctuaColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },
  markerActive: {
    backgroundColor: noctuaColors.primary,
    borderColor: noctuaColors.text,
  },
  markerText: {
    fontSize: 10,
    fontWeight: '700',
    color: noctuaColors.text,
  },
  pulseRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: noctuaColors.primary,
    opacity: 0.5,
  },
});
