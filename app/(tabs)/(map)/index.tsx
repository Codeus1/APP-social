import { StyleSheet, Text, View } from 'react-native';

import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

export default function MapScreen() {
  return (
    <ScreenContainer>
      <View style={styles.mapPlaceholder}>
        <Text selectable style={styles.mapTitle}>
          Interactive Nightlife Map
        </Text>
        <Text selectable style={styles.mapDescription}>
          Vista base lista para integrar tiles reales y geolocalización en la siguiente iteración.
        </Text>
      </View>

      <View style={styles.zonesCard}>
        <Text selectable style={styles.zonesLabel}>
          Zonas activas ahora
        </Text>
        <Text selectable style={styles.zonesText}>
          Le Marais • Bastille • Kreuzberg
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  mapPlaceholder: {
    backgroundColor: noctuaColors.backgroundSoft,
    borderRadius: 24,
    borderColor: noctuaColors.border,
    borderWidth: 1,
    minHeight: 280,
    padding: 16,
    justifyContent: 'space-between',
  },
  mapTitle: {
    color: noctuaColors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  mapDescription: {
    color: noctuaColors.textMuted,
    lineHeight: 20,
  },
  zonesCard: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    padding: 16,
    gap: 8,
  },
  zonesLabel: {
    color: noctuaColors.primary,
    fontWeight: '700',
  },
  zonesText: {
    color: noctuaColors.text,
  },
});
