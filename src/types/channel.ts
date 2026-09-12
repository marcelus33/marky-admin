export type ChannelKey = "instagram" | "facebook" | "tiktok" | "whatsapp" | "link";

export interface ChannelEntry {
  id?: number;
  label: string;
  url: string;
}

export type ChannelsByKey = Partial<Record<ChannelKey, ChannelEntry[]>>;
