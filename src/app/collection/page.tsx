"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlusIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "product";

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="my-10">
          <p className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">
            Sản phẩm và bộ sưu tập
          </p>

          <div className="flex max-md:flex-col items-start gap-6">
            <div className="w-[200px] p-4 border border-gray-300 rounded-lg grid gap-2">
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
            {tab === "collection" ? (
              <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full">
                <Button className="flex items-center gap-2">
                  Tạo bộ sưu tập <PlusIcon />
                </Button>
              </div>
            ) : (
              <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full">
                <Button className="flex items-center gap-2">
                  Tạo sản phẩm <PlusIcon />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const SIDEBAR = [
  {
    name: "Sản phẩm",
    value: "product",
  },
  {
    name: "Bộ sưu tập",
    value: "collection",
  },
];
