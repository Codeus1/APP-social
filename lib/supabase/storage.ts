import { supabaseClient } from './client';

/**
 * Uploads an image to Supabase Storage and returns the public URL.
 * Requires a "plan-images" bucket configured to be public.
 */
export async function uploadPlanImage(uri: string): Promise<string | null> {
    try {
        // If it's already an http link (e.g. edit mode with existing image), we do not need to re-upload.
        if (uri.startsWith('http')) return uri;

        console.log('[Storage] Fetching local image blob...');
        // React Native's fetch perfectly handles local file URIs to blob
        const response = await fetch(uri);
        const blob = await response.blob();

        const fileExt = uri.split('.').pop() || 'jpeg';
        // Generate pseudo-unique name to avoid requiring expo-crypto dependency
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`; // Base path inside bucket

        console.log('[Storage] Uploading to Supabase bucket...');
        const { error } = await supabaseClient.storage
            .from('plan-images')
            .upload(filePath, blob, {
                contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
                upsert: false,
            });

        if (error) {
            console.error(
                '[Storage] Error uploading image to Supabase:',
                error,
            );
            throw error;
        }

        console.log('[Storage] Upload successful, getting public URL...');
        // Get public URL
        const { data: publicUrlData } = supabaseClient.storage
            .from('plan-images')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error('[Storage] Upload failed:', error);
        return null;
    }
}

/**
 * Uploads a profile avatar to Supabase Storage and returns the public URL.
 * Requires an "avatars" bucket configured to be public.
 */
export async function uploadProfileAvatar(uri: string): Promise<string | null> {
    try {
        if (uri.startsWith('http')) return uri;

        console.log('[Storage] Fetching local avatar blob...');
        const response = await fetch(uri);
        const blob = await response.blob();

        const fileExt = uri.split('.').pop() || 'jpeg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        console.log('[Storage] Uploading avatar to Supabase bucket...');
        const { error } = await supabaseClient.storage
            .from('avatars')
            .upload(filePath, blob, {
                contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
                upsert: false,
            });

        if (error) {
            console.error('[Storage] Error uploading avatar:', error);
            throw error;
        }

        const { data: publicUrlData } = supabaseClient.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return publicUrlData.publicUrl;
    } catch (error) {
        console.error('[Storage] Avatar upload failed:', error);
        return null;
    }
}
