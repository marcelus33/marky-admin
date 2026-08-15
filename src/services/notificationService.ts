import api from "./axiosConfig";
import { PaginatedNotificationsResponse } from "./types";
import { Notification } from "../types/notification";
import { mapNotification } from "../mappers/notificationMapper";

const baseURL = `${process.env.REACT_APP_API_URL}/notifications`;

export const getNotifications = async (
  params?: any,
): Promise<PaginatedNotificationsResponse<Notification>> => {
  const response = await api.get(`${baseURL}/`, { params });
  const data = response.data as PaginatedNotificationsResponse<any>;
  return {
    ...data,
    results: Array.isArray(data.results)
      ? data.results.map(mapNotification)
      : [],
  };
};

export const markNotificationRead = async (
  id: number,
): Promise<Notification> => {
  const response = await api.post(`${baseURL}/${id}/read/`);
  return mapNotification(response.data);
};

export const markAllNotificationsRead = async (): Promise<{
  updated: number;
}> => {
  const response = await api.post(`${baseURL}/read-all/`);
  return response.data;
};
