import { Keyboard } from 'react-native';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadPlanImage } from '@/lib/supabase/storage';
import { useCreatePlan, useUpdatePlan } from '@/features/plans/hooks';
import { planSchema, PlanFormData } from '../schemas/plan-schema';

interface UseCreatePlanFormProps {
    editId?: string;
}

export function useCreatePlanForm({ editId }: UseCreatePlanFormProps) {
    const isEditMode = !!editId;
    const createPlanMutation = useCreatePlan();
    const updatePlanMutation = useUpdatePlan();

    const showToast = (
        message: string,
        type: 'success' | 'error' | 'info' = 'info',
    ) => {
        Toast.show({
            type,
            text1: type === 'error' ? 'Oops!' : 'Success',
            text2: message,
            position: 'bottom',
            bottomOffset: 120,
        });
    };

    const form = useForm<PlanFormData>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            title: '',
            description: '',
            location: '',
            date: 'Tonight',
            time: '22:00',
            activityType: 'drinks',
            energy: 'medium',
            price: 'moderate',
            maxAttendees: 6,
            tags: [],
            ageRange: '25-30',
            approvalRequired: true,
            imageUrl: null,
        },
    });

    const onSubmit = async (data: PlanFormData) => {
        Keyboard.dismiss();

        const now = new Date();
        const [hours, minutes] = data.time.split(':').map(Number);
        const startsAt = new Date(now);
        startsAt.setHours(hours, minutes, 0, 0);
        if (startsAt <= now) {
            startsAt.setDate(startsAt.getDate() + 1);
        }

        try {
            const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(data.location.trim())}`;
            const geocodeResponse = await fetch(geocodeUrl, {
                headers: { 'User-Agent': 'Noctua-App/1.0' },
            });
            const geocodeData = await geocodeResponse.json();

            if (!geocodeData || geocodeData.length === 0) {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Error,
                );
                showToast(
                    'La ubicación no existe. Introduce un lugar real.',
                    'error',
                );
                return;
            }

            const lat = parseFloat(geocodeData[0].lat);
            const lng = parseFloat(geocodeData[0].lon);

            let finalImageUrl = data.imageUrl;

            if (finalImageUrl && !finalImageUrl.startsWith('http')) {
                const uploadedUrl = await uploadPlanImage(finalImageUrl);
                if (!uploadedUrl) {
                    Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Error,
                    );
                    showToast('No se pudo subir la imagen.', 'error');
                    return;
                }
                finalImageUrl = uploadedUrl;
            }

            if (isEditMode) {
                await updatePlanMutation.mutateAsync({
                    id: editId!,
                    title: data.title.trim(),
                    location: data.location.trim(),
                    description: data.description.trim(),
                    energy: data.energy,
                    tags: data.tags,
                    maxAttendees: data.maxAttendees,
                    startsAt: startsAt.toISOString(),
                    imageUrl: finalImageUrl,
                    lat,
                    lng,
                });

                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                );
                showToast('Plan actualizado correctamente', 'success');
                router.replace(`/plan/${editId}`);
            } else {
                const result = await createPlanMutation.mutateAsync({
                    title: data.title.trim(),
                    location: data.location.trim(),
                    description: data.description.trim(),
                    energy: data.energy,
                    tags: data.tags,
                    maxAttendees: data.maxAttendees,
                    startsAt: startsAt.toISOString(),
                    imageUrl: finalImageUrl,
                    lat,
                    lng,
                });

                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                );
                showToast('Creado correctamente', 'success');

                if (result && result.id) {
                    router.replace(`/plan/${result.id}`);
                } else {
                    router.replace('/');
                }
            }
        } catch (error) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            showToast('Error de red. Intenta de nuevo.', 'error');
        }
    };

    const onError = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        showToast('Please fill in the required fields correctly.', 'error');
    };

    return {
        form,
        onSubmit: form.handleSubmit(onSubmit, onError),
        isSubmitting: form.formState.isSubmitting,
    };
}
