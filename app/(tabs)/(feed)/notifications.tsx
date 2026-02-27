import { useCallback, useState, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

import { noctuaColors } from '@/lib/theme/tokens';
import { Notification, NotificationAction } from '@/features/notifications/types';
import { mockNotifications } from '@/features/notifications/mock-data';

type FilterTab = 'all' | 'unread';

// Helper function to format relative time
function formatRelativeTime(isoString: string): string {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

// Get icon name for notification type
function getNotificationIcon(type: Notification['type']): keyof typeof AntDesign.glyphMap {
  switch (type) {
    case 'plan_invite':
      return 'calendar';
    case 'join_request':
      return 'user';
    case 'message':
      return 'message';
    case 'plan_update':
      return 'clock-circle';
    case 'new_follower':
      return 'heart';
    case 'review':
      return 'star';
    default:
      return 'notification';
  }
}

// Action button component
function ActionButton({
  action,
  onPress,
}: {
  action: NotificationAction;
  onPress: () => void;
}) {
  const isAccept = action.action === 'accept';
  const isDecline = action.action === 'decline';
  const isFollowBack = action.action === 'follow_back';

  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        isAccept && styles.actionButtonAccept,
        isDecline && styles.actionButtonDecline,
        isFollowBack && styles.actionButtonFollow,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.actionButtonText,
          isAccept && styles.actionButtonTextAccept,
          isDecline && styles.actionButtonTextDecline,
        ]}
      >
        {action.label}
      </Text>
    </TouchableOpacity>
  );
}

// Notification item component
function NotificationItem({
  notification,
  onActionPress,
}: {
  notification: Notification;
  onActionPress: (notificationId: string, action: NotificationAction) => void;
}) {
  const hasActions = notification.actions && notification.actions.length > 0;

  return (
    <View style={[styles.notificationCard, !notification.isRead && styles.notificationCardUnread]}>
      {/* Unread indicator */}
      {!notification.isRead && <View style={styles.unreadDot} />}

      {/* Avatar or Image */}
      <View style={styles.avatarContainer}>
        {notification.senderAvatarUrl ? (
          <Image source={{ uri: notification.senderAvatarUrl }} style={styles.avatar} />
        ) : notification.imageUrl ? (
          <Image source={{ uri: notification.imageUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <AntDesign
              name={getNotificationIcon(notification.type)}
              size={20}
              color={noctuaColors.textMuted}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.description} numberOfLines={2}>
          {notification.description}
        </Text>
        <Text style={styles.timestamp}>{formatRelativeTime(notification.createdAt)}</Text>

        {/* Action buttons */}
        {hasActions && (
          <View style={styles.actionsContainer}>
            {notification.actions!.map((action, index) => (
              <ActionButton
                key={`${action.action}-${index}`}
                action={action}
                onPress={() => onActionPress(notification.id, action)}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

// Empty state component
function EmptyState({ filter }: { filter: FilterTab }) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <AntDesign name="notification" size={48} color={noctuaColors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>
        {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
      </Text>
      <Text style={styles.emptySubtitle}>You&apos;re all caught up!</Text>
    </View>
  );
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<FilterTab>('all');

  const filteredNotifications = useMemo(() => {
    if (filter === 'unread') {
      return notifications.filter((n) => !n.isRead);
    }
    return notifications;
  }, [notifications, filter]);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const handleActionPress = useCallback(
    (notificationId: string, action: NotificationAction) => {
      // Handle action based on type
      console.log(`Action ${action.action} pressed for notification ${notificationId}`);

      // For accept/decline, remove the notification or mark as read
      if (action.action === 'accept' || action.action === 'decline') {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
      } else if (action.action === 'follow_back') {
        // Mark as read after follow back
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <NotificationItem notification={item} onActionPress={handleActionPress} />
    ),
    [handleActionPress]
  );

  const keyExtractor = useCallback((item: Notification) => item.id, []);

  const ListHeaderComponent = useMemo(
    () => (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead} activeOpacity={0.7}>
            <Text style={styles.markAllRead}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [unreadCount, handleMarkAllAsRead]
  );

  const ListFooterComponent = useMemo(
    () => (
      <View style={styles.filterContainer}>
        <Pressable
          style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[styles.filterTab, filter === 'unread' && styles.filterTabActive]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterTabText, filter === 'unread' && styles.filterTabTextActive]}>
            Unread
          </Text>
          {unreadCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
    ),
    [filter, unreadCount]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={<EmptyState filter={filter} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  listContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: noctuaColors.text,
  },
  markAllRead: {
    fontSize: 14,
    fontWeight: '600',
    color: noctuaColors.primary,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: noctuaColors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  filterTabActive: {
    backgroundColor: noctuaColors.surfaceSoft,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: noctuaColors.textMuted,
  },
  filterTabTextActive: {
    color: noctuaColors.text,
  },
  filterBadge: {
    backgroundColor: noctuaColors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: noctuaColors.text,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: noctuaColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    padding: 14,
    gap: 12,
  },
  notificationCardUnread: {
    backgroundColor: noctuaColors.surfaceSoft,
    borderColor: noctuaColors.primary,
    borderWidth: 1,
  },
  unreadDot: {
    position: 'absolute',
    left: 4,
    top: '50%',
    marginTop: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: noctuaColors.primary,
  },
  avatarContainer: {
    flexShrink: 0,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: noctuaColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    gap: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: noctuaColors.text,
  },
  timestamp: {
    fontSize: 12,
    color: noctuaColors.textMuted,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: noctuaColors.surface,
    borderWidth: 1,
    borderColor: noctuaColors.border,
  },
  actionButtonAccept: {
    backgroundColor: noctuaColors.success,
    borderColor: noctuaColors.success,
  },
  actionButtonDecline: {
    backgroundColor: 'transparent',
    borderColor: noctuaColors.border,
  },
  actionButtonFollow: {
    backgroundColor: noctuaColors.primary,
    borderColor: noctuaColors.primary,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: noctuaColors.text,
  },
  actionButtonTextAccept: {
    color: '#000',
  },
  actionButtonTextDecline: {
    color: noctuaColors.textMuted,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: noctuaColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: noctuaColors.text,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: noctuaColors.textMuted,
  },
});
