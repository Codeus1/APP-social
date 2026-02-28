import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, RelativePathString } from 'expo-router';

import { trpc } from '@/lib/trpc/client';
import { noctuaColors } from '@/lib/theme/tokens';
import type { Chat } from '@/features/chats/types';
import { ChatListHeader } from '@/features/chats/components/chat-list-header';
import { ChatListItem } from '@/features/chats/components/chat-list-item';

export default function ChatsScreen() {
    const { data: chats, isLoading } = trpc.chats.getUserChats.useQuery();

    const handleChatPress = useCallback((chatId: string) => {
        router.push(`/(tabs)/(chats)/${chatId}` as RelativePathString);
    }, []);

    const renderItem = useCallback(
        ({ item }: { item: Chat }) => (
            <ChatListItem chat={item} onPress={handleChatPress} />
        ),
        [handleChatPress],
    );

    const keyExtractor = useCallback((item: Chat) => item.id, []);

    const ItemSeparator = useCallback(
        () => <View style={styles.separator} />,
        [],
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <ChatListHeader />
            {isLoading ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Loading chats...</Text>
                </View>
            ) : !chats || chats.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                        No chats yet. Join a plan to start chatting!
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={chats}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={ItemSeparator}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: noctuaColors.background,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 32,
    },
    separator: {
        height: 1,
        backgroundColor: noctuaColors.border,
        marginLeft: 68, // Align with text (56 image + 12 gap)
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyText: {
        color: noctuaColors.textMuted,
        fontSize: 16,
        textAlign: 'center',
    },
});
