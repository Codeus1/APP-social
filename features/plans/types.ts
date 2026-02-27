export type PlanEnergy = 'low' | 'medium' | 'high';

export type PlanPrice = 'cheap' | 'moderate' | 'expensive';

export type PlanHost = {
  name: string;
  avatarUrl: string;
  verified: boolean;
};

export type GenderRatio = {
  male: number;
  female: number;
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
  tags: string[];
  attendees: number;
  maxAttendees: number;
  matchPercentage: number;
  genderRatio: GenderRatio;
  price: PlanPrice;
  ageRange: string;
  imageUrl: string;
  isHappeningNow: boolean;
  distance: string;
};
