import { Text, View } from 'react-native';
import { noctuaColors } from '@/lib/theme/tokens';
import { ScreenContainer } from '@/components/ui/screen-container';

export default function ProfileScreen() {
    return (
        <ScreenContainer
            style={{
                flex: 1,
                padding: 16,
                gap: 16,
                backgroundColor: noctuaColors.background,
            }}
        >
            <View
                style={{
                    backgroundColor: noctuaColors.surface,
                    borderRadius: 24,
                    borderWidth: 1,
                    borderColor: noctuaColors.border,
                    padding: 18,
                    gap: 8,
                }}
            >
                <Text
                    selectable
                    style={{
                        color: noctuaColors.text,
                        fontSize: 28,
                        fontWeight: '800',
                    }}
                >
                    Sofía Martínez
                </Text>
                <Text selectable style={{ color: noctuaColors.textMuted }}>
                    Host level: Ambassador
                </Text>
                <Text
                    selectable
                    style={{ color: noctuaColors.primary, fontWeight: '700' }}
                >
                    4.9 rating • 128 plans
                </Text>
            </View>

            <View
                style={{
                    backgroundColor: '#2f1624',
                    borderRadius: 18,
                    borderColor: noctuaColors.border,
                    borderWidth: 1,
                    padding: 16,
                    gap: 8,
                }}
            >
                <Text
                    selectable
                    style={{ color: noctuaColors.text, fontWeight: '700' }}
                >
                    Bio
                </Text>
                <Text
                    selectable
                    style={{ color: noctuaColors.textMuted, lineHeight: 20 }}
                >
                    Diseñando noches memorables, mezclando música, gente nueva y
                    lugares con vibra auténtica.
                </Text>
            </View>
        </ScreenContainer>
    );
}
