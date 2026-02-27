import { z } from 'zod';

export const planSchema = z.object({
    title: z.string().min(1, 'El título es obligatorio'),
    description: z.string(),
    location: z.string().min(1, 'La ubicación es obligatoria'),
    date: z.string(),
    time: z.string(),
    activityType: z.enum(['drinks', 'dance', 'dinner', 'event']),
    energy: z.enum(['low', 'medium', 'high']),
    price: z.enum(['cheap', 'moderate', 'expensive']),
    maxAttendees: z.number().min(2).max(50),
    tags: z.array(z.string()),
    ageRange: z.string(),
    approvalRequired: z.boolean(),
    imageUrl: z.string().nullable(),
});

export type PlanFormData = z.infer<typeof planSchema>;
