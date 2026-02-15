import { useCallback, useMemo, useState } from 'react';
import { Link, router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { usePlansQuery } from '@/features/plans/hooks';
import type { Plan, PlanEnergy } from '@/features/plans/types';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { SafeAreaView } from 'react-native-safe-area-context';

const filters: { label: string; value: PlanEnergy | 'all' }[] = [
  { label: 'For You', value: 'all' },
  { label: 'Tonight', value: 'low' },
  { label: 'High Energy', value: 'high' },
  { label: 'Social', value: 'medium' },
];

export default function FeedScreen() {
  const { data: plans = [], isLoading } = usePlansQuery();
  const [activeFilter, setActiveFilter] = useState<PlanEnergy | 'all'>('all');
  const [search, setSearch] = useState('');

  const filteredPlans = useMemo(() => {
    return plans.filter((plan: Plan) => {
      const matchesFilter = activeFilter === 'all' ? true : plan.energy === activeFilter;
      const query = search.trim().toLowerCase();
      const matchesQuery =
        query.length === 0 ||
        plan.title.toLowerCase().includes(query) ||
        plan.location.toLowerCase().includes(query) ||
        plan.tags.some((tag: string) => tag.toLowerCase().includes(query));

      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, plans, search]);

  const renderItem = useCallback(
    ({ item, index }: { item: Plan; index: number }) => (
      <Animated.View entering={FadeInDown.delay(index * 80).duration(320)}>
        <Pressable
          onPress={() => router.push(`/plan/${item.id}`)}
          style={styles.planCard}
        >
          <Text selectable style={styles.planTitle}>
            {item.title}
          </Text>
          <Text selectable style={styles.planMeta}>
            {item.location} • {item.startsAt}
          </Text>
          <Text selectable style={styles.planAttendees}>
            {item.attendees}/{item.maxAttendees} asistentes
          </Text>
        </Pressable>
      </Animated.View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Plan) => item.id, []);

  const ListHeader = useMemo(
    () => (
      <View style={styles.headerContainer}>
        <View style={styles.locationBlock}>
          <Text selectable style={styles.locationLabel}>
            CURRENT LOCATION
          </Text>
          <Text selectable style={styles.locationCity}>
            Paris, France
          </Text>
          <Link href="/notifications" style={styles.notificationsLink}>
            Ver notificaciones
          </Link>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar planes, música, zonas..."
          placeholderTextColor={noctuaColors.textMuted}
          style={styles.searchInput}
        />

        <View style={styles.filtersRow}>
          {filters.map((filterItem) => {
            const isActive = activeFilter === filterItem.value;
            return (
              <Pressable
                key={filterItem.value}
                onPress={() => setActiveFilter(filterItem.value)}
                style={[
                  styles.filterChip,
                  isActive ? styles.filterChipActive : styles.filterChipInactive,
                ]}
              >
                <Text
                  selectable
                  style={[
                    styles.filterChipText,
                    isActive ? styles.filterChipTextActive : styles.filterChipTextInactive,
                  ]}
                >
                  {filterItem.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Link href="/(tabs)/(feed)/create-plan" asChild>
          <Pressable style={styles.createButton}>
            <Text selectable style={styles.createButtonText}>
              + Crear un nuevo plan
            </Text>
          </Pressable>
        </Link>
      </View>
    ),
    [activeFilter, search],
  );

  const ListEmpty = useCallback(
    () =>
      isLoading ? (
        <Text selectable style={styles.loadingText}>
          Cargando planes...
        </Text>
      ) : (
        <Text selectable style={styles.loadingText}>
          No se encontraron planes.
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
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
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
  headerContainer: {
    gap: 16,
    marginBottom: 16,
  },
  locationBlock: {
    gap: 6,
  },
  locationLabel: {
    color: noctuaColors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  locationCity: {
    color: noctuaColors.text,
    fontSize: 30,
    fontWeight: '800',
  },
  notificationsLink: {
    color: noctuaColors.textMuted,
    fontWeight: '700',
  },
  searchInput: {
    backgroundColor: noctuaColors.surface,
    borderRadius: noctuaRadii.chip,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: noctuaColors.text,
    fontWeight: '600',
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    borderRadius: noctuaRadii.chip,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  filterChipActive: {
    borderColor: noctuaColors.primary,
    backgroundColor: noctuaColors.primary,
  },
  filterChipInactive: {
    borderColor: noctuaColors.border,
    backgroundColor: noctuaColors.surface,
  },
  filterChipText: {
    fontWeight: '700',
    fontSize: 12,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  filterChipTextInactive: {
    color: noctuaColors.text,
  },
  createButton: {
    backgroundColor: noctuaColors.primary,
    borderRadius: noctuaRadii.button,
    paddingVertical: 13,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  planCard: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    padding: 14,
    gap: 8,
  },
  planTitle: {
    color: noctuaColors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  planMeta: {
    color: noctuaColors.textMuted,
  },
  planAttendees: {
    color: noctuaColors.primary,
    fontWeight: '700',
  },
  loadingText: {
    color: noctuaColors.textMuted,
    fontSize: 14,
  },
  separator: {
    height: 12,
  },
});
