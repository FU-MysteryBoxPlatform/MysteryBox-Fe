"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import UserIcon from "@/components/icons/UserIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GlobalContext } from "@/provider/global-provider";
import cookie from "@/utils/cookie";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AdminSidebar } from "../components/AdminSidebar";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { user, isFetchingUser, setUser } = useContext(GlobalContext);

  const handleLogout = () => {
    cookie.delete("ACCESS_TOKEN");
    cookie.delete("REFRESH_TOKEN");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  if (isFetchingUser) {
    return (
      <div className="w-screen h-[90vh] flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }
  if (user?.mainRole !== "MODERATORS" && user?.mainRole !== "ADMIN") {
    return (
      <div className="w-screen h-[90vh] flex items-center justify-center">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <div className="w-full">
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="py-4 px-6 flex items-center justify-between">
            <div className="text-lg font-semibold text-gray-800">
              {user?.mainRole === "ADMIN"
                ? "Admin Panel"
                : "Moderator Dashboard"}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                <UserIcon className="w-7 h-7 text-gray-600 hover:text-indigo-600 transition-colors" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName || "User"}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 p-2 mt-2 bg-white rounded-lg shadow-lg border border-gray-100">
                <DropdownMenuItem
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer transition-colors"
                  onClick={handleLogout}
                >
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {children}
      </div>
    </SidebarProvider>
  );
}
