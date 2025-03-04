"use client";;
import { ArrowLeft, Check, Clock, Package, Star } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

import RarityColorBadge from "@/app/components/RarityColorBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useGetExchangeRequestById } from "@/hooks/api/useExchange";
import { Inventory, useGetAllInventory } from "@/hooks/api/useInventory";
import { useCreateOfferExchange } from "@/hooks/api/useOfferExchange";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { useParams } from "next/navigation";

export default function TradePage() {
  const { user } = useContext(GlobalContext);
  const { id } = useParams();

  const [selectedItem, setSelectedItem] = useState<string>();
  const [tradeSubmitted, setTradeSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [content, setContent] = useState<string>("");

  const { mutate: mutateGetAllInventory } = useGetAllInventory();
  const { mutate: mutateCreateOfferExchange } = useCreateOfferExchange();
  const { data } = useGetExchangeRequestById(id as string);
  const tradeItemDetail = data?.result;
  const toggleItemSelection = (itemId: string) => {
    setSelectedItem(itemId);
  };

  const handleSubmitTrade = () => {
    mutateCreateOfferExchange(
      {
        exchangeId: id,
        inventoryId: selectedItem,
        content: content,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setTradeSubmitted(true);
            toast({ title: "Đã gửi đề xuất giao dịch thành công" });
          } else {
            toast({ title: data.messages[0] });
          }
        },
      }
    );
  };

  const getRarityColor = (id: string) => {
    const rarityMap = {
      Common: "bg-gray-200 text-gray-800",
      Uncommon: "bg-green-100 text-green-800",
      Rare: "bg-blue-100 text-blue-800",
      Epic: "bg-purple-100 text-purple-80 0",
      Legendary: "bg-orange-100 text-orange-800",
    };

    // Assign rarity based on item id for demo purposes
    const itemId = parseInt(id.replace("inv", "")) || parseInt(id);
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
    const rarity: keyof typeof rarityMap = rarities[
      itemId % 5
    ] as keyof typeof rarityMap;

    return {
      rarity,
      classes: rarityMap[rarity],
    };
  };

  console.log({ selectedItem });

  useEffect(() => {
    if (user) {
      mutateGetAllInventory(
        {
          accountId: user?.id || "",
          pageNumber: page,
          pageSize: 10,
        },
        {
          onSuccess: (data) => {
            if (data.isSuccess) {
              setInventories((inventories) => [
                ...inventories,
                ...data.result.items.filter((item) => item.product),
              ]);
              setTotalPage(data.result.totalPages);
            }
          },
        }
      );
    }
  }, [mutateGetAllInventory, page, user, user?.id]);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen ">
      <div className="mb-6">
        <Link
          href="/marketplace"
          className="flex items-center text-sm text-red-700 hover:text-red-900 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay Lại Thị Trường
        </Link>
        <h1 className="text-3xl font-bold text-red-900 flex items-center">
          {tradeItemDetail?.requestInventoryItem?.product?.name}
          <Badge className="ml-3 bg-red-700 hover:bg-red-800 text-white">
            {tradeItemDetail?.requestInventoryItem.collection?.collectionName}
          </Badge>
        </h1>
        <div className="flex items-center mt-2">
          <p className="text-gray-600">
            Đăng bởi {tradeItemDetail?.createByAccount?.firstName}
          </p>

          <div className="ml-4 flex items-center text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {tradeItemDetail?.createDate
                ? `${Math.floor(
                    (new Date().getTime() -
                      new Date(tradeItemDetail.createDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} days ago`
                : "Unknown date"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="rounded-lg overflow-hidden shadow-lg relative group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img
            src={
              tradeItemDetail?.requestInventoryItem.product?.imagePath ||
              "/mock-images/image2.png"
            }
            alt={tradeItemDetail?.requestInventoryItem?.product?.name}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full">
            <RarityColorBadge
              dropRate={
                tradeItemDetail?.requestInventoryItem?.product?.rarityStatus
                  .dropRate || "Unknown"
              }
              rarityName={
                tradeItemDetail?.requestInventoryItem?.product?.rarityStatus
                  .name || "Unknown"
              }
            />
          </div>
        </div>

        <div>
          <Card className="shadow-lg border-none overflow-hidden bg-white">
            <CardHeader className=" text-red-700">
              <CardTitle className="flex items-center text-xl">
                <Package className="mr-2 h-5 w-5" />
                Thông Tin Vật Phẩm
              </CardTitle>
              <CardDescription className="text-red-600">
                Chi tiết về vật phẩm giao dịch này
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 px-6 bg-white">
              <div className="animate-fadeIn">
                <h3 className="font-medium text-red-900 text-lg mb-2 flex items-center">
                  <Star className="mr-2 h-4 w-4 text-red-700" />
                  Mô Tả
                </h3>
                <p className="text-gray-600 bg-red-50 p-3 rounded-md border-l-2 border-red-700">
                  {tradeItemDetail?.requestInventoryItem?.product?.description}
                </p>
              </div>

              <Separator className="my-2" />

              <div>
                <h3 className="font-medium text-red-900 text-lg mb-2 flex items-center">
                  <Package className="mr-2 h-4 w-4 text-red-700" />
                  Thông Tin Giao Dịch
                </h3>
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <p className="text-gray-700">
                    <span className="font-semibold text-red-900">
                      {tradeItemDetail?.createByAccount?.firstName}
                    </span>{" "}
                    đang muốn giao dịch vật phẩm này. Hãy đưa ra đề nghị bằng
                    cách chọn vật phẩm từ kho đồ của bạn.
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Đề nghị hết hạn sau 48 giờ</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-white px-6 pb-6">
              <Dialog  open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 shadow-md text-lg py-6">
                    Đề Xuất Giao Dịch
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-[70vh] p-0 overflow-y-hidden">
                  <DialogHeader className="bg-gradient-to-r from-red-700 to-red-800 text-white p-6 rounded-t-lg">
                    <DialogTitle className="text-xl flex items-center">
                      <Package className="mr-2 h-5 w-5" />
                      Đề Xuất Giao Dịch
                    </DialogTitle>
                    <DialogDescription className="text-red-100">
                      Chọn vật phẩm từ kho đồ của bạn để đổi lấy{" "}
                      <span className="font-semibold text-white"></span>
                    </DialogDescription>
                  </DialogHeader>
                  {tradeSubmitted ? (
                    <div className="flex flex-col items-center justify-center py-12 px-6 bg-white">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-bounce">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2 text-red-900">
                        Đã Gửi Đề Nghị Giao Dịch!
                      </h3>
                      <p className="text-center text-gray-600 max-w-md">
                        Đề nghị giao dịch của bạn đã được gửi đến{" "}
                        <span className="font-semibold text-red-700"></span>.
                        Bạn sẽ nhận được thông báo khi họ phản hồi.
                      </p>
                      <Button
                        className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Đóng
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-white px-4">
                      <div className="max-h-[500px] overflow-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {inventories?.length > 0 &&
                            inventories?.map((item) => (
                              <div
                                key={item.inventoryId}
                                className={cn(
                                  "border rounded-lg overflow-hidden cursor-pointer transition-all transform hover:translate-y-[-2px] hover:shadow-md hover:border-red-500",
                                  selectedItem === item.inventoryId &&
                                    "border-2 border-red-700 bg-red-50 shadow-md"
                                )}
                                onClick={() =>
                                  toggleItemSelection(item.inventoryId)
                                }
                              >
                                <div className="flex gap-3 p-3">
                                  <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                    <img
                                      src={
                                        item.product?.imagePath ||
                                        "/mock-images/image2.png"
                                      }
                                      alt={item.product?.name}
                                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                                    />
                                  </div>
                                  <div>
                                    <div className="flex items-center">
                                      <h4 className="font-medium text-red-900">
                                        {item.product?.name}
                                      </h4>
                                      <Badge
                                        className={`ml-2 text-xs ${
                                          getRarityColor(item.inventoryId)
                                            .classes
                                        }`}
                                      >
                                        {
                                          getRarityColor(item.inventoryId)
                                            .rarity
                                        }
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                      {item.product?.description}
                                    </p>
                                    {selectedItem === item.inventoryId && (
                                      <div className="mt-1 text-xs text-green-600 flex items-center">
                                        <Check className="h-3 w-3 mr-1" />
                                        Đã chọn
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      {page < totalPage && (
                        <button
                          className="mt-4 bg-transparent text-black underline mb-4"
                          onClick={() => setPage((page) => page + 1)}
                        >
                          Tải thêm
                        </button>
                      )}

                      <div>
                        <Label>Nhập nội dung</Label>
                        <Textarea
                          placeholder="Nhập nội dung..."
                          onChange={(e) => setContent(e.target.value)}
                        />
                      </div>

                      <DialogFooter className="px-6 pb-6 pt-2">
                        <Button
                          className="w-full"
                          disabled={!selectedItem}
                          onClick={handleSubmitTrade}
                        >
                          Đề xuất giao dịch
                        </Button>
                      </DialogFooter>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
