export const ACTIVITY_TYPES = [
    { id: 'drinks', label: 'Drinks', icon: 'DR' },
    { id: 'dance', label: 'Dance', icon: 'DA' },
    { id: 'dinner', label: 'Dinner', icon: 'DI' },
    { id: 'event', label: 'Event', icon: 'EV' },
] as const;

export const ENERGY_LEVELS = [
    { id: 'low', label: 'Chill', emoji: 'LOW' },
    { id: 'medium', label: 'Social', emoji: 'MID' },
    { id: 'high', label: 'High Energy', emoji: 'HIGH' },
] as const;

export const PRICE_RANGES = [
    { id: 'cheap', label: '€ Cheap' },
    { id: 'moderate', label: '€€ Moderate' },
    { id: 'expensive', label: '€€€ Expensive' },
] as const;

export const TAG_OPTIONS = [
    'Techno',
    'Jazz',
    'Rooftop',
    'Cocktails',
    'Dancing',
    'Food',
    'Wine',
    'Speakeasy',
] as const;

export const AGE_RANGES = ['18-25', '25-30', '30-35', '35+'] as const;

export type EnergyLevel = (typeof ENERGY_LEVELS)[number]['id'];
export type PriceRange = (typeof PRICE_RANGES)[number]['id'];
export type ActivityType = (typeof ACTIVITY_TYPES)[number]['id'];
