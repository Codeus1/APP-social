import React, { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { InteractiveMapProps } from './interactive-map.types';
import { noctuaColors } from '@/lib/theme/tokens';

export const InteractiveMap = forwardRef<View, InteractiveMapProps>(function InteractiveMap(
  { style },
  ref
) {
  return (
    <View ref={ref} style={[styles.container, style]}>
      <Text style={styles.title}>Map not available on web build</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: noctuaColors.background,
  },
  title: {
    color: noctuaColors.textMuted,
    fontSize: 14,
  },
});
