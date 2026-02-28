import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    TouchableOpacity,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { noctuaColors } from '@/lib/theme/tokens';
import type { AuthUserProfile } from '@/lib/auth/auth-context';

interface Props {
    user: AuthUserProfile;
    isUploading: boolean;
    onAvatarUpload: () => void;
    onSignOut: () => void;
}

export function ProfileHeader({
    user,
    isUploading,
    onAvatarUpload,
    onSignOut,
}: Props) {
    return (
        <>
            <Pressable onPress={onSignOut} style={styles.logoutButton}>
                <Text style={styles.logoutText}>Cerrar sesión</Text>
            </Pressable>

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => {}}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <AntDesign
                        name="setting"
                        size={24}
                        color={noctuaColors.text}
                    />
                </TouchableOpacity>

                <Pressable
                    style={[
                        styles.avatarContainer,
                        isUploading && { opacity: 0.5 },
                    ]}
                    onPress={onAvatarUpload}
                    disabled={isUploading}
                >
                    <Image
                        source={{ uri: user.avatarUrl }}
                        style={styles.avatar}
                    />
                    <View style={styles.onlineStatus} />
                </Pressable>

                <Text style={styles.userName}>{user.name}</Text>

                <View style={styles.hostLevelContainer}>
                    <AntDesign
                        name="star"
                        size={16}
                        color={noctuaColors.primary}
                    />
                    <Text style={styles.hostLevel}>{user.hostLevel}</Text>
                </View>

                <View style={styles.ratingRow}>
                    <AntDesign
                        name="star"
                        size={16}
                        color={noctuaColors.primary}
                    />
                    <Text style={styles.ratingText}>{user.rating}</Text>
                    <Text style={styles.ratingSeparator}>•</Text>
                    <Text style={styles.planCount}>
                        {user.totalPlans} plans
                    </Text>
                </View>

                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    logoutButton: {
        alignSelf: 'flex-end',
        marginBottom: 12,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: noctuaColors.border,
    },
    logoutText: {
        color: noctuaColors.text,
    },
    header: {
        alignItems: 'center',
        paddingTop: 16,
        paddingHorizontal: 20,
        position: 'relative',
    },
    settingsButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 1,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: noctuaColors.primary,
    },
    onlineStatus: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: noctuaColors.success,
        borderWidth: 3,
        borderColor: noctuaColors.background,
    },
    userName: {
        fontSize: 28,
        fontWeight: '800',
        color: noctuaColors.text,
        marginBottom: 8,
    },
    hostLevelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 8,
    },
    hostLevel: {
        fontSize: 14,
        fontWeight: '600',
        color: noctuaColors.primary,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 16,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '700',
        color: noctuaColors.text,
    },
    ratingSeparator: {
        color: noctuaColors.textMuted,
        marginHorizontal: 4,
    },
    planCount: {
        fontSize: 16,
        fontWeight: '600',
        color: noctuaColors.textMuted,
    },
    editButton: {
        borderWidth: 1,
        borderColor: noctuaColors.primary,
        borderRadius: 999,
        paddingVertical: 10,
        paddingHorizontal: 32,
    },
    editButtonText: {
        color: noctuaColors.primary,
        fontSize: 14,
        fontWeight: '600',
    },
});
