import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { noctuaColors } from '@/lib/theme/tokens';

export default function NotFoundRoute() {
  return (
    <View style={{ flex: 1, backgroundColor: noctuaColors.background, alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <Text selectable style={{ color: noctuaColors.text, fontSize: 24, fontWeight: '800' }}>
        Pantalla no encontrada
      </Text>
      <Link href="/" style={{ color: noctuaColors.primary, fontSize: 16, fontWeight: '700' }}>
        Volver al inicio
      </Link>
    </View>
  );
}

