import { Text, View } from 'react-native';

import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

const chats = [
  { name: 'Rooftop Jazz', lastMessage: 'Nos vemos en 40 min', unread: 2 },
  { name: 'Techno Session', lastMessage: 'Dress code black', unread: 0 },
  { name: 'Food Run', lastMessage: 'Voy llegando', unread: 1 },
];

export default function ChatsScreen() {
  return (
    <ScreenContainer>
      {chats.map((chat) => (
        <View
          key={chat.name}
          style={{
            backgroundColor: noctuaColors.surface,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: noctuaColors.border,
            padding: 14,
            gap: 6,
          }}
        >
          <Text selectable style={{ color: noctuaColors.text, fontSize: 17, fontWeight: '800' }}>
            {chat.name}
          </Text>
          <Text selectable style={{ color: noctuaColors.textMuted }}>{chat.lastMessage}</Text>
          <Text selectable style={{ color: noctuaColors.primary, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
            {chat.unread} mensajes nuevos
          </Text>
        </View>
      ))}
    </ScreenContainer>
  );
}

