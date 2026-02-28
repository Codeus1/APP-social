import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { noctuaColors } from '@/lib/theme/tokens';

interface Props {
    bio: string;
    interests: string[];
}

export function ProfileBio({ bio, interests }: Props) {
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{bio}</Text>
            <View style={styles.interestsRow}>
                {interests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                        <Text style={styles.interestText}>{interest}</Text>
                    </View>
                ))}
            </View>
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
    bioText: {
        fontSize: 14,
        color: noctuaColors.textMuted,
        lineHeight: 22,
        marginBottom: 16,
    },
    interestsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    interestTag: {
        backgroundColor: noctuaColors.surface,
        borderRadius: 999,
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderWidth: 1,
        borderColor: noctuaColors.border,
    },
    interestText: {
        fontSize: 13,
        color: noctuaColors.text,
        fontWeight: '500',
    },
});
