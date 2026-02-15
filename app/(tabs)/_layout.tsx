import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

import { noctuaColors } from '@/lib/theme/tokens';

export default function TabsLayout() {
  return (
    <NativeTabs tintColor={noctuaColors.primary} minimizeBehavior="onScrollDown">
      <NativeTabs.Trigger name="(feed)">
        <Icon sf="sparkles" />
        <Label>Feed</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(map)">
        <Icon sf="map.fill" />
        <Label>Map</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(chats)">
        <Icon sf="message.fill" />
        <Label>Chats</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(profile)">
        <Icon sf="person.crop.circle" />
        <Label>Perfil</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

