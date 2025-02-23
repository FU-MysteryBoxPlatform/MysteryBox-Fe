"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GlobalContext } from "@/provider/global-provider";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { AdminSidebar } from "../components/AdminSidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isFetchingUser } = useContext(GlobalContext);

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
      <div className="w-full">{children}</div>
    </SidebarProvider>
  );
}
