import React, { forwardRef } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import type { InteractiveMapProps } from './interactive-map.types';
import { noctuaColors } from '@/lib/theme/tokens';

function getEnergyLabel(energy: 'low' | 'medium' | 'high') {
  if (energy === 'high') return 'HI';
  if (energy === 'medium') return 'MID';
  return 'LOW';
}

export const InteractiveMap = forwardRef<MapView, InteractiveMapProps>(function InteractiveMap(
  { style, initialRegion, plans, showsUserLocation, userLocation, onMapReady, onPlanPress },
  ref
) {
  return (
    <MapView
      ref={ref}
      style={style}
      provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      initialRegion={initialRegion}
      showsUserLocation={showsUserLocation}
      showsMyLocationButton={false}
      customMapStyle={darkMapStyle}
      onMapReady={onMapReady}
    >
      {plans.map((plan) => (
        <Marker
          key={plan.id}
          coordinate={{
            latitude: plan.coordinates.lat,
            longitude: plan.coordinates.lng,
          }}
          title={plan.title}
          description={plan.location}
          onPress={() => onPlanPress(plan)}
        >
          <View style={styles.markerContainer}>
            <Text style={styles.markerLabel}>{getEnergyLabel(plan.energy)}</Text>
          </View>
        </Marker>
      ))}
      {userLocation ? (
        <Marker
          coordinate={{
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          }}
          identifier="user"
        >
          <View style={styles.userMarker} />
        </Marker>
      ) : null}
    </MapView>
  );
});

const styles = StyleSheet.create({
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: noctuaColors.surface,
    borderWidth: 2,
    borderColor: noctuaColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: noctuaColors.text,
  },
  userMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4A90E2',
    borderWidth: 3,
    borderColor: '#FFF',
  },
});

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#1d1d2e' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8A8AAE' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#1d1d2e' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8A8AAE' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2d2d44' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1d1d2e' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0A0A1A' }],
  },
];
