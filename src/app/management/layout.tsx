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
        <div className="py-6 px-10 border-b border-gray-200 flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserIcon className="w-7 h-7" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4 grid gap-2">
              <button
                className="px-2 py-1 hover:bg-gray-100 rounded-md text-red-500"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {children}
      </div>
    </SidebarProvider>
  );
}
