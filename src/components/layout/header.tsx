"use client";

import { UserIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";

export default function Header() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;
  return (
    <div className="px-4 md:px-10 lg:px-16 py-2 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center justify-between max-w-[1280px] mx-auto">
        <img src="/logo.webp" alt="logo" className="w-14 h-14" />

        <DropdownMenu>
          <DropdownMenuTrigger className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
            <UserIcon />
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </div>
  );
}
