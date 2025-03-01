"use client";
import Countdown from "@/app/components/Countdown";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { AlignJustify } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div>
      <img
        src="/auction-banner.png"
        alt="Banner auctions"
        className="object-cover w-full max-h-[70vh]"
      />
      <div className="bg-[#F4F1F1] py-10 px-4 md:px-10 lg:px-16 flex flex-col xl:flex-row items-center justify-between">
        <p className="uppercase text-xl md:text-2xl lg:text-4xl font-semibold max-xl:mb-10">
          Đấu giá sắp diễn ra
        </p>
        <Countdown targetDate={dayjs("05/03/2025").toISOString()} />
      </div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16 py-10">
        <div className="w-full flex gap-6 flex-col lg:flex-row">
          <div className="shrink-0 max-lg:hidden">
            <p className="md:text-lg lg:text-xl bg-black text-white py-1 px-4 uppercase font-bold mb-2">
              Đấu giá
            </p>
            <div className="p-4 border border-gray-200 grid gap-3">
              {SIDE_ITEMS.map((item) => (
                <div
                  key={item.name}
                  className={cn(
                    "px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100",
                    pathname.includes(item.value) && "bg-gray-100 font-bold"
                  )}
                  onClick={() => router.push(item.value)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:hidden flex justify-between items-center w-fit ml-auto gap-3">
            <p className="md:text-lg lg:text-xl bg-black text-white py-1 px-4 uppercase font-bold">
              Đấu giá
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-haspopup="true" size="icon" variant="ghost">
                  <AlignJustify />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {SIDE_ITEMS.map((item) => (
                  <DropdownMenuItem
                    key={item.name}
                    className={cn(
                      "px-2 py-1 rounded-md cursor-pointer hover:bg-gray-100",
                      pathname.includes(item.value) && "bg-gray-100 font-bold"
                    )}
                    onClick={() => router.push(item.value)}
                  >
                    {item.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex-1 p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

const SIDE_ITEMS = [
  {
    name: "Đăng ký & Đấu thầu",
    value: "/auctions/register-and-bid",
  },
  {
    name: "Auctions boxes",
    value: "/auctions/auctions-boxes",
  },
  {
    name: "Winning bids",
    value: "/auctions/winning-bids",
  },
  {
    name: "Item wishlist",
    value: "/auctions/item-wishlist",
  },
];
