import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

import { supabaseClient } from '@/lib/supabase/client';
import { uploadProfileAvatar } from '@/lib/supabase/storage';
import { ScreenContainer } from '@/components/ui/screen-container';
import { useAuth } from '@/lib/auth/auth-context';
import { trpc } from '@/lib/trpc/client';

import { ProfileHeader } from '@/features/user/components/profile-header';
import { ProfileStatsRow } from '@/features/user/components/profile-stats-row';
import { ProfileBio } from '@/features/user/components/profile-bio';
import { ProfileBadges } from '@/features/user/components/profile-badges';
import { ProfileRecentPlans } from '@/features/user/components/profile-recent-plans';
import { ProfileReviews } from '@/features/user/components/profile-reviews';

export default function ProfileScreen() {
    const { user: authUser, signOut } = useAuth();
    const { data: profileData, isLoading: isProfileLoading } =
        trpc.user.getProfile.useQuery(undefined, {
            enabled: !!authUser,
        });

    // Provide default fallback values while loading to prevent flashes
    const user = {
        id: authUser?.id || '',
        name: authUser?.name || 'Usuario',
        avatarUrl: authUser?.avatarUrl || 'https://i.pravatar.cc/150',
        hostLevel: authUser?.hostLevel || 'Newcomer',
        rating: authUser?.rating || 0,
        totalPlans: authUser?.totalPlans || 0,
        bio: authUser?.bio || 'Hola, ¡me encanta usar esta app!',
        interests: authUser?.interests || ['Coffee', 'Tech', 'Music'],
        stats: profileData?.stats || {
            plansHosted: 0,
            plansJoined: 0,
            connections: 0,
        },
        badges: profileData?.badges || [],
        reviews: profileData?.reviews || [],
        recentPlans: profileData?.recentPlans || [],
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleAvatarUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setIsUploading(true);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                const uploadedUrl = await uploadProfileAvatar(
                    result.assets[0].uri,
                );

                if (uploadedUrl) {
                    const { error } = await supabaseClient.auth.updateUser({
                        data: { avatar_url: uploadedUrl },
                    });

                    if (error) throw error;

                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success,
                    );
                    Toast.show({ type: 'success', text1: 'Foto actualizada' });
                } else {
                    throw new Error('Upload failed');
                }
            }
        } catch (e) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Toast.show({ type: 'error', text1: 'Error al subir la foto' });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <ScreenContainer>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <ProfileHeader
                    user={user as any}
                    isUploading={isUploading}
                    onAvatarUpload={handleAvatarUpload}
                    onSignOut={signOut}
                />
                <ProfileStatsRow
                    plansHosted={user.stats.plansHosted}
                    plansJoined={user.stats.plansJoined}
                    connections={user.stats.connections}
                />
                <ProfileBio bio={user.bio} interests={user.interests} />
                <ProfileBadges badges={user.badges} />
                <ProfileRecentPlans plans={user.recentPlans} />
                <ProfileReviews reviews={user.reviews} />
            </ScrollView>
        </ScreenContainer>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
});
