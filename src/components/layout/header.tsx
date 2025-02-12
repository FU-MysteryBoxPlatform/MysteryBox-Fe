"use client";

import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserIcon from "../icons/UserIcon";
import SearchIcon from "../icons/SearchIcon";
import BellIcon from "../icons/BellIcon";
import CartIcon from "../icons/CartIcon";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;
  return (
    <div className="px-4 md:px-10 lg:px-16 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-between max-w-[1280px] mx-auto">
        <img src="/logo.png" alt="logo" className="w-[134px]" />

        <div className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-700 font-semibold hover:text-[#E12E43] transition-all"
            >
              {item.name}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-8 lg:flex">
          <SearchIcon />
          <BellIcon />
          <CartIcon />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserIcon className="w-7 h-7" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4">
              <div>
                <Link href="collector/profile">Hồ sơ</Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="lg:hidden">
          <Drawer>
            <DrawerTrigger>
              <MenuIcon className="w-7 h-7" />
            </DrawerTrigger>
            <DrawerContent className="min-h-[80vh]">
              <div className="p-4">
                <div className="grid gap-6 mb-6">
                  {NAV_ITEMS.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 font-semibold hover:text-[#E12E43] transition-all"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-6">
                  <SearchIcon />
                  <BellIcon />
                  <CartIcon />
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <UserIcon className="w-7 h-7" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="p-4">
                      <div>
                        <Link href="/collector/profile">Hồ sơ</Link>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  {
    name: "Trang chủ",
    href: "/",
  },
  {
    name: "Sản phẩm",
    href: "/products",
  },
  {
    name: "Bán",
    href: "/sell",
  },
  {
    name: "Trao đổi",
    href: "/exchange",
  },
  {
    name: "Đấu giá",
    href: "/auctions",
  },
];
