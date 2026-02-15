import { Plan } from '@/features/plans/types';

export const mockPlans: Plan[] = [
  {
    id: 'plan-1',
    title: 'Rooftop Jazz and Wine',
    host: 'Sophie',
    location: 'Le Marais',
    startsAt: 'Tonight 21:00',
    attendees: 14,
    maxAttendees: 20,
    tags: ['Chill Vibe', 'Rooftop', 'Jazz'],
    energy: 'low',
    priceLevel: '$$',
    description: 'Small rooftop session with live jazz, wine tasting, and city lights.',
  },
  {
    id: 'plan-2',
    title: 'Underground Techno Session',
    host: 'Max',
    location: 'Kreuzberg',
    startsAt: 'Tonight 23:30',
    attendees: 26,
    maxAttendees: 30,
    tags: ['High Energy', 'Techno', 'Late Night'],
    energy: 'high',
    priceLevel: '$$$',
    description: 'Warehouse-style techno plan for people who want to dance until sunrise.',
  },
  {
    id: 'plan-3',
    title: 'Late Night Food Run',
    host: 'Elena',
    location: 'Bastille',
    startsAt: 'Tonight 01:00',
    attendees: 8,
    maxAttendees: 12,
    tags: ['Social', 'Food', 'Casual'],
    energy: 'medium',
    priceLevel: '$',
    description: 'Street food walk with spontaneous stops and good conversation.',
  },
];

