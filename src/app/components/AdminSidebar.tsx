"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import {
  ArrowLeftRight,
  ChartArea,
  Coins,
  Crown,
  HandCoins,
  Settings,
  ShoppingBasket,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

// Menu items.
const MOD_ITEMS = [
  {
    title: "Quản lý bộ sưu tập",
    url: "/management/manage-collection",
    icon: ChartArea,
  },
  {
    title: "Quản lý vật phẩm",
    url: "/management/manage-product",
    icon: HandCoins,
  },
  {
    title: "Quản lý đơn hàng",
    url: "/management/manage-order",
    icon: ShoppingBasket,
  },
  {
    title: "Quản lý giao dịch",
    url: "/management/manage-transaction",
    icon: ArrowLeftRight,
  },
  {
    title: "Quản lý đấu giá",
    url: "/management/manage-auction",
    icon: Crown,
  },
  {
    title: "Quản lý yêu cầu rút tiền",
    url: "/management/manage-withdraw",
    icon: Coins,
  },
];

const ADMIN_ITEMS = [
  {
    title: "Tổng Quan",
    url: "/management/dashboard",
    icon: ChartArea,
  },
  {
    title: "Cài đặt hệ thống",
    url: "/management/system-setting",
    icon: Settings,
  },
  {
    title: "Quản lý tài khoản",
    url: "/management/manage-account",
    icon: User,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useContext(GlobalContext);

  return (
    <Sidebar>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <div className="mb-10 flex-1 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo-large.png"
                alt="mybox"
                width={32}
                height={32}
                className="w-24 object-cover"
              />
            </Link>
          </div>
          <SidebarGroupContent>
            {user?.mainRole === "MODERATORS" ? (
              <SidebarMenu>
                {MOD_ITEMS.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn(
                      pathname.includes(item.url) &&
                        "bg-gray-200 font-semibold",
                      "rounded-md"
                    )}
                  >
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon
                          strokeWidth={pathname === item.url ? 2.5 : 1}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            ) : (
              <SidebarMenu>
                {ADMIN_ITEMS.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn(
                      pathname.includes(item.url) &&
                        "bg-gray-200 font-semibold",
                      "rounded-md"
                    )}
                  >
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon
                          strokeWidth={pathname === item.url ? 2.5 : 1}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
