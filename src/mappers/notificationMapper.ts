import { Notification } from "../types/notification";

export const mapNotification = (raw: any): Notification => ({
  id: raw.id,
  title: raw.title,
  message: raw.message,
  link: raw.link ?? "",
  createdAt: raw.created_at ?? raw.createdAt,
  isRead: raw.is_read ?? raw.isRead ?? false,
  readAt: raw.read_at ?? raw.readAt ?? null,
});
