import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { noctuaColors } from '@/lib/theme/tokens';

type Chat = {
  name: string;
  lastMessage: string;
  unread: number;
};

const chats: Chat[] = [
  { name: 'Rooftop Jazz', lastMessage: 'Nos vemos en 40 min', unread: 2 },
  { name: 'Techno Session', lastMessage: 'Dress code black', unread: 0 },
  { name: 'Food Run', lastMessage: 'Voy llegando', unread: 1 },
];

export default function ChatsScreen() {
  const renderItem = useCallback(
    ({ item }: { item: Chat }) => (
      <View style={styles.chatCard}>
        <Text selectable style={styles.chatName}>
          {item.name}
        </Text>
        <Text selectable style={styles.chatLastMessage}>
          {item.lastMessage}
        </Text>
        <Text selectable style={styles.chatUnread}>
          {item.unread} mensajes nuevos
        </Text>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Chat) => item.name, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: noctuaColors.background,
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  chatCard: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    padding: 14,
    gap: 6,
  },
  chatName: {
    color: noctuaColors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  chatLastMessage: {
    color: noctuaColors.textMuted,
  },
  chatUnread: {
    color: noctuaColors.primary,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  separator: {
    height: 12,
  },
});
