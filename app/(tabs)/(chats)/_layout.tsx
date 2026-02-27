import { Stack } from 'expo-router';

import { noctuaColors } from '@/lib/theme/tokens';

const stackOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: noctuaColors.background },
};

export default function ChatsStackLayout() {
  return (
    <Stack screenOptions={stackOptions}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}

