import { Text, View } from 'react-native';

import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

const notifications = [
  { id: '1', text: 'Max aceptó tu solicitud para Underground Techno.', time: 'Hace 2 min' },
  { id: '2', text: 'Sophie publicó un nuevo plan en Le Marais.', time: 'Hace 18 min' },
  { id: '3', text: 'Tu plan Food Run está por comenzar.', time: 'Hace 1 h' },
];

export default function NotificationsScreen() {
  return (
    <ScreenContainer>
      {notifications.map((item) => (
        <View
          key={item.id}
          style={{
            backgroundColor: noctuaColors.surface,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: noctuaColors.border,
            padding: 14,
            gap: 8,
          }}
        >
          <Text selectable style={{ color: noctuaColors.text, lineHeight: 21 }}>
            {item.text}
          </Text>
          <Text selectable style={{ color: noctuaColors.primary, fontSize: 12, fontWeight: '700' }}>
            {item.time}
          </Text>
        </View>
      ))}
    </ScreenContainer>
  );
}

