export type PlanEnergy = 'low' | 'medium' | 'high';

export type Plan = {
  id: string;
  title: string;
  host: string;
  location: string;
  startsAt: string;
  attendees: number;
  maxAttendees: number;
  tags: string[];
  energy: PlanEnergy;
  priceLevel: '$' | '$$' | '$$$';
  description: string;
};

