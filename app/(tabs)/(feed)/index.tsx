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

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_CHIPS = [
    { label: 'For You', value: 'all' },
    { label: 'Tonight', value: 'tonight' },
    { label: 'High Energy', value: 'high' },
    { label: 'Chill', value: 'low' },
] as const;

type FilterValue = (typeof FILTER_CHIPS)[number]['value'];

// ─── Subcomponents ────────────────────────────────────────────────────────────

function Separator() {
    return <View style={styles.separator} />;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FeedScreen() {
    const { data: plans = [], isLoading } = usePlansQuery();
    const [activeFilter, setActiveFilter] = useState<FilterValue>('all');
    const [search, setSearch] = useState('');

    const filteredPlans = useMemo<Plan[]>(() => {
        const query = search.trim().toLowerCase();
        return plans.filter((plan: Plan) => {
            const matchesQuery =
                query.length === 0 ||
                plan.title.toLowerCase().includes(query) ||
                plan.location.toLowerCase().includes(query) ||
                plan.tags.some((tag: string) =>
                    tag.toLowerCase().includes(query),
                );
            if (!matchesQuery) return false;
            switch (activeFilter) {
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
        ({ item, index }: { item: Plan; index: number }) => (
            <Animated.View
                entering={FadeInDown.delay(index * 70).duration(300)}
            >
                <FeaturedPlanCard
                    plan={item}
                    onPress={() => navigateToPlan(item.id)}
                />
            </Animated.View>
        ),
        [navigateToPlan],
    );

    const keyExtractor = useCallback((item: Plan) => item.id, []);

    const ListEmpty = useCallback(
        () => (
            <Text style={styles.emptyText}>
                {isLoading
                    ? 'Cargando planes...'
                    : 'No hay planes disponibles.'}
            </Text>
        ),
        [isLoading],
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <FlatList
                data={filteredPlans}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListHeaderComponent={
                    <FeedHeader
                        search={search}
                        activeFilter={activeFilter}
                        onSearch={setSearch}
                        onFilter={setActiveFilter}
                    />
                }
                ListEmptyComponent={ListEmpty}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={Separator}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews
                windowSize={7}
                maxToRenderPerBatch={5}
                initialNumToRender={4}
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

// ─── Feed Header ──────────────────────────────────────────────────────────────

interface FeedHeaderProps {
    search: string;
    activeFilter: FilterValue;
    onSearch: (v: string) => void;
    onFilter: (v: FilterValue) => void;
}

function FeedHeader({
    search,
    activeFilter,
    onSearch,
    onFilter,
}: FeedHeaderProps) {
    return (
        <View style={styles.headerContainer}>
            {/* Title */}
            <View style={styles.locationRow}>
                <View>
                    <Text style={styles.locationLabel}>PLANES CERCA</Text>
                    <Text style={styles.locationCity}>Descubre 🌙</Text>
                </View>
            </View>

            {/* Search bar */}
            <View style={styles.searchWrapper}>
                <AntDesign
                    name="search"
                    size={16}
                    color={noctuaColors.textMuted}
                />
                <TextInput
                    value={search}
                    onChangeText={onSearch}
                    placeholder="Busca techno, rooftop, chill..."
                    placeholderTextColor={noctuaColors.textMuted}
                    style={styles.searchInput}
                />
            </View>

            {/* Filter chips */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContent}
                style={styles.filtersScroll}
            >
                {FILTER_CHIPS.map((chip) => {
                    const isActive = activeFilter === chip.value;
                    return (
                        <Pressable
                            key={chip.value}
                            onPress={() => onFilter(chip.value)}
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
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: noctuaColors.background,
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    headerContainer: {
        gap: 16,
        marginBottom: 20,
    },
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
    locationCity: {
        color: noctuaColors.text,
        fontSize: 26,
        fontWeight: '800',
        marginTop: 2,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: noctuaColors.surface,
        borderRadius: noctuaRadii.chip,
        borderWidth: 1,
        borderColor: noctuaColors.border,
        paddingHorizontal: 14,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        color: noctuaColors.text,
        fontWeight: '500',
        paddingVertical: 12,
        fontSize: 14,
    },
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
    emptyText: {
        color: noctuaColors.textMuted,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 40,
    },
    separator: {
        height: 14,
    },
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
