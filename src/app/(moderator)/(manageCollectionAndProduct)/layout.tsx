"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { cn } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, isFetchingUser } = useContext(GlobalContext);

  if (isFetchingUser) {
    return (
      <div className="w-screen h-[90vh] flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }
  if (user?.mainRole !== "MODERATORS") {
    return (
      <div className="w-screen h-[90vh] flex items-center justify-center">
        Bạn không có quyền truy cập trang này
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="my-10">
          <div className="flex max-md:flex-col items-start gap-6">
            <div className="w-[200px] p-4 border border-gray-300 rounded-lg grid gap-2 shrink-0">
              {SIDEBAR.map((item) => {
                return (
                  <div
                    key={item.name}
                    className={cn(
                      "px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100",
                      pathname.includes(item.value) && "bg-gray-100 font-bold"
                    )}
                    onClick={() => router.push(`/${item.value}`)}
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

const SIDEBAR = [
  {
    name: "Quản lý bộ sưu tập",
    value: "manage-collection",
  },
  {
    name: "Quản lý vật phẩm",
    value: "manage-product",
  },
];
