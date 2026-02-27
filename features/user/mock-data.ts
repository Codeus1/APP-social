import { UserProfile, RecentPlan } from './types';

export const mockUserProfile: UserProfile = {
  id: 'user-1',
  name: 'Sofía Martínez',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  hostLevel: 'Ambassador',
  rating: 4.9,
  totalPlans: 128,
  bio: 'Diseñando noches memorables, mezclando música, gente nueva y lugares con vibra auténtica. Always looking for the next adventure and amazing people to share it with.',
  interests: ['Techno', 'Rooftop bars', 'Wine', 'Dancing', 'Cocktails'],
  badges: [
    {
      id: 'badge-1',
      name: 'Early Adopter',
      icon: 'EA',
      description: 'One of the first Noctua users',
    },
    {
      id: 'badge-2',
      name: 'Super Host',
      icon: 'SH',
      description: 'Hosted 25+ successful plans',
    },
    {
      id: 'badge-3',
      name: 'Night Owl',
      icon: 'NO',
      description: 'Active after midnight regularly',
    },
    {
      id: 'badge-4',
      name: 'Social Butterfly',
      icon: 'SB',
      description: 'Connected with 100+ people',
    },
    {
      id: 'badge-5',
      name: 'Trendsetter',
      icon: 'TS',
      description: 'Plans consistently get high engagement',
    },
  ],
  stats: {
    plansHosted: 42,
    plansJoined: 86,
    connections: 234,
  },
  reviews: [
    {
      id: 'review-1',
      reviewerName: 'Carlos Ruiz',
      reviewerAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      rating: 5,
      text: 'Amazing host! The rooftop party was incredible. Met so many cool people.',
      createdAt: '2024-01-15',
    },
    {
      id: 'review-2',
      reviewerName: 'Elena Torres',
      reviewerAvatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      rating: 5,
      text: 'Sofía knows all the best spots in Madrid. Every plan is a 10/10!',
      createdAt: '2024-01-10',
    },
    {
      id: 'review-3',
      reviewerName: 'Miguel Santos',
      reviewerAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
      rating: 4,
      text: 'Great energy and always brings fun people together. Highly recommend!',
      createdAt: '2024-01-05',
    },
    {
      id: 'review-4',
      reviewerName: 'Ana García',
      reviewerAvatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
      rating: 5,
      text: 'The wine tasting event was perfect. Sofía has impeccable taste!',
      createdAt: '2023-12-28',
    },
  ],
};

export const mockRecentPlans: RecentPlan[] = [
  {
    id: 'plan-1',
    title: 'Rooftop Sunset',
    imageUrl: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300&h=200&fit=crop',
    date: 'Feb 14',
  },
  {
    id: 'plan-2',
    title: 'Techno Night',
    imageUrl: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=300&h=200&fit=crop',
    date: 'Feb 10',
  },
  {
    id: 'plan-3',
    title: 'Wine Tasting',
    imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=200&fit=crop',
    date: 'Feb 5',
  },
  {
    id: 'plan-4',
    title: 'Dancing Night',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=200&fit=crop',
    date: 'Jan 28',
  },
];
