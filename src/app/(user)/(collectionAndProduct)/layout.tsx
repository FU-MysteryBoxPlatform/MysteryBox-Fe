"use client";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="my-10">
          <div className="flex max-md:flex-col items-start gap-6">
            <div className="w-[200px] p-4 border border-gray-300 rounded-lg grid gap-2">
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
    name: "Sản phẩm",
    value: "my-product",
  },
  {
    name: "Bộ sưu tập",
    value: "my-collection",
  },
];
