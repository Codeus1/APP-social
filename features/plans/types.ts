export type PlanEnergy = 'low' | 'medium' | 'high';

export type PlanPrice = 'cheap' | 'moderate' | 'expensive';

export type PlanHost = {
    id: string;
    name: string;
    avatarUrl: string | null;
    verified: boolean;
    hostLevel: string;
    rating: number;
};

export type PlanCoordinates = {
    lat: number;
    lng: number;
};

export type Plan = {
    id: string;
    title: string;
    description: string;
    location: string;
    coordinates: PlanCoordinates;
    host: PlanHost;
    startsAt: string;
    energy: PlanEnergy;
    activityType: string;
    tags: string[];
    attendees: number;
    maxAttendees: number;
    price: PlanPrice;
    ageRange: string;
    approvalRequired: boolean;
    imageUrl: string | null;
    isHappeningNow: boolean;
    userJoinStatus?: 'none' | 'pending' | 'joined';
};
