import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { noctuaColors } from '@/lib/theme/tokens';

export default function OnboardingScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: noctuaColors.background }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32, gap: 20 }}
    >
      <View style={{ gap: 10 }}>
        <Text selectable style={{ color: noctuaColors.primary, fontSize: 13, fontWeight: '800', letterSpacing: 1 }}>
          DISCOVER TONIGHT
        </Text>
        <Text selectable style={{ color: noctuaColors.text, fontSize: 34, fontWeight: '900' }}>
          Encuentra planes auténticos
        </Text>
        <Text selectable style={{ color: noctuaColors.textMuted, lineHeight: 22 }}>
          Descubre eventos cerca de ti, filtra por energía, presupuesto y tipo de vibe.
        </Text>
      </View>

      <View style={{ height: 180, borderRadius: 24, backgroundColor: '#2d1523', borderColor: noctuaColors.border, borderWidth: 1 }} />

      <View style={{ gap: 10 }}>
        <Text selectable style={{ color: noctuaColors.primary, fontSize: 13, fontWeight: '800', letterSpacing: 1 }}>
          MEET PEOPLE
        </Text>
        <Text selectable style={{ color: noctuaColors.text, fontSize: 34, fontWeight: '900' }}>
          Conecta con tu tipo de crowd
        </Text>
        <Text selectable style={{ color: noctuaColors.textMuted, lineHeight: 22 }}>
          Crea o únete a grupos seguros, con control de cupos y chats por plan.
        </Text>
      </View>

      <Link href="/(tabs)/(feed)" asChild>
        <Pressable style={{ backgroundColor: noctuaColors.primary, borderRadius: 999, paddingVertical: 14, alignItems: 'center', marginTop: 6 }}>
          <Text selectable style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
            Continuar
          </Text>
        </Pressable>
      </Link>
    </ScrollView>
  );
}

