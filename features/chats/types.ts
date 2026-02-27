export type Chat = {
  id: string;
  planId: string;
  planTitle: string;
  planImageUrl: string;
  hostName: string;
  lastMessage: string;
  lastMessageAt: string; // ISO timestamp
  unreadCount: number;
  isHappeningNow: boolean;
};

export type Message = {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl: string;
  content: string;
  createdAt: string; // ISO timestamp
  isCurrentUser: boolean;
  isSystemMessage?: boolean;
};
