import { Tabs } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { Platform } from 'react-native';

import { noctuaColors } from '@/lib/theme/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      detachInactiveScreens={Platform.OS !== 'web'}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: noctuaColors.primary,
        tabBarInactiveTintColor: noctuaColors.textMuted,
        tabBarStyle: {
          backgroundColor: noctuaColors.background,
          borderTopColor: noctuaColors.border,
          borderTopWidth: 1,
        },
      }}
    >
      <Tabs.Screen
        name="(feed)"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="appstore" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(map)"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="environment" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(chats)"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="message" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
