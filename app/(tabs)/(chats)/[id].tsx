import { useCallback, useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { trpc } from '@/lib/trpc/client';
import { useAuth } from '@/lib/auth/auth-context';
import { noctuaColors } from '@/lib/theme/tokens';
import type { Message } from '@/features/chats/types';

// Simple time formatter native to JS Date API
function formatRelativeTime(dateString: string) {
    return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(dateString));
}

export default function ChatDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [messageText, setMessageText] = useState('');
    const flatListRef = useRef<FlatList>(null);
    const { user } = useAuth();
    const utils = trpc.useUtils();

    const { data: chatMeta, isLoading: isLoadingMeta } =
        trpc.chats.getChatMeta.useQuery({ chatId: id }, { enabled: !!id });

    const { data: messages = [], isLoading: isLoadingMessages } =
        trpc.chats.getMessages.useQuery(
            { chatId: id },
            { enabled: !!id, refetchInterval: 5000 }, // Auto-refresh messages
        );

    const sendMessageMutation = trpc.chats.sendMessage.useMutation({
        onMutate: async (newMsg) => {
            await utils.chats.getMessages.cancel({ chatId: id });
            const previousMessages = utils.chats.getMessages.getData({
                chatId: id,
            });

            utils.chats.getMessages.setData({ chatId: id }, (old) => {
                const optimisticMsg = {
                    id: `tmp-${Date.now()}`,
                    chatId: id,
                    senderId: user?.id ?? '',
                    senderName: user?.name ?? 'You',
                    senderAvatarUrl: user?.avatarUrl ?? null,
                    content: newMsg.content,
                    createdAt: new Date().toISOString(),
                    isCurrentUser: true,
                    isSystemMessage: false,
                };
                return old ? [...old, optimisticMsg] : [optimisticMsg];
            });

            return { previousMessages };
        },
        onError: (err, newMsg, context) => {
            if (context?.previousMessages) {
                utils.chats.getMessages.setData(
                    { chatId: id },
                    context.previousMessages,
                );
            }
        },
        onSettled: () => {
            utils.chats.getMessages.invalidate({ chatId: id });
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        },
    });

    const handleBack = useCallback(() => {
        router.back();
    }, []);

    const handleSend = useCallback(() => {
        if (!messageText.trim() || !id) return;
        sendMessageMutation.mutate({ chatId: id, content: messageText.trim() });
        setMessageText('');
    }, [messageText, id, sendMessageMutation]);

    const renderHeader = useCallback(
        () => (
            <View style={styles.header}>
                <Pressable
                    style={styles.backButton}
                    onPress={handleBack}
                    hitSlop={12}
                >
                    <Text style={styles.backIcon}>←</Text>
                </Pressable>

                {chatMeta && (
                    <View style={styles.headerContent}>
                        <Image
                            source={{ uri: chatMeta.avatarUrl }}
                            style={styles.headerImage}
                        />
                        <View style={styles.headerText}>
                            <Text style={styles.headerTitle} numberOfLines={1}>
                                {chatMeta.title}
                            </Text>
                            <Text style={styles.headerSubtitle}>
                                {chatMeta.subtitle}
                            </Text>
                        </View>
                    </View>
                )}

                <Pressable style={styles.menuButton} hitSlop={12}>
                    <Text style={styles.menuIcon}>⋮</Text>
                </Pressable>
            </View>
        ),
        [chatMeta, handleBack],
    );

    const renderMessage = useCallback(({ item }: { item: Message }) => {
        if (item.isSystemMessage) {
            return (
                <View style={styles.systemMessageContainer}>
                    <Text style={styles.systemMessage}>{item.content}</Text>
                </View>
            );
        }

        if (item.isCurrentUser) {
            return (
                <View style={styles.currentUserMessageContainer}>
                    <View style={styles.currentUserBubble}>
                        <Text style={styles.currentUserText}>
                            {item.content}
                        </Text>
                    </View>
                    <Text style={styles.messageTime}>
                        {formatRelativeTime(item.createdAt)}
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.otherUserMessageContainer}>
                <Image
                    source={{ uri: item.senderAvatarUrl }}
                    style={styles.avatar}
                />
                <View style={styles.otherUserContent}>
                    <Text style={styles.senderName}>{item.senderName}</Text>
                    <View style={styles.otherUserBubble}>
                        <Text style={styles.otherUserText}>{item.content}</Text>
                    </View>
                    <Text style={styles.messageTime}>
                        {formatRelativeTime(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    }, []);

    const keyExtractor = useCallback((item: Message) => item.id, []);

    const ListFooter = useCallback(
        () => <View style={styles.listFooter} />,
        [],
    );

    if (isLoadingMeta) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.notFound}>
                    <Text style={styles.notFoundText}>Loading chat...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (!chatMeta) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.notFound}>
                    <Text style={styles.notFoundText}>Chat not found</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                {renderHeader()}

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: false })
                    }
                    ListFooterComponent={ListFooter}
                />

                <View style={styles.inputContainer}>
                    <Pressable style={styles.attachButton} hitSlop={12}>
                        <Text style={styles.attachIcon}>+</Text>
                    </Pressable>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Type a message..."
                        placeholderTextColor={noctuaColors.textMuted}
                        value={messageText}
                        onChangeText={setMessageText}
                        multiline
                        maxLength={500}
                    />
                    <Pressable
                        style={[
                            styles.sendButton,
                            !messageText.trim() && styles.sendButtonDisabled,
                        ]}
                        onPress={handleSend}
                        disabled={!messageText.trim()}
                        hitSlop={12}
                    >
                        <Text style={styles.sendIcon}>➤</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: noctuaColors.background,
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: noctuaColors.border,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: noctuaColors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        color: noctuaColors.text,
        fontSize: 20,
        fontWeight: '600',
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        gap: 10,
    },
    headerImage: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: noctuaColors.surface,
    },
    headerText: {
        flex: 1,
    },
    headerTitle: {
        color: noctuaColors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    headerSubtitle: {
        color: noctuaColors.textMuted,
        fontSize: 12,
    },
    menuButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: noctuaColors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        color: noctuaColors.text,
        fontSize: 20,
        fontWeight: '700',
    },
    messagesList: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    listFooter: {
        height: 16,
    },
    systemMessageContainer: {
        alignItems: 'center',
        marginVertical: 12,
    },
    systemMessage: {
        color: noctuaColors.textMuted,
        fontSize: 13,
        backgroundColor: noctuaColors.surface,
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    currentUserMessageContainer: {
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    currentUserBubble: {
        backgroundColor: noctuaColors.primary,
        borderRadius: 18,
        borderBottomRightRadius: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
        maxWidth: '75%',
    },
    currentUserText: {
        color: noctuaColors.text,
        fontSize: 15,
        lineHeight: 20,
    },
    otherUserMessageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 8,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: noctuaColors.surface,
    },
    otherUserContent: {
        flex: 1,
        maxWidth: '80%',
    },
    senderName: {
        color: noctuaColors.textMuted,
        fontSize: 12,
        marginBottom: 4,
        marginLeft: 4,
    },
    otherUserBubble: {
        backgroundColor: noctuaColors.surface,
        borderRadius: 18,
        borderBottomLeftRadius: 6,
        paddingHorizontal: 14,
        paddingVertical: 10,
    },
    otherUserText: {
        color: noctuaColors.text,
        fontSize: 15,
        lineHeight: 20,
    },
    messageTime: {
        color: noctuaColors.textMuted,
        fontSize: 11,
        marginTop: 4,
        marginRight: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: 12,
        paddingVertical: 12,
        gap: 8,
        backgroundColor: noctuaColors.background,
        borderTopWidth: 1,
        borderTopColor: noctuaColors.border,
    },
    attachButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: noctuaColors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    attachIcon: {
        color: noctuaColors.textMuted,
        fontSize: 22,
        fontWeight: '300',
    },
    textInput: {
        flex: 1,
        backgroundColor: noctuaColors.surface,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        color: noctuaColors.text,
        fontSize: 15,
        maxHeight: 100,
        minHeight: 40,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: noctuaColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: noctuaColors.surface,
    },
    sendIcon: {
        color: noctuaColors.text,
        fontSize: 18,
        marginLeft: 2,
    },
    notFound: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notFoundText: {
        color: noctuaColors.textMuted,
        fontSize: 16,
    },
});
