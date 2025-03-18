"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPriceVND } from "@/lib/utils";

interface Collection {
  collectionId: string;
  collectionName: string;
  description: string;
  startTime: string;
  endTime: string;
  totalItem: number;
  isActived: boolean;
  rewards: string;
  imagePath: string;
  blindBoxPrice: number;
  discountBlindBoxPrice: number;
}

interface CollectionTableProps {
  collections: Collection[];
}

export function CollectionTable({ collections }: CollectionTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Hình ảnh</TableHead>
            <TableHead>Tên bộ sưu tập</TableHead>
            <TableHead>Giá gốc</TableHead>
            <TableHead>Giá ưu đãi</TableHead>
            <TableHead>Giảm giá</TableHead>
            <TableHead className="hidden md:table-cell">Số lượng</TableHead>
            <TableHead className="hidden md:table-cell">Ngày bắt đầu</TableHead>
            <TableHead className="hidden md:table-cell">
              Ngày kết thúc
            </TableHead>
            <TableHead>Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => {
            const startDate = new Date(collection.startTime);
            const endDate = new Date(collection.endTime);
            const isValidEndDate = endDate.getFullYear() > 2000;

            const discountPercentage = Math.round(
              ((collection.blindBoxPrice - collection.discountBlindBoxPrice) /
                collection.blindBoxPrice) *
                100
            );

            return (
              <TableRow key={collection.collectionId}>
                <TableCell>
                  <div className="relative h-10 w-10 overflow-hidden rounded-md">
                    <Image
                      src={collection.imagePath || "/placeholder.svg"}
                      alt={collection.collectionName}
                      fill
                      className="object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">
                      {collection.collectionName}
                    </div>
                    <div className="hidden text-xs text-muted-foreground md:block line-clamp-1">
                      {collection.description}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="line-through text-muted-foreground">
                  {formatPriceVND(collection.blindBoxPrice)}
                </TableCell>
                <TableCell className="font-medium text-green-600">
                  {formatPriceVND(collection.discountBlindBoxPrice)}
                </TableCell>
                <TableCell className="text-orange-500">
                  {discountPercentage}%
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {collection.totalItem}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {startDate.toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {isValidEndDate ? endDate.toLocaleDateString("vi-VN") : "N/A"}
                </TableCell>
                <TableCell>
                  {collection.isActived ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      Đang hoạt động
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                      Chưa hoạt động
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
