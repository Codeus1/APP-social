import { useCallback } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, RelativePathString } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import { noctuaColors } from '@/lib/theme/tokens';
import type { Chat } from '@/features/chats/types';
import { mockChats, formatRelativeTime } from '@/features/chats/mock-data';

export default function ChatsScreen() {
  const handleChatPress = useCallback((chatId: string) => {
    router.push(`/(tabs)/(chats)/${chatId}` as RelativePathString);
  }, []);

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton} hitSlop={12}>
            <AntDesign name="search" size={18} color={noctuaColors.text} />
          </Pressable>
          <Pressable style={styles.headerButton} hitSlop={12}>
            <AntDesign name="edit" size={18} color={noctuaColors.text} />
          </Pressable>
        </View>
      </View>
    ),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: Chat }) => (
      <Pressable
        style={({ pressed }) => [
          styles.chatItem,
          pressed && styles.chatItemPressed,
        ]}
        onPress={() => handleChatPress(item.id)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.planImageUrl }}
            style={styles.planImage}
          />
          {item.isHappeningNow && <View style={styles.activeIndicator} />}
        </View>

        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.planTitle} numberOfLines={1}>
              {item.planTitle}
            </Text>
            <Text style={styles.timestamp}>
              {formatRelativeTime(item.lastMessageAt)}
            </Text>
          </View>
          <Text style={styles.hostName}>Hosted by {item.hostName}</Text>
          <View style={styles.lastMessageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    ),
    [handleChatPress]
  );

  const keyExtractor = useCallback((item: Chat) => item.id, []);

  const ItemSeparator = useCallback(
    () => <View style={styles.separator} />,
    []
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {renderHeader()}
      <FlatList
        data={mockChats}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: noctuaColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: noctuaColors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: noctuaColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    gap: 12,
  },
  chatItemPressed: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative',
  },
  planImage: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: noctuaColors.surface,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: noctuaColors.success,
    borderWidth: 2,
    borderColor: noctuaColors.background,
  },
  chatContent: {
    flex: 1,
    gap: 2,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planTitle: {
    color: noctuaColors.text,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    color: noctuaColors.textMuted,
    fontSize: 12,
  },
  hostName: {
    color: noctuaColors.textMuted,
    fontSize: 13,
  },
  lastMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  lastMessage: {
    color: noctuaColors.textMuted,
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: noctuaColors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: noctuaColors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: noctuaColors.border,
    marginLeft: 68, // Align with text (56 image + 12 gap)
  },
});
