import { useMemo, useState } from 'react';
import { Link, router } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { usePlansQuery } from '@/features/plans/hooks';
import type { Plan, PlanEnergy } from '@/features/plans/types';
import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

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

  return (
    <ScreenContainer>
      <View style={{ gap: 6 }}>
        <Text selectable style={{ color: noctuaColors.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>
          CURRENT LOCATION
        </Text>
        <Text selectable style={{ color: noctuaColors.text, fontSize: 30, fontWeight: '800' }}>
          Paris, France
        </Text>
        <Link href="/notifications" style={{ color: noctuaColors.textMuted, fontWeight: '700' }}>
          Ver notificaciones
        </Link>
      </View>

      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar planes, música, zonas..."
        placeholderTextColor={noctuaColors.textMuted}
        style={{
          backgroundColor: noctuaColors.surface,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: noctuaColors.border,
          paddingHorizontal: 16,
          paddingVertical: 12,
          color: noctuaColors.text,
          fontWeight: '600',
        }}
      />

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {filters.map((filterItem) => (
          <Pressable
            key={filterItem.value}
            onPress={() => setActiveFilter(filterItem.value)}
            style={{
              borderRadius: 999,
              borderWidth: 1,
              borderColor: activeFilter === filterItem.value ? noctuaColors.primary : noctuaColors.border,
              backgroundColor: activeFilter === filterItem.value ? noctuaColors.primary : noctuaColors.surface,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Text
              selectable
              style={{
                color: activeFilter === filterItem.value ? '#fff' : noctuaColors.text,
                fontWeight: '700',
                fontSize: 12,
              }}
            >
              {filterItem.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Link href="/(tabs)/(feed)/create-plan" asChild>
        <Pressable
          style={{
            backgroundColor: noctuaColors.primary,
            borderRadius: 999,
            paddingVertical: 13,
            alignItems: 'center',
          }}
        >
          <Text selectable style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
            + Crear un nuevo plan
          </Text>
        </Pressable>
      </Link>

      {isLoading ? (
        <Text selectable style={{ color: noctuaColors.textMuted, fontSize: 14 }}>
          Cargando planes...
        </Text>
      ) : (
        filteredPlans.map((plan: Plan, index: number) => (
          <Animated.View key={plan.id} entering={FadeInDown.delay(index * 80).duration(320)}>
            <Pressable
              onPress={() => router.push(`/plan/${plan.id}`)}
              style={{
                backgroundColor: noctuaColors.surface,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: noctuaColors.border,
                padding: 14,
                gap: 8,
              }}
            >
              <Text selectable style={{ color: noctuaColors.text, fontSize: 18, fontWeight: '800' }}>
                {plan.title}
              </Text>
              <Text selectable style={{ color: noctuaColors.textMuted }}>
                {plan.location} • {plan.startsAt}
              </Text>
              <Text selectable style={{ color: noctuaColors.primary, fontWeight: '700' }}>
                {plan.attendees}/{plan.maxAttendees} asistentes
              </Text>
            </Pressable>
          </Animated.View>
        ))
      )}
    </ScreenContainer>
  );
}

