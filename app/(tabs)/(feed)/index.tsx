import { useCallback, useMemo, useState } from 'react';
import {
    FlatList,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Platform,
} from 'react-native';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePlansQuery } from '@/features/plans/hooks';
import type { Plan } from '@/features/plans/types';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { FeaturedPlanCard } from '@/components/plans/featured-plan-card';
import { MediumPlanCard } from '@/components/plans/medium-plan-card';
import { CompactPlanCard } from '@/components/plans/compact-plan-card';

const filterChips = [
    { label: 'For You', value: 'all' },
    { label: 'Tonight', value: 'tonight' },
    { label: 'Near Me', value: 'near' },
    { label: 'High Energy', value: 'high' },
    { label: 'Chill', value: 'low' },
] as const;

type FilterValue = (typeof filterChips)[number]['value'];

export default function FeedScreen() {
    const { data: plans = [], isLoading } = usePlansQuery();
    const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
    const [search, setSearch] = useState('');

    const filteredPlans = useMemo(() => {
        return plans.filter((plan: Plan) => {
            const query = search.trim().toLowerCase();
            const matchesQuery =
                query.length === 0 ||
                plan.title.toLowerCase().includes(query) ||
                plan.location.toLowerCase().includes(query) ||
                plan.tags.some((tag: string) =>
                    tag.toLowerCase().includes(query),
                );

            if (!matchesQuery) return false;

            switch (activeFilter) {
                case 'tonight':
                    return true; // All plans are tonight in this context
                case 'near':
                    return true; // Would filter by distance
                case 'high':
                    return plan.energy === 'high';
                case 'low':
                    return plan.energy === 'low';
                default:
                    return true;
            }
        });
    }, [activeFilter, plans, search]);

    const navigateToPlan = useCallback((id: string) => {
        router.push(`/plan/${id}`);
    }, []);

    const renderItem = useCallback(
        ({ item, index }: { item: Plan; index: number }) => {
            let card: React.ReactNode;

            if (index === 0) {
                card = (
                    <FeaturedPlanCard
                        plan={item}
                        onPress={() => navigateToPlan(item.id)}
                    />
                );
            } else if (index === 1) {
                card = (
                    <MediumPlanCard
                        plan={item}
                        onPress={() => navigateToPlan(item.id)}
                    />
                );
            } else {
                card = (
                    <CompactPlanCard
                        plan={item}
                        onPress={() => navigateToPlan(item.id)}
                    />
                );
            }

            return (
                <Animated.View
                    entering={FadeInDown.delay(index * 80).duration(320)}
                >
                    {card}
                </Animated.View>
            );
        },
        [navigateToPlan],
    );

    const keyExtractor = useCallback((item: Plan) => item.id, []);

    const ListHeader = useMemo(
        () => (
            <View style={styles.headerContainer}>
                {/* Location + Avatar row */}
                <View style={styles.locationRow}>
                    <View>
                        <Text style={styles.locationLabel}>
                            CURRENT LOCATION
                        </Text>
                        <View style={styles.cityRow}>
                            <Text style={styles.locationCity}>
                                {'Paris, France'}
                            </Text>
                            <Text style={styles.dropdownArrow}>▾</Text>
                        </View>
                    </View>
                    <View style={styles.userAvatar}>
                        <View style={styles.userAvatarInner} />
                        <View style={styles.onlineDot} />
                    </View>
                </View>

                {/* Search bar */}
                <View style={styles.searchWrapper}>
                    <AntDesign
                        name="search"
                        size={16}
                        color={noctuaColors.textMuted}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Find techno, rooftop bars, chill..."
                        placeholderTextColor={noctuaColors.textMuted}
                        style={styles.searchInput}
                    />
                    <Pressable style={styles.filterIcon}>
                        <AntDesign
                            name="filter"
                            size={18}
                            color={noctuaColors.textMuted}
                            style={styles.filterIconText}
                        />
                    </Pressable>
                </View>

                {/* Filter chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersContent}
                    style={styles.filtersScroll}
                >
                    {filterChips.map((chip) => {
                        const isActive = activeFilter === chip.value;
                        return (
                            <Pressable
                                key={chip.value}
                                onPress={() => setActiveFilter(chip.value)}
                                style={[
                                    styles.filterChip,
                                    isActive
                                        ? styles.filterChipActive
                                        : styles.filterChipInactive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        isActive
                                            ? styles.filterChipTextActive
                                            : styles.filterChipTextInactive,
                                    ]}
                                >
                                    {chip.label}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>
        ),
        [activeFilter, search],
    );

    const ListEmpty = useCallback(
        () =>
            isLoading ? (
                <Text style={styles.emptyText}>Loading plans...</Text>
            ) : (
                <Text style={styles.emptyText}>No plans found.</Text>
            ),
        [isLoading],
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <FlatList
                data={filteredPlans}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={ListHeader}
                ListEmptyComponent={ListEmpty}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={Separator}
                keyboardShouldPersistTaps="handled"
            />

            {/* FAB */}
            <Pressable
                style={styles.fab}
                onPress={() => router.push('/(tabs)/(feed)/create-plan')}
            >
                <AntDesign name="plus" size={28} color="#fff" />
            </Pressable>
        </SafeAreaView>
    );
}

function Separator() {
    return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: noctuaColors.background,
    },
    listContent: {
        flexGrow: 1,
        padding: 16,
        paddingBottom: 100,
    },
    headerContainer: {
        gap: 16,
        marginBottom: 20,
    },

    /* Location header */
    locationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationLabel: {
        color: noctuaColors.primary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.2,
    },
    cityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 2,
    },
    locationCity: {
        color: noctuaColors.text,
        fontSize: 26,
        fontWeight: '800',
    },
    dropdownArrow: {
        color: noctuaColors.text,
        fontSize: 18,
        marginTop: 2,
    },
    userAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: noctuaColors.primary,
        overflow: 'hidden',
        position: 'relative',
    },
    userAvatarInner: {
        flex: 1,
        backgroundColor: noctuaColors.surfaceSoft,
    },
    onlineDot: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: noctuaColors.success,
        borderWidth: 2,
        borderColor: noctuaColors.background,
    },

    /* Search */
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: noctuaColors.surface,
        borderRadius: noctuaRadii.chip,
        borderWidth: 1,
        borderColor: noctuaColors.border,
        paddingHorizontal: 14,
        gap: 8,
    },
    searchIcon: {
        fontSize: 16,
    },
    searchInput: {
        flex: 1,
        color: noctuaColors.text,
        fontWeight: '500',
        paddingVertical: 12,
        fontSize: 14,
    },
    filterIcon: {
        padding: 4,
    },
    filterIconText: {
        color: noctuaColors.textMuted,
        fontSize: 18,
    },

    /* Filters */
    filtersScroll: {
        marginHorizontal: -16,
    },
    filtersContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    filterChip: {
        borderRadius: noctuaRadii.chip,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    filterChipActive: {
        backgroundColor: noctuaColors.primary,
    },
    filterChipInactive: {
        backgroundColor: noctuaColors.surface,
        borderWidth: 1,
        borderColor: noctuaColors.border,
    },
    filterChipText: {
        fontWeight: '700',
        fontSize: 13,
    },
    filterChipTextActive: {
        color: '#fff',
    },
    filterChipTextInactive: {
        color: noctuaColors.text,
    },

    /* Empty */
    emptyText: {
        color: noctuaColors.textMuted,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 40,
    },

    /* Separator */
    separator: {
        height: 14,
    },

    /* FAB */
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: noctuaColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            web: { boxShadow: '0px 4px 8px rgba(244, 37, 140, 0.4)' },
            default: {
                elevation: 8,
                shadowColor: noctuaColors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 8,
            },
        }),
    },
});
