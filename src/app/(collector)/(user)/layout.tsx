"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { GlobalContext } from "@/provider/global-provider";
import { Suspense, useContext } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isFetchingUser } = useContext(GlobalContext);

  if (isFetchingUser) {
    return (
      <div className="w-screen h-[90vh] flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  // if (user?.mainRole !== "COLLECTOR") {
  //   return (
  //     <div className="w-screen h-[90vh] flex items-center justify-center">
  //       Bạn không có quyền truy cập trang này
  //     </div>
  //   );
  // }
  return (
    <>
      <Suspense>{children}</Suspense>
    </>
  );
}
