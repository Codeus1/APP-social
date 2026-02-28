import { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import {
    useNotificationsQuery,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
    useDeleteNotification,
    type AppNotification,
} from '@/features/notifications/hooks';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'unread';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRelativeTime(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60_000);
    const hours = Math.floor(diffMs / 3_600_000);
    const days = Math.floor(diffMs / 86_400_000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
}

function getIcon(
    type: AppNotification['type'],
): keyof typeof AntDesign.glyphMap {
    switch (type) {
        case 'join_accepted':
            return 'check-circle';
        case 'join_declined':
            return 'close-circle';
        case 'join_request':
            return 'user';
        case 'plan_update':
            return 'calendar';
        default:
            return 'notification';
    }
}

function getIconColor(type: AppNotification['type']): string {
    switch (type) {
        case 'join_accepted':
            return noctuaColors.success;
        case 'join_declined':
            return '#ff4444';
        default:
            return noctuaColors.primary;
    }
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

interface NotificationItemProps {
    notification: AppNotification;
    onPress: (n: AppNotification) => void;
    onDelete: (id: string) => void;
}

function NotificationItem({
    notification,
    onPress,
    onDelete,
}: NotificationItemProps) {
    const avatarUri = notification.sender?.avatarUrl;

    return (
        <Pressable
            style={[styles.card, !notification.isRead && styles.cardUnread]}
            onPress={() => onPress(notification)}
        >
            {/* Unread pulse */}
            {!notification.isRead && <View style={styles.unreadDot} />}

            {/* Avatar / icon */}
            <View style={styles.iconWrap}>
                {avatarUri ? (
                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                ) : (
                    <View
                        style={[
                            styles.iconCircle,
                            {
                                backgroundColor: `${getIconColor(notification.type)}22`,
                            },
                        ]}
                    >
                        <AntDesign
                            name={getIcon(notification.type)}
                            size={22}
                            color={getIconColor(notification.type)}
                        />
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>
                    {notification.title}
                </Text>
                <Text style={styles.body} numberOfLines={2}>
                    {notification.body}
                </Text>
                <Text style={styles.time}>
                    {formatRelativeTime(notification.createdAt)}
                </Text>

                {/* Deep-link to plan */}
                {notification.planId && (
                    <Pressable
                        style={styles.viewPlanBtn}
                        onPress={() =>
                            router.push(`/plan/${notification.planId}`)
                        }
                    >
                        <Text style={styles.viewPlanText}>View plan →</Text>
                    </Pressable>
                )}
            </View>

            {/* Delete */}
            <Pressable
                style={styles.deleteBtn}
                hitSlop={8}
                onPress={() => onDelete(notification.id)}
            >
                <AntDesign
                    name="close"
                    size={14}
                    color={noctuaColors.textMuted}
                />
            </Pressable>
        </Pressable>
    );
}

function EmptyState({ isLoading }: { isLoading: boolean }) {
    return (
        <View style={styles.empty}>
            <AntDesign
                name="notification"
                size={48}
                color={noctuaColors.textMuted}
            />
            <Text style={styles.emptyTitle}>
                {isLoading ? 'Loading…' : 'All caught up!'}
            </Text>
            <Text style={styles.emptyBody}>No notifications yet.</Text>
        </View>
    );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NotificationsScreen() {
    const [filter, setFilter] = useState<FilterTab>('all');

    const { data: rawNotifications = [], isPending } = useNotificationsQuery(
        filter === 'unread',
    );

    // tRPC returns type as string; cast to satisfy our union
    const notifications = rawNotifications as AppNotification[];
    const markReadMutation = useMarkNotificationRead();
    const markAllReadMutation = useMarkAllNotificationsRead();
    const deleteMutation = useDeleteNotification();

    const unreadCount = useMemo(
        () => notifications.filter((n) => !n.isRead).length,
        [notifications],
    );

    const handlePress = useCallback(
        (n: AppNotification) => {
            if (!n.isRead) markReadMutation.mutate({ id: n.id });
            if (n.planId) router.push(`/plan/${n.planId}`);
        },
        [markReadMutation],
    );

    const handleDelete = useCallback(
        (id: string) => {
            deleteMutation.mutate({ id });
        },
        [deleteMutation],
    );

    const renderItem = useCallback(
        ({ item }: { item: AppNotification }) => (
            <NotificationItem
                notification={item}
                onPress={handlePress}
                onDelete={handleDelete}
            />
        ),
        [handlePress, handleDelete],
    );

    const keyExtractor = useCallback((n: AppNotification) => n.id, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                {unreadCount > 0 && (
                    <Pressable
                        onPress={() => markAllReadMutation.mutate()}
                        disabled={markAllReadMutation.isPending}
                    >
                        <Text style={styles.markAll}>Mark all read</Text>
                    </Pressable>
                )}
            </View>

            {/* ── Filter tabs ── */}
            <View style={styles.tabs}>
                {(['all', 'unread'] as const).map((tab) => {
                    const active = filter === tab;
                    return (
                        <Pressable
                            key={tab}
                            style={[styles.tab, active && styles.tabActive]}
                            onPress={() => setFilter(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    active && styles.tabTextActive,
                                ]}
                            >
                                {tab === 'all' ? 'All' : 'Unread'}
                            </Text>
                            {tab === 'unread' && unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {unreadCount}
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </View>

            {/* ── List ── */}
            <FlatList
                data={notifications}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                style={styles.flex}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={<EmptyState isLoading={isPending} />}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                initialNumToRender={10}
            />
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: noctuaColors.background,
    },
    flex: {
        flex: 1,
    },

    /* Header */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
    },
    headerTitle: {
        color: noctuaColors.text,
        fontSize: 28,
        fontWeight: '800',
    },
    markAll: {
        color: noctuaColors.primary,
        fontSize: 14,
        fontWeight: '600',
    },

    /* Filter tabs */
    tabs: {
        flexDirection: 'row',
        marginHorizontal: 20,
        backgroundColor: noctuaColors.surface,
        borderRadius: noctuaRadii.chip,
        padding: 4,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 9,
        borderRadius: noctuaRadii.chip - 2,
        gap: 6,
    },
    tabActive: {
        backgroundColor: noctuaColors.surfaceSoft,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: noctuaColors.textMuted,
    },
    tabTextActive: {
        color: noctuaColors.text,
    },
    badge: {
        backgroundColor: noctuaColors.primary,
        borderRadius: 10,
        minWidth: 20,
        paddingHorizontal: 5,
        paddingVertical: 2,
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },

    /* List */
    list: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 40,
    },

    /* Notification card */
    card: {
        flexDirection: 'row',
        backgroundColor: noctuaColors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: noctuaColors.border,
        padding: 14,
        gap: 12,
        alignItems: 'flex-start',
    },
    cardUnread: {
        backgroundColor: noctuaColors.surfaceSoft,
        borderColor: noctuaColors.primary,
    },
    unreadDot: {
        position: 'absolute',
        left: 5,
        top: '50%',
        marginTop: -4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: noctuaColors.primary,
    },
    iconWrap: {
        flexShrink: 0,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
    },
    iconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        gap: 2,
    },
    title: {
        color: noctuaColors.text,
        fontSize: 15,
        fontWeight: '700',
        lineHeight: 20,
    },
    body: {
        color: noctuaColors.textMuted,
        fontSize: 13,
        lineHeight: 18,
    },
    time: {
        color: noctuaColors.textMuted,
        fontSize: 11,
        marginTop: 2,
    },
    viewPlanBtn: {
        marginTop: 6,
        alignSelf: 'flex-start',
        backgroundColor: `${noctuaColors.primary}22`,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    viewPlanText: {
        color: noctuaColors.primary,
        fontSize: 12,
        fontWeight: '700',
    },
    deleteBtn: {
        padding: 4,
    },

    /* Empty */
    empty: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 12,
    },
    emptyTitle: {
        color: noctuaColors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    emptyBody: {
        color: noctuaColors.textMuted,
        fontSize: 14,
    },
});
