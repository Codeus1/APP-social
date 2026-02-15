import type { ReactNode } from 'react';
import { ScrollView, type StyleProp, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { noctuaColors } from '../../lib/theme/tokens';

type ScreenContainerProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function ScreenContainer({ children, style, contentStyle }: ScreenContainerProps) {
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: noctuaColors.background }, style]} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={[{ flexGrow: 1, padding: 16, gap: 16, paddingBottom: 24 }, contentStyle]} keyboardShouldPersistTaps="handled">
        <View style={{ gap: 16 }}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
