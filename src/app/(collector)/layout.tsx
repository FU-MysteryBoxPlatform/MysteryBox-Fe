"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { GlobalContext } from "@/provider/global-provider";
import { useContext } from "react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isFetchingUser } = useContext(GlobalContext);

  if (isFetchingUser) {
    return (
      <div className="w-screen h-[90vh] flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }
  if (user?.mainRole === "MODERATORS" || user?.mainRole === "ADMIN") {
    return (
      <div className="w-screen h-[90vh] flex items-center justify-center">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
