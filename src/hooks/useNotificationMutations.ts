import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "./useApiMutation";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService";
import { Notification } from "../types/notification";

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useApiMutation<Notification, Error, number>({
    mutationFn: markNotificationRead,
    showSuccessNotification: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useApiMutation<{ updated: number }, Error, void>({
    mutationFn: markAllNotificationsRead,
    showSuccessNotification: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
