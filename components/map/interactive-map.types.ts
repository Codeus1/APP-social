import type { LocationObject } from 'expo-location';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Plan } from '@/features/plans/types';

type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type InteractiveMapProps = {
  style?: StyleProp<ViewStyle>;
  initialRegion: MapRegion;
  plans: Plan[];
  showsUserLocation: boolean;
  userLocation: LocationObject | null;
  onMapReady: () => void;
  onPlanPress: (plan: Plan) => void;
};
