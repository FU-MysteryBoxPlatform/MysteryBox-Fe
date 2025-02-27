"use client";

import { GlobalContext } from "@/provider/global-provider";
import { redirect } from "next/navigation";
import { useContext } from "react";

export default function Page() {
  const { user } = useContext(GlobalContext);
  return redirect(
    user?.mainRole === "ADMIN"
      ? "/management/manage-account"
      : "/management/manage-collection"
  );
}
