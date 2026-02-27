import type { Chat, Message } from '@/features/chats/types';

// Current time for relative timestamps
const now = new Date();
const minutesAgo = (mins: number) =>
  new Date(now.getTime() - mins * 60 * 1000).toISOString();
const hoursAgo = (hrs: number) =>
  new Date(now.getTime() - hrs * 60 * 60 * 1000).toISOString();

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    planId: 'plan-1',
    planTitle: 'Rooftop Jazz & Wine',
    planImageUrl: 'https://picsum.photos/seed/jazz-rooftop/800/600',
    hostName: 'Sophie',
    lastMessage: 'Nos vemos en 40 min!',
    lastMessageAt: minutesAgo(2),
    unreadCount: 2,
    isHappeningNow: true,
  },
  {
    id: 'chat-2',
    planId: 'plan-2',
    planTitle: 'Underground Techno',
    planImageUrl: 'https://picsum.photos/seed/techno-warehouse/800/600',
    hostName: 'Max',
    lastMessage: 'Dress code: all black',
    lastMessageAt: minutesAgo(45),
    unreadCount: 0,
    isHappeningNow: false,
  },
  {
    id: 'chat-3',
    planId: 'plan-3',
    planTitle: 'Late Night Food Run',
    planImageUrl: 'https://picsum.photos/seed/food-run/800/600',
    hostName: 'Elena',
    lastMessage: 'Voy llegando al punto de encuentro',
    lastMessageAt: hoursAgo(1),
    unreadCount: 1,
    isHappeningNow: false,
  },
  {
    id: 'chat-4',
    planId: 'plan-4',
    planTitle: 'Cocktail Masterclass',
    planImageUrl: 'https://picsum.photos/seed/cocktails/800/600',
    hostName: 'Alexandre',
    lastMessage: 'Don\'t forget to bring ID!',
    lastMessageAt: hoursAgo(3),
    unreadCount: 0,
    isHappeningNow: false,
  },
];

export const mockMessages: Message[] = [
  // Chat 1 - Rooftop Jazz
  {
    id: 'msg-1-1',
    chatId: 'chat-1',
    senderId: 'system',
    senderName: 'System',
    senderAvatarUrl: '',
    content: 'Sophie created the plan',
    createdAt: hoursAgo(5),
    isCurrentUser: false,
    isSystemMessage: true,
  },
  {
    id: 'msg-1-2',
    chatId: 'chat-1',
    senderId: 'user-sophie',
    senderName: 'Sophie',
    senderAvatarUrl: 'https://picsum.photos/seed/sophie/200/200',
    content: 'Hey everyone! Excited for tonight',
    createdAt: hoursAgo(4),
    isCurrentUser: false,
  },
  {
    id: 'msg-1-3',
    chatId: 'chat-1',
    senderId: 'user-current',
    senderName: 'You',
    senderAvatarUrl: '',
    content: 'Can\'t wait! What\'s the dress code?',
    createdAt: hoursAgo(3),
    isCurrentUser: true,
  },
  {
    id: 'msg-1-4',
    chatId: 'chat-1',
    senderId: 'user-sophie',
    senderName: 'Sophie',
    senderAvatarUrl: 'https://picsum.photos/seed/sophie/200/200',
    content: 'Smart casual! The rooftop has a great vibe',
    createdAt: hoursAgo(3),
    isCurrentUser: false,
  },
  {
    id: 'msg-1-5',
    chatId: 'chat-1',
    senderId: 'system',
    senderName: 'System',
    senderAvatarUrl: '',
    content: 'Max joined the plan',
    createdAt: hoursAgo(2),
    isCurrentUser: false,
    isSystemMessage: true,
  },
  {
    id: 'msg-1-6',
    chatId: 'chat-1',
    senderId: 'user-max',
    senderName: 'Max',
    senderAvatarUrl: 'https://picsum.photos/seed/max/200/200',
    content: 'Hey! First time at a jazz night, looking forward to it!',
    createdAt: hoursAgo(2),
    isCurrentUser: false,
  },
  {
    id: 'msg-1-7',
    chatId: 'chat-1',
    senderId: 'user-sophie',
    senderName: 'Sophie',
    senderAvatarUrl: 'https://picsum.photos/seed/sophie/200/200',
    content: 'Nos vemos en 40 min!',
    createdAt: minutesAgo(2),
    isCurrentUser: false,
  },

  // Chat 2 - Underground Techno
  {
    id: 'msg-2-1',
    chatId: 'chat-2',
    senderId: 'system',
    senderName: 'System',
    senderAvatarUrl: '',
    content: 'Max created the plan',
    createdAt: hoursAgo(8),
    isCurrentUser: false,
    isSystemMessage: true,
  },
  {
    id: 'msg-2-2',
    chatId: 'chat-2',
    senderId: 'user-max',
    senderName: 'Max',
    senderAvatarUrl: 'https://picsum.photos/seed/max/200/200',
    content: 'Who\'s ready for some dark beats?',
    createdAt: hoursAgo(7),
    isCurrentUser: false,
  },
  {
    id: 'msg-2-3',
    chatId: 'chat-2',
    senderId: 'user-current',
    senderName: 'You',
    senderAvatarUrl: '',
    content: 'Count me in! What time does it start?',
    createdAt: hoursAgo(6),
    isCurrentUser: true,
  },
  {
    id: 'msg-2-4',
    chatId: 'chat-2',
    senderId: 'user-max',
    senderName: 'Max',
    senderAvatarUrl: 'https://picsum.photos/seed/max/200/200',
    content: 'Doors open at 23:30. Be there early for the good spots!',
    createdAt: hoursAgo(6),
    isCurrentUser: false,
  },
  {
    id: 'msg-2-5',
    chatId: 'chat-2',
    senderId: 'user-max',
    senderName: 'Max',
    senderAvatarUrl: 'https://picsum.photos/seed/max/200/200',
    content: 'Dress code: all black',
    createdAt: minutesAgo(45),
    isCurrentUser: false,
  },

  // Chat 3 - Late Night Food Run
  {
    id: 'msg-3-1',
    chatId: 'chat-3',
    senderId: 'system',
    senderName: 'System',
    senderAvatarUrl: '',
    content: 'Elena created the plan',
    createdAt: hoursAgo(6),
    isCurrentUser: false,
    isSystemMessage: true,
  },
  {
    id: 'msg-3-2',
    chatId: 'chat-3',
    senderId: 'user-elena',
    senderName: 'Elena',
    senderAvatarUrl: 'https://picsum.photos/seed/elena/200/200',
    content: 'Food adventure tonight! Who\'s hungry?',
    createdAt: hoursAgo(5),
    isCurrentUser: false,
  },
  {
    id: 'msg-3-3',
    chatId: 'chat-3',
    senderId: 'user-current',
    senderName: 'You',
    senderAvatarUrl: '',
    content: 'Always hungry! What are we getting?',
    createdAt: hoursAgo(4),
    isCurrentUser: true,
  },
  {
    id: 'msg-3-4',
    chatId: 'chat-3',
    senderId: 'user-elena',
    senderName: 'Elena',
    senderAvatarUrl: 'https://picsum.photos/seed/elena/200/200',
    content: 'Starting at the best falafel place, then pizza, then maybe some crêpes!',
    createdAt: hoursAgo(4),
    isCurrentUser: false,
  },
  {
    id: 'msg-3-5',
    chatId: 'chat-3',
    senderId: 'user-current',
    senderName: 'You',
    senderAvatarUrl: '',
    content: 'Voy llegando al punto de encuentro',
    createdAt: hoursAgo(1),
    isCurrentUser: true,
  },

  // Chat 4 - Cocktail Masterclass
  {
    id: 'msg-4-1',
    chatId: 'chat-4',
    senderId: 'system',
    senderName: 'System',
    senderAvatarUrl: '',
    content: 'Alexandre created the plan',
    createdAt: hoursAgo(12),
    isCurrentUser: false,
    isSystemMessage: true,
  },
  {
    id: 'msg-4-2',
    chatId: 'chat-4',
    senderId: 'user-alex',
    senderName: 'Alexandre',
    senderAvatarUrl: 'https://picsum.photos/seed/alex/200/200',
    content: 'Welcome everyone! Get ready to learn some mixology',
    createdAt: hoursAgo(11),
    isCurrentUser: false,
  },
  {
    id: 'msg-4-3',
    chatId: 'chat-4',
    senderId: 'user-current',
    senderName: 'You',
    senderAvatarUrl: '',
    content: 'So excited! What cocktails will we learn?',
    createdAt: hoursAgo(10),
    isCurrentUser: true,
  },
  {
    id: 'msg-4-4',
    chatId: 'chat-4',
    senderId: 'user-alex',
    senderName: 'Alexandre',
    senderAvatarUrl: 'https://picsum.photos/seed/alex/200/200',
    content: 'Negroni, Old Fashioned, and a signature Noctua Spritz!',
    createdAt: hoursAgo(10),
    isCurrentUser: false,
  },
  {
    id: 'msg-4-5',
    chatId: 'chat-4',
    senderId: 'user-alex',
    senderName: 'Alexandre',
    senderAvatarUrl: 'https://picsum.photos/seed/alex/200/200',
    content: 'Don\'t forget to bring ID!',
    createdAt: hoursAgo(3),
    isCurrentUser: false,
  },
];

// Helper to get messages for a specific chat
export function getMessagesForChat(chatId: string): Message[] {
  return mockMessages.filter((msg) => msg.chatId === chatId);
}

// Helper to format relative time
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
