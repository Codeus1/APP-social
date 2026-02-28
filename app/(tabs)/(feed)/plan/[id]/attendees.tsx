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
import { useLocalSearchParams, router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import { noctuaColors } from '@/lib/theme/tokens';
import { trpc } from '@/lib/trpc/client';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Attendee {
    id: string;
    name: string;
    avatarUrl: string | null;
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function AttendeeRow({ attendee }: { attendee: Attendee }) {
    return (
        <View style={styles.row}>
            {attendee.avatarUrl ? (
                <Image
                    source={{ uri: attendee.avatarUrl }}
                    style={styles.avatar}
                />
            ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text style={styles.avatarInitial}>
                        {attendee.name.charAt(0).toUpperCase()}
                    </Text>
                </View>
            )}
            <Text style={styles.name}>{attendee.name}</Text>
        </View>
    );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function PlanAttendeesScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: attendees = [], isPending } =
        trpc.plans.getAttendees.useQuery({ planId: id }, { enabled: !!id });

    const renderItem = useCallback(
        ({ item }: { item: Attendee }) => <AttendeeRow attendee={item} />,
        [],
    );

    const keyExtractor = useCallback((a: Attendee) => a.id, []);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            {/* Fixed header */}
            <View style={styles.header}>
                <Pressable
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    hitSlop={10}
                >
                    <AntDesign
                        name="arrow-left"
                        size={20}
                        color={noctuaColors.text}
                    />
                </Pressable>
                <Text style={styles.headerTitle}>
                    Who's Going{' '}
                    {attendees.length > 0 ? `(${attendees.length})` : ''}
                </Text>
                <View style={styles.headerRight} />
            </View>

            <FlatList
                data={attendees as Attendee[]}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                contentContainerStyle={styles.list}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>
                            {isPending ? 'Loading…' : 'No attendees yet.'}
                        </Text>
                    </View>
                }
                showsVerticalScrollIndicator={false}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: noctuaColors.border,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: noctuaColors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: noctuaColors.text,
        fontSize: 18,
        fontWeight: '800',
    },
    headerRight: {
        width: 36,
    },
    list: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 14,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    avatarFallback: {
        backgroundColor: noctuaColors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        color: noctuaColors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    name: {
        color: noctuaColors.text,
        fontSize: 16,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: noctuaColors.border,
        marginLeft: 62,
    },
    empty: {
        paddingTop: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: noctuaColors.textMuted,
        fontSize: 15,
    },
});
