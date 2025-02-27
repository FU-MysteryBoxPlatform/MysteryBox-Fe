"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { GlobalContext } from "@/provider/global-provider";
import { useContext } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isFetchingUser } = useContext(GlobalContext);

  if (isFetchingUser)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );

  return <div className="w-full">{children}</div>;
}
