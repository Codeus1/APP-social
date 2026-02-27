import { DarkTheme, Theme } from '@react-navigation/native';

import { noctuaColors } from '@/lib/theme/tokens';

export const navigationTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: noctuaColors.primary,
    background: noctuaColors.background,
    card: noctuaColors.surface,
    text: noctuaColors.text,
    border: noctuaColors.border,
    notification: noctuaColors.primary,
  },
};

