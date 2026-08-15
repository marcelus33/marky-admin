import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getNotifications } from "../services/notificationService";
import { PaginatedNotificationsResponse } from "../services/types";
import { Notification } from "../types/notification";

const useNotifications = (
  params?: any,
  options?: Omit<
    UseQueryOptions<PaginatedNotificationsResponse<Notification>>,
    "queryKey" | "queryFn"
  >,
) =>
  useQuery({
    queryKey: ["notifications", params],
    queryFn: () => getNotifications(params),
    staleTime: 30 * 1000,
    ...options,
  });

export default useNotifications;
