"use client";

import { use, useEffect, useState } from "react";
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
import { Eye } from "lucide-react";
import dayjs from "dayjs";
import {
  useGetHistoryTransferInventoryById,
  useGetListItemInCollection,
} from "@/hooks/api/useInventory";
import { useParams } from "next/navigation";
import { any } from "zod";
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
        onError: (error) => {
          console.log(error);
        },
      }
    );
  }, []);

  const handleOpenDetail = async (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setOpenDetailModal(true);
  };

  useEffect(() => {
    if (selectedInventory) {
      refetch();
    }
  }, [selectedInventory]);


  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          {collection?.collectionName}
        </h1>
        <p className="text-gray-600">{collection?.description}</p>
        <div className="mt-2 flex gap-4">
          {collection && (
            <>
              <p className="text-sm text-gray-500">
                Ngày bắt đầu: {formatDate(collection.startTime)}
              </p>
              <p className="text-sm text-gray-500">
                Kết thúc:{formatDate(collection.endTime)}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Inventory List */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg  text-gray-700 font-bold">
            Danh sách vật phẩm mở ra từ bộ sưu tập
          </h2>
          <Dialog
            open={openInventoryModal}
            onOpenChange={setOpenInventoryModal}
          >
            <DialogTrigger asChild>
              <Button variant="outline">Xem tổng quan</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Tổng quan vật phẩm mở ra</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vật phẩm</TableHead>
                      <TableHead>Người sở hữu</TableHead>
                      <TableHead>Ngày nhận</TableHead>
                      <TableHead>Trạng thái</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventories.map((inv) => (
                      <TableRow key={inv.inventoryId}>
                        <TableCell>{inv.product.name}</TableCell>
                        <TableCell>
                          {inv.account.firstName} {inv.account.lastName} (
                          {inv.account.email})
                        </TableCell>
                        <TableCell>
                          {dayjs(inv.accquiredDate).format("DD/MM/YYYY HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              inv.itemStatus.name === "AVAILABLE"
                                ? "default"
                                : "secondary"
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
            <TableRow>
              <TableHead>Hình ảnh</TableHead>
              <TableHead>Vật phẩm</TableHead>
              <TableHead>Người sở hữu</TableHead>
              <TableHead>Ngày nhận</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventories.map((inv) => (
              <TableRow key={inv.inventoryId}>
                <TableCell>
                  <img
                    src={inv.product.imagePath}
                    alt={inv.product.name}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </TableCell>
                <TableCell>{inv.product.name}</TableCell>
                <TableCell>
                  {inv.account.firstName} {inv.account.lastName} (
                  {inv.account.email})
                </TableCell>
                <TableCell>
                  {dayjs(inv.accquiredDate).format("DD/MM/YYYY HH:mm")}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inv.itemStatus.name === "AVAILABLE"
                        ? "default"
                        : "secondary"
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
                  >
                    <Eye className="w-4 h-4 mr-1" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Dialog open={openDetailModal} onOpenChange={setOpenDetailModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Lịch sử chuyển nhượng</DialogTitle>
          </DialogHeader>
          {selectedInventory && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedInventory.product.imagePath}
                  alt={selectedInventory.product.name}
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div>
                  <p className="font-medium">
                    {selectedInventory.product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sở hữu bởi: {selectedInventory.account.firstName}{" "}
                    {selectedInventory.account.lastName}
                  </p>
                </div>
              </div>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Từ</TableHead>
                      <TableHead>Đến</TableHead>
                      <TableHead>Ngày chuyển</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.result.items.map((transfer) => (
                      <TableRow key={transfer.transferItemHistoryId}>
                        <TableCell>
                          {transfer.sender?.firstName}{" "}
                          {transfer.sender?.lastName} ({transfer.sender?.email})
                        </TableCell>
                        <TableCell>
                          {transfer.receiver?.firstName}{" "}
                          {transfer.receiver?.lastName} (
                          {transfer.receiver?.email})
                        </TableCell>
                        <TableCell>
                          {dayjs(transfer?.transferDate).format(
                            "DD/MM/YYYY HH:mm"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
