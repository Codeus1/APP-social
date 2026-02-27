export type UserBadge = {
  id: string;
  name: string;
  icon: string; // emoji or icon name
  description: string;
};

export type UserStats = {
  plansHosted: number;
  plansJoined: number;
  connections: number;
};

export type Review = {
  id: string;
  reviewerName: string;
  reviewerAvatarUrl: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type UserProfile = {
  id: string;
  name: string;
  avatarUrl: string;
  hostLevel: 'Newcomer' | 'Regular' | 'Ambassador' | 'Legend';
  rating: number;
  totalPlans: number;
  bio: string;
  interests: string[];
  badges: UserBadge[];
  stats: UserStats;
  reviews: Review[];
};

export type RecentPlan = {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
};
