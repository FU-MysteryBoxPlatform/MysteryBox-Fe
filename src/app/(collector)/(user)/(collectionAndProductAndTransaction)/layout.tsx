"use client";
import { cn } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useContext(GlobalContext);
  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="my-10">
          <div className="flex max-md:flex-col items-start gap-6">
            <div className="md:w-[200px] w-full  p-4 border border-gray-300 rounded-lg grid gap-2">
              <div className="flex flex-col items-center gap-2">
                <img
                  src={user?.avatar}
                  alt=""
                  className="rounded-full object-cover"
                  style={{ width: "100px", height: "100px" }}
                />

                <h3 className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </h3>
              </div>

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
    name: "Bộ sưu tập",
    value: "my-collection",
  },
  {
    name: "Kho vật phẩm",
    value: "my-product",
  },
  {
    name: "Yêu cầu bán vật phẩm",
    value: "my-request-sell",
  },
  {
    name: "Trao đổi vật phẩm",
    value: "my-exchange",
  },
  {
    name: "Lịch sử đơn hàng",
    value: "orders",
  },
  {
    name: "Lịch sử giao dịch",
    value: "my-transaction",
  },
];
