"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Users, Clock } from "lucide-react";
import dayjs from "dayjs";
import {
  useGetHistoryTransferInventoryById,
  useGetListItemInCollection,
} from "@/hooks/api/useInventory";
import { useParams } from "next/navigation";
import { Collection, Inventory } from "@/types";
import { formatDate } from "@/lib/utils";

export default function InventoryPage() {
  const { id } = useParams();

  const [openInventoryModal, setOpenInventoryModal] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<
    Inventory | undefined
  >(undefined);

  const { mutateAsync: getListItemInCollection } = useGetListItemInCollection();
  const [collection, setCollection] = useState<Collection>();
  const [inventories, setInventories] = useState<any[]>([]);
  const { data, refetch } = useGetHistoryTransferInventoryById(
    selectedInventory?.inventoryId || ""
  );

  useEffect(() => {
    getListItemInCollection(
      {
        collectionId: id as string,
        pageNumber: 1,
        pageSize: 10,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setCollection(data.result.collection);
            setInventories(data.result.inventories);
          }
        },
      }
    );
  }, []);

  const handleOpenDetail = async (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setOpenDetailModal(true);
  };

  useEffect(() => {
    if (selectedInventory) refetch();
  }, [selectedInventory]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-50 to-indigo-50 p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {collection?.collectionName}
            </h1>
            <p className="text-gray-600 mt-2 max-w-2xl">
              {collection?.description}
            </p>
          </div>
          <Badge variant="secondary" className="text-sm px-3 py-1">
            <Users className="w-4 h-4 mr-2" />
            {inventories.length} vật phẩm
          </Badge>
        </div>
        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Bắt đầu: {formatDate(collection?.startTime ?? "")}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Kết thúc: {formatDate(collection?.endTime ?? "")}
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Danh sách vật phẩm
          </h2>
          <Dialog
            open={openInventoryModal}
            onOpenChange={setOpenInventoryModal}
          >
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="bg-red-600 hover:bg-red-700"
              >
                <Users className="w-4 h-4 mr-2" />
                Xem tổng quan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[650px]">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Tổng quan vật phẩm
                </DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[450px] pr-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead>Vật phẩm</TableHead>
                      <TableHead>Chủ sở hữu</TableHead>
                      <TableHead>Ngày nhận</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventories.map((inv) => (
                      <TableRow
                        key={inv.inventoryId}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium">
                          {inv.product.name}
                        </TableCell>
                        <TableCell>
                          {inv.account.firstName} {inv.account.lastName}
                          <span className="text-gray-500">
                            {" "}
                            ({inv.account.email})
                          </span>
                        </TableCell>
                        <TableCell>
                          {dayjs(inv.accquiredDate).format("DD/MM/YYYY HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              inv.itemStatus.name === "AVAILABLE"
                                ? "default"
                                : "outline"
                            }
                            className={
                              inv.itemStatus.name === "AVAILABLE"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {inv.itemStatus.name}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Vật phẩm</TableHead>
              <TableHead>Chủ sở hữu</TableHead>
              <TableHead>Ngày nhận</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Chi tiết</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventories.map((inv) => (
              <TableRow
                key={inv.inventoryId}
                className="hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <img
                    src={inv.product.imagePath}
                    alt={inv.product.name}
                    className="w-14 h-14 rounded-lg object-cover shadow-sm"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {inv.product.name}
                </TableCell>
                <TableCell>
                  {inv.account.firstName} {inv.account.lastName}
                  <span className="text-gray-500"> ({inv.account.email})</span>
                </TableCell>
                <TableCell>
                  {dayjs(inv.accquiredDate).format("DD/MM/YYYY HH:mm")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inv.itemStatus.name === "AVAILABLE"
                        ? "default"
                        : "outline"
                    }
                    className={
                      inv.itemStatus.name === "AVAILABLE"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {inv.itemStatus.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenDetail(inv)}
                    className="hover:bg-indigo-100 hover:text-indigo-600"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Lịch sử chuyển nhượng</DialogTitle>
          </DialogHeader>
          {selectedInventory && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                <img
                  src={selectedInventory.product.imagePath}
                  alt={selectedInventory.product.name}
                  className="w-16 h-16 rounded-lg object-cover shadow-sm"
                />
                <div>
                  <p className="font-semibold text-lg">
                    {selectedInventory.product.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Chủ sở hữu hiện tại: {selectedInventory.account.firstName}{" "}
                    {selectedInventory.account.lastName}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <ScrollArea className="h-[400px] pr-4">
                <div className="relative">
                  {/* Dòng thời gian dọc */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-6">
                    {data?.result.items.map((transfer, index) => (
                      <div
                        key={transfer.transferItemHistoryId}
                        className="relative pl-12"
                      >
                        {/* Điểm trên timeline */}
                        <div className="absolute left-4 w-2.5 h-2.5 bg-indigo-600 rounded-full top-2"></div>

                        {/* Nội dung chuyển nhượng */}
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                Từ: {transfer.sender?.firstName}{" "}
                                {transfer.sender?.lastName}
                                <span className="text-gray-500">
                                  {" "}
                                  ({transfer.sender?.email})
                                </span>
                              </p>
                              <p className="text-sm font-medium text-gray-800 mt-1">
                                Đến: {transfer.receiver?.firstName}{" "}
                                {transfer.receiver?.lastName}
                                <span className="text-gray-500">
                                  {" "}
                                  ({transfer.receiver?.email})
                                </span>
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {dayjs(transfer?.transferDate).format(
                                "DD/MM/YYYY HH:mm"
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Điểm bắt đầu - nếu không có lịch sử */}
                    {(!data?.result.items ||
                      data.result.items.length === 0) && (
                      <div className="relative pl-12">
                        <div className="absolute left-4 w-2.5 h-2.5 bg-indigo-600 rounded-full top-2"></div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                          <p className="text-sm text-gray-600">
                            Chưa có lịch sử chuyển nhượng
                          </p>
                          <p className="text-sm font-medium">
                            Chủ sở hữu ban đầu:{" "}
                            {selectedInventory.account.firstName}{" "}
                            {selectedInventory.account.lastName}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
