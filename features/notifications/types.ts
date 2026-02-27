export type NotificationType =
  | 'plan_invite'
  | 'join_request'
  | 'message'
  | 'plan_update'
  | 'new_follower'
  | 'review';

export type NotificationAction = {
  label: string;
  action: 'accept' | 'decline' | 'view' | 'follow_back';
};

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  imageUrl?: string;
  senderName?: string;
  senderAvatarUrl?: string;
  planId?: string;
  isRead: boolean;
  createdAt: string; // ISO timestamp
  actions?: NotificationAction[];
};
