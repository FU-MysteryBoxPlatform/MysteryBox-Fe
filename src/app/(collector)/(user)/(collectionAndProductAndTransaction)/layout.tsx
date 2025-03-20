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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-10 h-fit w-full lg:w-[250px] p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className="flex flex-col items-center gap-4 mb-6">
                <img
                  src={user?.avatar || "/placeholder-avatar.png"}
                  alt={`${user?.firstName} ${user?.lastName}`}
                  className="rounded-full object-cover w-24 h-24 border-2 border-gray-200"
                />
                <h3 className="text-lg font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h3>
              </div>
              <nav className="space-y-1">
                {SIDEBAR.map((item) => (
                  <div
                    key={item.name}
                    className={cn(
                      "px-4 py-2 rounded-lg cursor-pointer text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all",
                      pathname.includes(item.value) &&
                        "bg-red-50 text-red-700 font-semibold"
                    )}
                    onClick={() => router.push(`/${item.value}`)}
                  >
                    {item.name}
                  </div>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="w-full">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

const SIDEBAR = [
  { name: "Bộ sưu tập", value: "my-collection" },
  { name: "Kho vật phẩm", value: "my-product" },
  { name: "Yêu cầu bán vật phẩm", value: "my-request-sell" },
  { name: "Trao đổi vật phẩm", value: "my-exchange" },
  { name: "Lịch sử đơn hàng", value: "orders" },
  { name: "Lịch sử giao dịch", value: "my-transaction" },
  { name: "Yêu cầu rút tiền", value: "withdraw-request" },
  { name: "Tin nhắn", value: "messages" },
];
