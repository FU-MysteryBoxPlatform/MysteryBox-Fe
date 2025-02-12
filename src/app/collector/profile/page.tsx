"use client";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "";

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="my-10">
          <p className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">
            Hồ sơ của bạn
          </p>

          <div className="flex items-start gap-6">
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
            <div className="p-6 border border-gray-300 rounded-lg flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SIDEBAR = [
  {
    name: "Thông tin cá nhân",
    value: "",
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
