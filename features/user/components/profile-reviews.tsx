import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { noctuaColors } from '@/lib/theme/tokens';
import type { Review } from '@/features/user/types';

interface Props {
    reviews: Review[];
}

export function ProfileReviews({ reviews }: Props) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>What people say</Text>
            <FlatList
                data={reviews}
                renderItem={({ item }) => (
                    <View style={styles.reviewCard}>
                        <View style={styles.reviewHeader}>
                            <Image
                                source={{ uri: item.reviewerAvatarUrl }}
                                style={styles.reviewerAvatar}
                            />
                            <View style={styles.reviewerInfo}>
                                <Text style={styles.reviewerName}>
                                    {item.reviewerName}
                                </Text>
                                <View style={styles.ratingRow}>
                                    {[...Array(5)].map((_, i) => (
                                        <AntDesign
                                            key={i}
                                            name="star"
                                            size={12}
                                            color={
                                                i < item.rating
                                                    ? noctuaColors.primary
                                                    : noctuaColors.textMuted
                                            }
                                        />
                                    ))}
                                </View>
                            </View>
                            <Text style={styles.reviewDate}>
                                {item.createdAt}
                            </Text>
                        </View>
                        <Text style={styles.reviewText}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginTop: 24,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: noctuaColors.text,
        marginBottom: 12,
    },
    reviewCard: {
        backgroundColor: noctuaColors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: noctuaColors.border,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    reviewerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    reviewerInfo: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '600',
        color: noctuaColors.text,
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    reviewDate: {
        fontSize: 12,
        color: noctuaColors.textMuted,
    },
    reviewText: {
        fontSize: 14,
        color: noctuaColors.textMuted,
        lineHeight: 20,
    },
});
