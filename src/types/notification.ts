export interface Notification {
  id: number;
  title: string;
  message: string;
  link: string;
  createdAt: string;
  isRead: boolean;
  readAt: string | null;
}
