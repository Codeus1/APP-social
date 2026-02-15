import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { noctuaColors } from '@/lib/theme/tokens';

type Notification = {
  id: string;
  text: string;
  time: string;
};

const notifications: Notification[] = [
  { id: '1', text: 'Max aceptó tu solicitud para Underground Techno.', time: 'Hace 2 min' },
  { id: '2', text: 'Sophie publicó un nuevo plan en Le Marais.', time: 'Hace 18 min' },
  { id: '3', text: 'Tu plan Food Run está por comenzar.', time: 'Hace 1 h' },
];

export default function NotificationsScreen() {
  const renderItem = useCallback(
    ({ item }: { item: Notification }) => (
      <View style={styles.card}>
        <Text selectable style={styles.cardText}>
          {item.text}
        </Text>
        <Text selectable style={styles.cardTime}>
          {item.time}
        </Text>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: Notification) => item.id, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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
  card: {
    backgroundColor: noctuaColors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: noctuaColors.border,
    padding: 14,
    gap: 8,
  },
  cardText: {
    color: noctuaColors.text,
    lineHeight: 21,
  },
  cardTime: {
    color: noctuaColors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  separator: {
    height: 12,
  },
});
