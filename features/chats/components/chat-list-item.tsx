import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { noctuaColors } from '@/lib/theme/tokens';
import type { Chat } from '@/features/chats/types';
import { formatRelativeTime } from '../utils/time';

interface Props {
    chat: Chat;
    onPress: (chatId: string) => void;
}

export const ChatListItem = React.memo(function ChatListItem({
    chat,
    onPress,
}: Props) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
            onPress={() => onPress(chat.id)}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: chat.planImageUrl }}
                    style={styles.image}
                />
                {chat.isHappeningNow && <View style={styles.activeDot} />}
            </View>

            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={1}>
                        {chat.planTitle}
                    </Text>
                    <Text style={styles.timeLabel}>
                        {formatRelativeTime(chat.lastMessageAt)}
                    </Text>
                </View>
                <Text style={styles.hostName}>Hosted by {chat.hostName}</Text>
                <View style={styles.messageRow}>
                    <Text style={styles.lastMessage} numberOfLines={1}>
                        {chat.lastMessage}
                    </Text>
                    {chat.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadCount}>
                                {chat.unreadCount}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 12,
        gap: 12,
    },
    pressed: {
        opacity: 0.7,
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: noctuaColors.surface,
    },
    activeDot: {
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
    content: {
        flex: 1,
        gap: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        color: noctuaColors.text,
        fontSize: 16,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
    },
    timeLabel: {
        color: noctuaColors.textMuted,
        fontSize: 12,
    },
    hostName: {
        color: noctuaColors.textMuted,
        fontSize: 13,
    },
    messageRow: {
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
});
