"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { GlobalContext } from "@/provider/global-provider";
import { useContext } from "react";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import Link from "next/link";

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
        <p>Bạn không có quyền truy cập trang này</p>
        <Link href="/management" className="underline">
          Đến trang quản lý
        </Link>
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
