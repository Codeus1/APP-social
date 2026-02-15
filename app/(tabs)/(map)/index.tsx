import { Text, View } from 'react-native';


import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

export default function MapScreen() {
  return (
    <ScreenContainer style={{ gap: 18 }}>
      <View
        style={{
          backgroundColor: '#2f1624',
          borderRadius: 24,
          borderColor: noctuaColors.border,
          borderWidth: 1,
          minHeight: 280,
          padding: 16,
          justifyContent: 'space-between',
        }}
      >
        <Text selectable style={{ color: noctuaColors.text, fontSize: 22, fontWeight: '800' }}>
          Interactive Nightlife Map
        </Text>
        <Text selectable style={{ color: noctuaColors.textMuted, lineHeight: 20 }}>
          Vista base lista para integrar tiles reales y geolocalización en la siguiente iteración.
        </Text>
      </View>

      <View style={{ backgroundColor: noctuaColors.surface, borderRadius: 20, borderWidth: 1, borderColor: noctuaColors.border, padding: 16, gap: 8 }}>
        <Text selectable style={{ color: noctuaColors.primary, fontWeight: '700' }}>
          Zonas activas ahora
        </Text>
        <Text selectable style={{ color: noctuaColors.text }}>Le Marais • Bastille • Kreuzberg</Text>
      </View>
    </ScreenContainer>
  );
}

