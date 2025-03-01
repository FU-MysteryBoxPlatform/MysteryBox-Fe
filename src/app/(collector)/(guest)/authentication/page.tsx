"use client";

import { useGetAccountById } from "@/hooks/api/useAuth";
import { GlobalContext } from "@/provider/global-provider";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect } from "react";

export default function Page() {
  const { setUser } = useContext(GlobalContext);
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const authen = params["authen"];
  const page = params["page"];

  const { data, isLoading } = useGetAccountById(authen as string);

  useEffect(() => {
    if (data) {
      setUser(data.result);
    }
  }, [data, setUser]);

  return <div>Authentication</div>;
}
