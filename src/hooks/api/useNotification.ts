import { useApiMutation, useApiQuery } from "./useApi";

export type TNotification = {
  notificationId: string;
  notificationName: string;
  messages: string;
  notifyTime: string;
  isRead: boolean;
  accountId: string;
};

type TNotificationResponse = {
  items: TNotification[];
};

export const useGetNotifications = (accountId: string) => {
  return useApiQuery<TNotificationResponse>(
    `/notification/get-all-notification-by-account-id/${accountId}`
  );
};

export const useGetNotificationMessage = (id: string) => {
  return useApiQuery<unknown>(
    `/notification/get-notification-message-by-id/${id}`
  );
};

export const useMarkNotificationAsRead = (id: string) => {
  return useApiMutation<unknown, unknown>(
    `/notification/mark-as-read/${id}`,
    "post"
  );
};

export const useMarkAllNotificationAsRead = (accountId: string) => {
  return useApiMutation<unknown, unknown>(
    `/notification/mark-all-as-read/${accountId}`,
    "post"
  );
};
