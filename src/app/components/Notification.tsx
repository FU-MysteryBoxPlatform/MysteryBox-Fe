"use client";

import BellIcon from "@/components/icons/BellIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  TNotification,
  useGetNotifications,
  useMarkAllNotificationAsRead,
  useMarkNotificationAsRead,
} from "@/hooks/api/useNotification";
import { GlobalContext } from "@/provider/global-provider";
import { EllipsisVertical, Loader2 } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";

function NotificationItem({
  item,
  onSuccess,
}: {
  item: TNotification;
  onSuccess: () => void;
}) {
  const { mutate: mutateMarkAsRead } = useMarkNotificationAsRead(
    item.notificationId
  );

  const handleMarkAsRead = () => {
    mutateMarkAsRead(
      {},
      {
        onSuccess: (data) => {
          if (data.isSuccess) onSuccess();
        },
      }
    );
  };

  return (
    <div className="flex items-start justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-800 text-sm select-none">
            {item.notificationName}
          </span>
          {!item.isRead && (
            <div className="w-2 h-2 bg-red-500 rounded-full shrink-0"></div>
          )}
        </div>
        <p className="text-sm text-gray-600 select-none line-clamp-2">
          {item.messages}
        </p>
      </div>
      {!item.isRead && (
        <DropdownMenu>
          <DropdownMenuTrigger className="p-1 hover:bg-gray-200 rounded-full transition-colors">
            <EllipsisVertical className="w-4 h-4 text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-1 min-w-[120px]">
            <div
              className="p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
              onClick={handleMarkAsRead}
            >
              Mark as read
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default function Notification() {
  const { user, isFetchingUser } = useContext(GlobalContext);
  const [notifications, setNotifications] = useState<TNotification[]>([]);

  const { data, refetch, isLoading } = useGetNotifications(user?.id || "");
  const { mutate: mutateMarkAsReadAll } = useMarkAllNotificationAsRead(
    user?.id || ""
  );

  const numberOfUnreadNotifications = useMemo(() => {
    return notifications.filter((notification) => !notification.isRead).length;
  }, [notifications]);

  const handleMarkAsReadAll = () => {
    mutateMarkAsReadAll(
      {},
      {
        onSuccess: (data) => {
          if (data.isSuccess) refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (user?.id) refetch();
  }, [refetch, user?.id]);

  useEffect(() => {
    setNotifications(data?.result.items || []);
  }, [data]);

  if (!isFetchingUser && !user) return null;

  return (
    <Popover>
      <PopoverTrigger className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
        <BellIcon className="w-6 h-6 text-gray-700" />
        {numberOfUnreadNotifications > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center rounded-full text-xs text-white bg-red-500">
            {numberOfUnreadNotifications > 9
              ? "9+"
              : numberOfUnreadNotifications}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-lg rounded-lg border border-gray-200 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <EllipsisVertical className="w-5 h-5 text-gray-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-1 min-w-[120px]">
              <div
                className="p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={handleMarkAsReadAll}
              >
                Mark all as read
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <div className="max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No notifications</p>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.notificationId}
                item={notification}
                onSuccess={refetch}
              />
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
