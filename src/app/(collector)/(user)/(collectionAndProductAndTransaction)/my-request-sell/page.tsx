"use client";
import type React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { History } from "lucide-react";

// ... (previous sample data remains unchanged)

// New sample data for sale history
const saleHistory = [
  {
    id: 1,
    item: "Excalibur",
    listedDate: "2023-11-15",
    status: "Đã Bán",
    price: 5000,
    buyer: "KingArthur",
    soldDate: "2023-11-20",
  },
  {
    id: 2,
    item: "Mana Potion",
    listedDate: "2023-11-10",
    status: "Hết Hạn",
    price: 100,
    buyer: null,
    soldDate: null,
  },
  {
    id: 3,
    item: "Dragon Scale Armor",
    listedDate: "2023-11-05",
    status: "Đã Bán",
    price: 3000,
    buyer: "DragonSlayer99",
    soldDate: "2023-11-12",
  },
  {
    id: 4,
    item: "Magic Wand",
    listedDate: "2023-11-01",
    status: "Đã Hủy",
    price: 1500,
    buyer: null,
    soldDate: null,
  },
];
const SaleStatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
    "Đã Bán": {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />,
    },
    "Hết Hạn": {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1" />,
    },
    "Đã Hủy": {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: <div className="w-2 h-2 rounded-full bg-red-500 mr-1" />,
    },
  };

  const { color, icon } = statusMap[status] || {
    color: "bg-gray-100 text-gray-800",
    icon: null,
  };

  return (
    <span
      className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${color}`}
    >
      {icon}
      {status}
    </span>
  );
};

export default function Page() {
  return (
    <div className="p-6  rounded-lg flex-1 max-md:w-full">
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Lịch Sử Rao Bán
          </CardTitle>
          <CardDescription>
            Danh sách các vật phẩm bạn đã từng rao bán và trạng thái của chúng.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Vật Phẩm</TableHead>
                  <TableHead>Ngày Đăng</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Người Mua
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Ngày Bán
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {saleHistory.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.item}</TableCell>
                    <TableCell>{item.listedDate}</TableCell>
                    <TableCell>{item.price.toLocaleString()} G</TableCell>
                    <TableCell>
                      <SaleStatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.buyer || "-"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {item.soldDate || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
