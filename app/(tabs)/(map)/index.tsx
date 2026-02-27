import { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

import { noctuaColors } from '@/lib/theme/tokens';
import { usePlansQuery } from '@/features/plans/hooks';
import type { Plan } from '@/features/plans/types';
// eslint-disable-next-line import/no-unresolved
import { InteractiveMap } from '@/components/map/interactive-map';

// Type for the map region
interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

type FilterType = 'all' | 'now' | 'tonight' | 'week';

const PARIS_REGION: MapRegion = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const FILTER_CHIPS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'now', label: 'Happening Now' },
  { key: 'tonight', label: 'Tonight' },
  { key: 'week', label: 'This Week' },
];

export default function MapScreen() {
  const { data: plans = [], isLoading } = usePlansQuery();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const mapRef = useRef<any>(null);


  // Request user location permission
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        }
      } catch (error) {
        console.log('Location permission denied or error:', error);
      }
    })();
  }, []);

  // Filter plans based on active filter and search query
  const filteredPlans = plans.filter((plan) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !plan.title.toLowerCase().includes(query) &&
        !plan.location.toLowerCase().includes(query) &&
        !plan.tags.some((tag) => tag.toLowerCase().includes(query))
      ) {
        return false;
      }
    }

    // Time filter
    switch (activeFilter) {
      case 'now':
        return plan.isHappeningNow;
      case 'tonight': {
        const planDate = new Date(plan.startsAt);
        const today = new Date();
        return planDate.toDateString() === today.toDateString();
      }
      case 'week': {
        const planDate = new Date(plan.startsAt);
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        return planDate >= now && planDate <= weekFromNow;
      }
      default:
        return true;
    }
  });

  const handlePlanPress = (plan: Plan) => {
    setSelectedPlan(plan);
    // Animate to the plan location
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: plan.coordinates.lat,
          longitude: plan.coordinates.lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  const handleViewPlanDetails = (planId: string) => {
    router.push(`/(tabs)/(feed)/plan/${planId}`);
  };

  const centerOnUser = async () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        500
      );
    } else {
      // Request permission again
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location);
      }
    }
  };

  // Render the native map view
  const renderNativeMap = () => {
    if (!InteractiveMap) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={noctuaColors.primary} />
        </View>
      );
    }

    return (
      <InteractiveMap
        ref={mapRef}
        initialRegion={PARIS_REGION}
        plans={filteredPlans}
        showsUserLocation={!!userLocation}
        userLocation={userLocation}
        onMapReady={() => setMapError(null)}
        onPlanPress={handlePlanPress}
      />
    );
  };

  // Web fallback for maps
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search plans, locations..."
            placeholderTextColor={noctuaColors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FILTER_CHIPS.map((chip) => (
              <Pressable
                key={chip.key}
                style={[styles.filterChip, activeFilter === chip.key && styles.filterChipActive]}
                onPress={() => setActiveFilter(chip.key)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === chip.key && styles.filterChipTextActive,
                  ]}
                >
                  {chip.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.webMapPlaceholder}>
          <Text style={styles.webMapTitle}>Interactive Map</Text>
          <Text style={styles.webMapSubtitle}>
            Map view is best experienced on mobile devices
          </Text>
          <Text style={styles.webMapPlansCount}>
            {filteredPlans.length} plans {activeFilter !== 'all' ? `(${activeFilter})` : ''}
          </Text>
        </View>

        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Nearby Plans</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plansScroll}>
            {isLoading ? (
              <ActivityIndicator color={noctuaColors.primary} />
            ) : (
              filteredPlans.map((plan) => (
                <Pressable
                  key={plan.id}
                  style={styles.planCard}
                  onPress={() => handleViewPlanDetails(plan.id)}
                >
                  <Text style={styles.planCardTitle} numberOfLines={1}>
                    {plan.title}
                  </Text>
                  <Text style={styles.planCardLocation} numberOfLines={1}>
                    {plan.location}
                  </Text>
                  <Text style={styles.planCardDistance}>{plan.distance}</Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Native map view
  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={noctuaColors.primary} />
        </View>
      ) : mapError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{mapError}</Text>
        </View>
      ) : (
        renderNativeMap()
      )}

      {/* Search Bar Overlay */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search plans, locations..."
          placeholderTextColor={noctuaColors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTER_CHIPS.map((chip) => (
            <Pressable
              key={chip.key}
              style={[styles.filterChip, activeFilter === chip.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(chip.key)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === chip.key && styles.filterChipTextActive,
                ]}
              >
                {chip.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* User Location Button */}
      <Pressable style={styles.locationButton} onPress={centerOnUser}>
        <AntDesign name="aim" size={20} color={noctuaColors.text} />
      </Pressable>

      {/* Bottom Sheet with Plans */}
      <View style={styles.bottomSheet}>
        <Text style={styles.bottomSheetTitle}>
          {selectedPlan ? 'Selected Plan' : 'Nearby Plans'}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.plansScroll}>
          {selectedPlan ? (
            <Pressable
              style={styles.selectedPlanCard}
              onPress={() => handleViewPlanDetails(selectedPlan.id)}
            >
              <Text style={styles.selectedPlanTitle}>{selectedPlan.title}</Text>
              <Text style={styles.selectedPlanLocation}>{selectedPlan.location}</Text>
              <View style={styles.selectedPlanMeta}>
                <Text style={styles.selectedPlanAttendees}>
                  Attendees {selectedPlan.attendees}/{selectedPlan.maxAttendees}
                </Text>
                <Text style={styles.selectedPlanMatch}>
                  {selectedPlan.matchPercentage}% match
                </Text>
              </View>
              <View style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details →</Text>
              </View>
            </Pressable>
          ) : (
            filteredPlans.map((plan) => (
              <Pressable
                key={plan.id}
                style={styles.planCard}
                onPress={() => handlePlanPress(plan)}
              >
                <Text style={styles.planCardTitle} numberOfLines={1}>
                  {plan.title}
                </Text>
                <Text style={styles.planCardLocation} numberOfLines={1}>
                  {plan.location}
                </Text>
                <Text style={styles.planCardDistance}>{plan.distance}</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: noctuaColors.background,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: noctuaColors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: noctuaColors.background,
  },
  errorText: {
    color: noctuaColors.textMuted,
    fontSize: 16,
    textAlign: 'center',
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: noctuaColors.text,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  filtersContainer: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  filterChip: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: noctuaColors.primary,
    borderColor: noctuaColors.primary,
  },
  filterChipText: {
    color: noctuaColors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: noctuaColors.text,
  },
  locationButton: {
    position: 'absolute',
    right: 16,
    bottom: 220,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: noctuaColors.surface,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: noctuaColors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSheetTitle: {
    color: noctuaColors.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  plansScroll: {
    flexGrow: 0,
  },
  planCard: {
    width: 160,
    backgroundColor: noctuaColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    padding: 12,
    marginRight: 12,
  },
  planCardTitle: {
    color: noctuaColors.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  planCardLocation: {
    color: noctuaColors.textMuted,
    fontSize: 12,
    marginBottom: 4,
  },
  planCardDistance: {
    color: noctuaColors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  selectedPlanCard: {
    width: 280,
    backgroundColor: noctuaColors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: noctuaColors.primary,
    padding: 16,
    marginRight: 12,
  },
  selectedPlanTitle: {
    color: noctuaColors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  selectedPlanLocation: {
    color: noctuaColors.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  selectedPlanMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectedPlanAttendees: {
    color: noctuaColors.text,
    fontSize: 14,
  },
  selectedPlanMatch: {
    color: noctuaColors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  viewButton: {
    backgroundColor: noctuaColors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  webMapTitle: {
    color: noctuaColors.text,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 12,
  },
  webMapSubtitle: {
    color: noctuaColors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  webMapPlansCount: {
    color: noctuaColors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
