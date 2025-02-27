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
import { ChartArea, HandCoins } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
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
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="p-4">
        <SidebarGroup>
          <div className="mb-10 flex-1 flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
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
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(
                    pathname.includes(item.url) && "bg-gray-200 font-semibold",
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
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
