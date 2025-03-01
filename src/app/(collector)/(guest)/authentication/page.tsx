"use client";

import { useGetAccountById } from "@/hooks/api/useAuth";
import { GlobalContext } from "@/provider/global-provider";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect } from "react";

export default function Page() {
  const { setUser } = useContext(GlobalContext);
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const route = useRouter();
  const authen = params["authen"];
  const page = params["page"];

  const { data, isLoading } = useGetAccountById(authen as string);

  useEffect(() => {
    if (data) {
      setUser(data.result);
    }
    route.push(`/${page}`);
  }, [data, setUser]);

  if (isLoading) return <div>Loading...</div>;
  return <div>Authentication</div>;
}
