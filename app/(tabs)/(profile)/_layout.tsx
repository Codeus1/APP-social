import { Stack } from 'expo-router';

import { noctuaColors } from '@/lib/theme/tokens';

const stackOptions = {
  headerStyle: { backgroundColor: noctuaColors.background },
  headerTintColor: noctuaColors.text,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: noctuaColors.background },
};

export default function ProfileStackLayout() {
  return (
    <Stack screenOptions={stackOptions}>
      <Stack.Screen name="index" options={{ title: 'Perfil' }} />
    </Stack>
  );
}

