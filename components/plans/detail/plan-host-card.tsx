import { View, Image, Text, Pressable, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';

interface PlanHostCardProps {
    host: {
        id: string;
        name: string;
        avatarUrl: string | null;
        rating?: number;
    };
    onMessageHost: () => void;
}

export function PlanHostCard({ host, onMessageHost }: PlanHostCardProps) {
    return (
        <View style={styles.hostCard}>
            <View style={styles.hostLeft}>
                <View style={styles.hostAvatarWrapper}>
                    <Image
                        source={{
                            uri: host.avatarUrl || 'https://i.pravatar.cc/150',
                        }}
                        style={styles.hostAvatar}
                    />
                    <View style={styles.hostBadge}>
                        <Text style={styles.hostBadgeText}>HOST</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.hostName}>{host.name}</Text>
                    <Text style={styles.hostTrust}>
                        {host.rating
                            ? `Rating: ⭐ ${host.rating.toFixed(1)}/5.0`
                            : 'Newcomer Host'}
                    </Text>
                </View>
            </View>
            <Pressable
                style={styles.chatButton}
                onPress={onMessageHost}
                hitSlop={8}
            >
                <AntDesign name="message" size={18} color={noctuaColors.text} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    hostCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: noctuaColors.surface,
        borderRadius: 18,
        padding: 14,
        marginTop: 4,
    },
    hostLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    hostAvatarWrapper: {
        position: 'relative',
    },
    hostAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    hostBadge: {
        position: 'absolute',
        bottom: -4,
        left: 4,
        backgroundColor: noctuaColors.primary,
        borderRadius: noctuaRadii.chip,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    hostBadgeText: {
        color: '#fff',
        fontSize: 8,
        fontWeight: '800',
    },
    hostName: {
        color: noctuaColors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    hostAge: {
        color: noctuaColors.textMuted,
        fontWeight: '500',
    },
    hostTrust: {
        color: noctuaColors.success,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    chatButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: noctuaColors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
