import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { noctuaColors } from '@/lib/theme/tokens';

export default function SplashScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: noctuaColors.background }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 40 }}
    >
      <View style={{ alignItems: 'center', marginTop: 120, gap: 16 }}>
        <View
          style={{
            width: 132,
            height: 132,
            borderRadius: 999,
            backgroundColor: '#2c1421',
            borderWidth: 1,
            borderColor: noctuaColors.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text selectable style={{ color: noctuaColors.primary, fontSize: 52 }}>
            ?
          </Text>
        </View>
        <Text selectable style={{ color: '#fff', fontSize: 52, fontWeight: '900' }}>
          Noctua
        </Text>
        <Text selectable style={{ color: noctuaColors.primary, fontSize: 18, fontWeight: '600' }}>
          Your night starts here
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        <Link href="/onboarding" asChild>
          <Pressable style={{ backgroundColor: noctuaColors.primary, borderRadius: 999, paddingVertical: 14, alignItems: 'center' }}>
            <Text selectable style={{ color: '#fff', fontWeight: '800', fontSize: 16 }}>
              Empezar
            </Text>
          </Pressable>
        </Link>
        <Link href="/(tabs)/(feed)" asChild>
          <Pressable style={{ borderRadius: 999, borderWidth: 1, borderColor: noctuaColors.border, paddingVertical: 14, alignItems: 'center' }}>
            <Text selectable style={{ color: noctuaColors.text, fontWeight: '700' }}>
              Ir directo al feed
            </Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

