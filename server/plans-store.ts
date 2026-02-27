import type { Plan } from '../features/plans/types';

const INITIAL_PLANS: Plan[] = [
    {
        id: '1',
        title: 'Rooftop Jazz & Wine',
        description:
            'An elegant evening of live jazz on a stunning rooftop terrace. Sip curated wines while enjoying panoramic city views and smooth saxophone melodies under the stars.',
        location: 'Le Marais, Paris',
        coordinates: { lat: 48.8566, lng: 2.3622 },
        host: {
            name: 'Lucía Fernández',
            avatarUrl: 'https://i.pravatar.cc/150?u=lucia',
            verified: true,
        },
        startsAt: '2026-02-15T21:00:00.000Z',
        energy: 'low',
        tags: ['jazz', 'wine', 'rooftop', 'live music'],
        attendees: 18,
        maxAttendees: 30,
        matchPercentage: 92,
        genderRatio: { male: 45, female: 55 },
        price: 'moderate',
        ageRange: '25-35',
        imageUrl:
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        isHappeningNow: false,
        distance: '1.2 km',
    },
    {
        id: '2',
        title: 'Underground Techno',
        description:
            'Dive into the underground scene with Berlin-style techno in a converted warehouse. Expect heavy bass, immersive visuals, and a crowd that lives for the beat.',
        location: 'Bastille, Paris',
        coordinates: { lat: 48.853, lng: 2.369 },
        host: {
            name: 'DJ Krömer',
            avatarUrl: 'https://i.pravatar.cc/150?u=kromer',
            verified: true,
        },
        startsAt: '2026-02-15T23:30:00.000Z',
        energy: 'high',
        tags: ['techno', 'underground', 'dancing', 'warehouse'],
        attendees: 87,
        maxAttendees: 150,
        matchPercentage: 78,
        genderRatio: { male: 55, female: 45 },
        price: 'moderate',
        ageRange: '21-32',
        imageUrl:
            'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800',
        isHappeningNow: true,
        distance: '3.5 km',
    },
    {
        id: '3',
        title: 'Late Night Food Run',
        description:
            'Join fellow foodies for a midnight taco crawl through the best hidden street food spots in the city. We walk, we eat, we vibe.',
        location: 'Bastille Area, Paris',
        coordinates: { lat: 48.8545, lng: 2.371 },
        host: {
            name: 'Carlos Ruiz',
            avatarUrl: 'https://i.pravatar.cc/150?u=carlos',
            verified: false,
        },
        startsAt: '2026-02-16T00:00:00.000Z',
        energy: 'medium',
        tags: ['food', 'walking', 'street food', 'late night'],
        attendees: 12,
        maxAttendees: 20,
        matchPercentage: 85,
        genderRatio: { male: 50, female: 50 },
        price: 'cheap',
        ageRange: '20-30',
        imageUrl:
            'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
        isHappeningNow: false,
        distance: '0.8 km',
    },
    {
        id: '4',
        title: 'Salsa Night at El Rincón',
        description:
            'Whether you are a seasoned dancer or a total beginner, come feel the rhythm! Live salsa band, free beginner lesson at 10 PM, and drinks specials all night.',
        location: 'Latin Quarter, Paris',
        coordinates: { lat: 48.849, lng: 2.343 },
        host: {
            name: 'María Santos',
            avatarUrl: 'https://i.pravatar.cc/150?u=maria',
            verified: true,
        },
        startsAt: '2026-02-15T22:00:00.000Z',
        energy: 'high',
        tags: ['salsa', 'dancing', 'latin', 'live band'],
        attendees: 42,
        maxAttendees: 60,
        matchPercentage: 88,
        genderRatio: { male: 40, female: 60 },
        price: 'cheap',
        ageRange: '22-38',
        imageUrl:
            'https://images.unsplash.com/photo-1545128485-c400e7702796?w=800',
        isHappeningNow: true,
        distance: '2.1 km',
    },
    {
        id: '5',
        title: 'Cocktail Masterclass',
        description:
            'Learn to craft artisan cocktails from a world-class mixologist. Includes 3 cocktails, appetizers, and all the secrets behind the bar. Perfect for date night or a fun outing with friends.',
        location: 'Oberkampf, Paris',
        coordinates: { lat: 48.866, lng: 2.38 },
        host: {
            name: 'Tomás Vega',
            avatarUrl: 'https://i.pravatar.cc/150?u=tomas',
            verified: true,
        },
        startsAt: '2026-02-16T20:00:00.000Z',
        energy: 'low',
        tags: ['cocktails', 'masterclass', 'mixology', 'chill'],
        attendees: 8,
        maxAttendees: 12,
        matchPercentage: 95,
        genderRatio: { male: 50, female: 50 },
        price: 'expensive',
        ageRange: '25-40',
        imageUrl:
            'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800',
        isHappeningNow: false,
        distance: '1.8 km',
    },
];

const plans: Plan[] = [...INITIAL_PLANS];
let nextId = plans.length + 1;

export function getAllPlans(): Plan[] {
    return plans;
}

export function getPlanById(id: string): Plan | null {
    return plans.find((plan) => plan.id === id) ?? null;
}

export function createPlan(
    input: Omit<
        Plan,
        | 'id'
        | 'host'
        | 'attendees'
        | 'matchPercentage'
        | 'genderRatio'
        | 'price'
        | 'ageRange'
        | 'imageUrl'
        | 'isHappeningNow'
        | 'distance'
        | 'coordinates'
    >,
): Plan {
    const plan: Plan = {
        ...input,
        id: String(nextId++),
        coordinates: { lat: 48.8566, lng: 2.3522 }, // Default to Paris center
        host: {
            name: 'You',
            avatarUrl: 'https://i.pravatar.cc/150?u=me',
            verified: false,
        },
        attendees: 1,
        matchPercentage: 100,
        genderRatio: { male: 50, female: 50 },
        price: 'moderate',
        ageRange: '21-35',
        imageUrl:
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        isHappeningNow: false,
        distance: '0 km',
    };
    plans.push(plan);
    plans.push(plan);
    return plan;
}
