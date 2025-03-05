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
import { EllipsisVertical } from "lucide-react";
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
    <div
      key={item.notificationId}
      className="flex items-start gap-2 justify-between"
    >
      <div className="hover:bg-gray-100 rounded-md p-2 relative">
        <div className="font-bold mb-1 flex gap-1 select-none">
          {item.notificationName}
          {!item.isRead && (
            <div className="w-3 h-3 bg-red-500 rounded-full shrink-0"></div>
          )}
        </div>
        <p className="text-sm select-none">{item.messages}</p>
      </div>
      {!item.isRead && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical className="w-5 h-5 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2">
            <div
              className="cursor-pointer p-2 hover:bg-gray-100 rounded-md"
              onClick={handleMarkAsRead}
            >
              Đánh dấu là đã đọc
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default function Notification() {
  const { user } = useContext(GlobalContext);
  const [notifications, setNotifications] = useState<TNotification[]>([]);

  const { data, refetch } = useGetNotifications(user?.id || "");
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
    refetch();
  }, [refetch, user?.id]);

  useEffect(() => {
    setNotifications(data?.result.items || []);
  }, [data]);

  return (
    <Popover>
      <PopoverTrigger>
        <div className="relative w-fit">
          {numberOfUnreadNotifications > 0 && (
            <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-white bg-red-500 text-xs">
              {numberOfUnreadNotifications}
            </div>
          )}
          <BellIcon />
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className="font-bold text-lg mb-6 flex items-center justify-between">
          Thông báo
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="w-5 h-5 cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2">
              <div
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-md"
                onClick={handleMarkAsReadAll}
              >
                Đánh dấu là đã đọc
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid gap-2 max-h-[300px] overflow-auto">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.notificationId}
              item={notification}
              onSuccess={refetch}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
