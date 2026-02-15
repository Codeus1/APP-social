import { Stack } from 'expo-router';

import { noctuaColors } from '@/lib/theme/tokens';

export default function FeedStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: noctuaColors.background },
        headerTintColor: noctuaColors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: noctuaColors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Noctua Feed' }} />
      <Stack.Screen name="notifications" options={{ title: 'Notificaciones' }} />
      <Stack.Screen name="create-plan" options={{ title: 'Crear plan', presentation: 'formSheet' }} />
      <Stack.Screen name="plan/[id]" options={{ title: 'Detalle del plan' }} />
    </Stack>
  );
}

