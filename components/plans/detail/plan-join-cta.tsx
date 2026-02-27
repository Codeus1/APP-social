import { View, Text, Pressable, StyleSheet } from 'react-native';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';

interface PlanJoinCtaProps {
    isFull: boolean;
    isPendingNetwork: boolean;
    userJoinStatus: 'none' | 'pending' | 'joined';
    onJoin: () => void;
}

export function PlanJoinCta({
    isFull,
    isPendingNetwork,
    userJoinStatus,
    onJoin,
}: PlanJoinCtaProps) {
    const disabled = isFull || isPendingNetwork || userJoinStatus !== 'none';

    return (
        <View style={styles.bottomBar}>
            <Pressable
                style={[styles.joinCta, disabled && { opacity: 0.6 }]}
                onPress={onJoin}
                disabled={disabled}
            >
                <Text style={styles.joinCtaText}>
                    {isPendingNetwork
                        ? '...'
                        : userJoinStatus === 'joined'
                          ? 'Joined'
                          : userJoinStatus === 'pending'
                            ? 'Request Sent'
                            : isFull
                              ? 'Plan Full'
                              : 'Request to Join →'}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 34,
        backgroundColor: noctuaColors.background,
    },
    joinCta: {
        backgroundColor: noctuaColors.primary,
        borderRadius: noctuaRadii.button,
        paddingVertical: 16,
        alignItems: 'center',
    },
    joinCtaText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '800',
    },
});
