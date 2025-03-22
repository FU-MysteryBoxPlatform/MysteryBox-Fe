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
  { title: "Quản lý đấu giá", url: "/management/manage-auction", icon: Crown },
  { title: "Quản lý yêu cầu đấu giá", url: "/management/manage-auction-request", icon: Crown },
  {
    title: "Quản lý yêu cầu rút tiền",
    url: "/management/manage-withdraw",
    icon: Coins,
  },
];

const ADMIN_ITEMS = [
  { title: "Tổng Quan", url: "/management/dashboard", icon: ChartArea },
  {
    title: "Cài đặt hệ thống",
    url: "/management/system-setting",
    icon: Settings,
  },
  { title: "Quản lý tài khoản", url: "/management/manage-account", icon: User },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useContext(GlobalContext);

  return (
    <Sidebar className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl">
      <SidebarContent className="p-4">
        <SidebarGroup>
          {/* Logo Section */}
          <div className="mb-8 flex items-center justify-center pt-6">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/logo-large.png"
                alt="mybox"
                width={140}
                height={48}
                className="object-contain transition-transform hover:scale-105 filter drop-shadow-md"
              />
            </Link>
          </div>

          {/* Menu Section */}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {(user?.mainRole === "MODERATORS" ? MOD_ITEMS : ADMIN_ITEMS).map(
                (item) => {
                  const isActive = pathname.includes(item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-red-600 text-white shadow-md"
                            : "text-black hover:bg-red-700 hover:text-white hover:shadow-sm",
                          "group"
                        )}
                      >
                        <Link href={item.url}>
                          <item.icon
                            className={cn(
                              "h-5 w-5 transition-colors duration-200",
                            
                            )}
                          />
                          <span className="font-medium ">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
