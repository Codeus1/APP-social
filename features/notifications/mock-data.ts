import { Notification } from './types';

// Helper to create relative timestamps
const hoursAgo = (hours: number): string => {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

const minutesAgo = (minutes: number): string => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - minutes);
  return date.toISOString();
};

const daysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'plan_invite',
    title: 'Plan Invite',
    description: 'Sofía invited you to Underground Techno Night',
    senderName: 'Sofía García',
    senderAvatarUrl: 'https://i.pravatar.cc/150?img=1',
    planId: 'plan-1',
    isRead: false,
    createdAt: minutesAgo(5),
    actions: [
      { label: 'Accept', action: 'accept' },
      { label: 'Decline', action: 'decline' },
    ],
  },
  {
    id: '2',
    type: 'join_request',
    title: 'Join Request',
    description: 'Marco wants to join your plan "Rooftop Sunset"',
    senderName: 'Marco Rossi',
    senderAvatarUrl: 'https://i.pravatar.cc/150?img=3',
    planId: 'plan-2',
    isRead: false,
    createdAt: minutesAgo(23),
    actions: [
      { label: 'Accept', action: 'accept' },
      { label: 'Decline', action: 'decline' },
    ],
  },
  {
    id: '3',
    type: 'message',
    title: 'New Message',
    description: 'Hey! Are you coming tonight? The party starts at 11pm',
    senderName: 'Lucas Martin',
    senderAvatarUrl: 'https://i.pravatar.cc/150?img=5',
    isRead: false,
    createdAt: hoursAgo(1),
  },
  {
    id: '4',
    type: 'plan_update',
    title: 'Plan Update',
    description: 'Jazz Night is starting in 1h',
    imageUrl: 'https://picsum.photos/seed/jazz/200/200',
    planId: 'plan-3',
    isRead: true,
    createdAt: hoursAgo(2),
    actions: [{ label: 'View', action: 'view' }],
  },
  {
    id: '5',
    type: 'new_follower',
    title: 'New Follower',
    description: 'Emma Wilson started following you',
    senderName: 'Emma Wilson',
    senderAvatarUrl: 'https://i.pravatar.cc/150?img=9',
    isRead: true,
    createdAt: hoursAgo(3),
    actions: [{ label: 'Follow back', action: 'follow_back' }],
  },
  {
    id: '6',
    type: 'review',
    title: 'New Review',
    description: 'Alex left you a review: 5/5 "Amazing host!"',
    senderName: 'Alex Chen',
    senderAvatarUrl: 'https://i.pravatar.cc/150?img=7',
    isRead: true,
    createdAt: hoursAgo(5),
  },
  {
    id: '7',
    type: 'plan_invite',
    title: 'Plan Invite',
    description: 'David invited you to Secret Warehouse Party',
    senderName: 'David Kim',
    senderAvatarUrl: 'https://i.pravatar.cc/150?img=11',
    planId: 'plan-4',
    isRead: true,
    createdAt: daysAgo(1),
    actions: [
      { label: 'Accept', action: 'accept' },
      { label: 'Decline', action: 'decline' },
    ],
  },
  {
    id: '8',
    type: 'join_request',
    title: 'Join Request',
    description: 'Olivia wants to join your plan "Beach Party"',
    senderName: 'Olivia Brown',
    senderAvatarUrl: 'https://i.pravatar.cc/150?img=13',
    planId: 'plan-5',
    isRead: true,
    createdAt: daysAgo(1),
    actions: [
      { label: 'Accept', action: 'accept' },
      { label: 'Decline', action: 'decline' },
    ],
  },
  {
    id: '9',
    type: 'message',
    title: 'New Message',
    description: 'Thanks for the invite! I\'ll be there with friends',
    senderName: 'Sofía García',
    senderAvatarUrl: 'https://i.pravatar.cc/150?img=1',
    isRead: true,
    createdAt: daysAgo(2),
  },
  {
    id: '10',
    type: 'plan_update',
    title: 'Plan Update',
    description: 'Rooftop Sunset has been updated with new location',
    imageUrl: 'https://picsum.photos/seed/rooftop/200/200',
    planId: 'plan-2',
    isRead: true,
    createdAt: daysAgo(2),
    actions: [{ label: 'View', action: 'view' }],
  },
];
