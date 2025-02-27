"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { GlobalContext } from "@/provider/global-provider";
import { redirect } from "next/navigation";
import { useContext } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isFetchingUser } = useContext(GlobalContext);

  if (isFetchingUser)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );

  if (!isFetchingUser && user?.mainRole !== "ADMIN")
    return redirect("/management");

  return <div className="w-full">{children}</div>;
}
