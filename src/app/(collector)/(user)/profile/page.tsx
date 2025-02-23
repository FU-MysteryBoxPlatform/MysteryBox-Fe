"use client";
import FormUpdateProfile from "@/app/components/FormUpdateProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "info";
  const { user, isFetchingUser } = useContext(GlobalContext);

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="my-10">
          <p className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">
            Hồ sơ của bạn
          </p>

          <div className="flex max-md:flex-col items-start gap-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {user?.avatar ? (
                  <img
                    src={user?.avatar}
                    alt="avatar"
                    className="w-20 h-20 border-4 border-[#E12E43] rounded-full"
                  />
                ) : (
                  <div className="w-20 h-20 border-4 border-[#E12E43] rounded-full bg-gray-300"></div>
                )}
                {isFetchingUser ? (
                  <Skeleton className="w-16 h-4 " />
                ) : (
                  <p className="text-center text-lg font-semibold">
                    {user?.firstName + " " + user?.lastName}
                  </p>
                )}
                <Link href="/profile/edit" className="text-sm underline">
                  Cập nhật hồ sơ
                </Link>
              </div>
              <div className="w-fit p-4 border border-gray-300 rounded-lg grid gap-2">
                {SIDEBAR.map((item) => {
                  return (
                    <div
                      key={item.name}
                      className={cn(
                        "px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100",
                        tab === item.value && "bg-gray-100 font-bold"
                      )}
                      onClick={() => router.push(`?tab=${item.value}`)}
                    >
                      {item.name}
                    </div>
                  );
                })}
              </div>
            </div>
            {tab === "info" && (
              <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full">
                <FormUpdateProfile />
              </div>
            )}
            {tab === "trade-history" && (
              <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full"></div>
            )}
            {tab === "wallet" && (
              <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const SIDEBAR = [
  {
    name: "Thông tin cá nhân",
    value: "info",
  },
  {
    name: "Lịch sử giao dịch",
    value: "trade-history",
  },
  {
    name: "Ví tiền",
    value: "wallet",
  },
];
