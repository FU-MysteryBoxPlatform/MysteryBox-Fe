"use client";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import BellIcon from "../icons/BellIcon";
import CartIcon from "../icons/CartIcon";
import SearchIcon from "../icons/SearchIcon";
import UserIcon from "../icons/UserIcon";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useContext } from "react";
import { GlobalContext } from "@/provider/global-provider";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import cookie from "@/utils/cookie";
import { Button } from "../ui/button";

export default function Header() {
  const pathname = usePathname();
  const { cart, user, isFetchingUser, setUser } = useContext(GlobalContext);
  const router = useRouter();

  const isLoggedIn = !!user;

  const handleLogout = () => {
    cookie.delete("ACCESS_TOKEN");
    cookie.delete("REFRESH_TOKEN");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  console.log({ user });

  return (
    <div className="px-4 md:px-10 lg:px-16 py-4 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-between max-w-[1280px] mx-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="logo" className="w-[134px]" />

        <div className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-700 font-semibold hover:text-[#E12E43] transition-all"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-8 lg:flex">
          <SearchIcon />
          <BellIcon />
          {!isFetchingUser && user?.mainRole === "COLLECTOR" && (
            <Link href="/cart">
              <div className="relative">
                {cart?.length && cart?.length > 0 ? (
                  <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-white bg-red-500 text-xs">
                    {cart?.length}
                  </div>
                ) : null}
                <CartIcon />
              </div>
            </Link>
          )}
          {isFetchingUser ? null : isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <UserIcon className="w-7 h-7" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-4 grid gap-2">
                {SUB_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-2 py-1 hover:bg-gray-100 rounded-md",
                      user.mainRole !== item.role && "hidden",
                      pathname.includes(item.href) && "bg-gray-100"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <button
                  className="px-2 py-1 hover:bg-gray-100 rounded-md text-red-500"
                  onClick={handleLogout}
                >
                  Đăng xuất
                </button>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
              onClick={() => router.push("/login")}
            >
              Đăng nhập
            </Button>
          )}
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
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 font-semibold hover:text-[#E12E43] transition-all"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-6">
                  <SearchIcon />
                  <BellIcon />

                  {!isFetchingUser && user?.mainRole === "COLLECTOR" && (
                    <Link href="/cart">
                      <div className="relative w-fit">
                        {cart?.length && cart?.length > 0 ? (
                          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center rounded-full text-white bg-red-500 text-xs">
                            {cart?.length}
                          </div>
                        ) : null}
                        <CartIcon />
                      </div>
                    </Link>
                  )}
                  {isFetchingUser ? null : isLoggedIn ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <UserIcon className="w-7 h-7" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-4 grid gap-2">
                        {SUB_NAV_ITEMS.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                              "px-2 py-1 hover:bg-gray-100 rounded-md",
                              user.mainRole !== item.role && "hidden",
                              pathname.includes(item.href) && "bg-gray-100"
                            )}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button
                      className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
                      onClick={() => router.push("/login")}
                    >
                      Đăng nhập
                    </Button>
                  )}
                </div>
                {isLoggedIn && (
                  <button
                    className="mt-4 py-1 hover:bg-gray-100 rounded-md text-red-500"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                )}
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

const SUB_NAV_ITEMS = [
  {
    name: "Hồ sơ",
    href: "/profile",
    role: "COLLECTOR",
  },
  {
    name: "Bộ sưu tập",
    href: "/my-collection",
    role: "COLLECTOR",
  },
  {
    name: "Đơn hàng",
    href: "/orders",
    role: "COLLECTOR",
  },
  {
    name: "Quản lý",
    href: "/manage-collection",
    role: "MODERATORS",
  },
];
