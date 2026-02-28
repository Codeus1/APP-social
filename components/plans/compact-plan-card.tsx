import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Plan } from '@/features/plans/types';
import { noctuaColors, noctuaRadii } from '@/lib/theme/tokens';
import { formatEnergy, formatPrice, priceChipColor } from './plan-helpers';

type Props = {
    plan: Plan;
    onPress: () => void;
};

export function CompactPlanCard({ plan, onPress }: Props) {
    const priceColor = priceChipColor(plan.price);
    const isCheap = plan.price === 'cheap';

    return (
        <Pressable onPress={onPress} style={styles.container}>
            {/* Thumbnail */}
            <View style={styles.thumbnailWrapper}>
                <Image
                    source={{
                        uri:
                            plan.imageUrl ||
                            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
                    }}
                    style={styles.thumbnail}
                />
                <View style={styles.timeOverlay}>
                    <Text style={styles.timeOverlayText}>{plan.startsAt}</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={2}>
                        {plan.title}
                    </Text>
                    <Image
                        source={{
                            uri:
                                plan.host.avatarUrl ||
                                'https://i.pravatar.cc/150',
                        }}
                        style={styles.hostAvatar}
                    />
                </View>
                <Text style={styles.subtitle} numberOfLines={1}>
                    {plan.location}
                </Text>
                <View style={styles.tagsRow}>
                    <View
                        style={[
                            styles.priceChip,
                            isCheap && styles.priceChipCheap,
                        ]}
                    >
                        <Text
                            style={[
                                styles.priceChipText,
                                { color: priceColor },
                            ]}
                        >
                            {formatPrice(plan.price)}
                        </Text>
                    </View>
                    <Text style={styles.energyText}>
                        {formatEnergy(plan.energy)}
                    </Text>
                </View>
            </View>

            {/* Quick add button */}
            <Pressable style={styles.addButton}>
                <Text style={styles.addButtonText}>+</Text>
            </Pressable>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: noctuaColors.surface,
        borderRadius: noctuaRadii.card,
        borderWidth: 1,
        borderColor: noctuaColors.border,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 12,
    },
    thumbnailWrapper: {
        width: 90,
        height: 90,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    timeOverlay: {
        position: 'absolute',
        top: 6,
        left: 6,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    timeOverlayText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        gap: 4,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    title: {
        color: noctuaColors.text,
        fontSize: 15,
        fontWeight: '800',
        flex: 1,
    },
    hostAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    subtitle: {
        color: noctuaColors.textMuted,
        fontSize: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 2,
    },
    priceChip: {
        borderRadius: noctuaRadii.chip,
        borderWidth: 1,
        borderColor: noctuaColors.border,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    priceChipCheap: {
        borderColor: 'rgba(74, 222, 128, 0.3)',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
    },
    priceChipText: {
        fontSize: 11,
        fontWeight: '700',
    },
    energyText: {
        color: noctuaColors.textMuted,
        fontSize: 12,
        fontWeight: '600',
    },
    addButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: noctuaColors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: noctuaColors.textMuted,
        fontSize: 18,
        fontWeight: '600',
    },
});
