"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Clock, Package, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Inventory, useGetAllInventory } from "@/hooks/api/useInventory";
import { useGetExchangeRequestById } from "@/hooks/api/useExchange";
import { useCreateOfferExchange } from "@/hooks/api/useOfferExchange";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import RarityColorBadge from "@/app/components/RarityColorBadge";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { DialogTrigger } from "@radix-ui/react-dialog";

const ITEMS_PER_PAGE = 10;

interface RarityInfo {
  rarity: string;
  classes: string;
}

const getRarityColor = (id: number): RarityInfo => {
  const rarityMap = {
    Common: "bg-gray-200 text-gray-800",
    Uncommon: "bg-green-100 text-green-800",
    Rare: "bg-blue-100 text-blue-800",
    Epic: "bg-purple-100 text-purple-800",
    Legendary: "bg-orange-100 text-orange-800",
  };

  const itemId = id;
  const rarities = Object.keys(rarityMap);
  const rarity = rarities[itemId % rarities.length] as keyof typeof rarityMap;

  return { rarity, classes: rarityMap[rarity] };
};

const InventoryItem = ({
  item,
  isSelected,
  onSelect,
}: {
  item: Inventory;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const { rarity, classes } = getRarityColor(item.itemStatusId);

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden cursor-pointer transition-all",
        "hover:-translate-y-0.5 hover:shadow-md hover:border-red-600",
        isSelected && "border-2 border-red-600 bg-gray-50 shadow-md"
      )}
      onClick={onSelect}
    >
      <div className="flex gap-3 p-3">
        <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={item.product?.imagePath || "/mock-images/image2.png"}
            alt={item.product?.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 truncate">
              {item.product?.name}
            </h4>
          </div>
          <Badge className={cn("text-xs", classes)}>{rarity}</Badge>

          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {item.product?.description}
          </p>
          {isSelected && (
            <div className="mt-1 text-xs text-green-600 flex items-center">
              <Check className="h-3 w-3 mr-1" /> Đã chọn
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function TradePage() {
  const { user } = useContext(GlobalContext);
  const { id } = useParams<{ id: string }>();

  const [selectedItem, setSelectedItem] = useState<string | undefined>();
  const [tradeSubmitted, setTradeSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [content, setContent] = useState("");

  const { mutate: fetchInventories, isPending: isFetchingInventories } =
    useGetAllInventory();
  const { mutate: createOfferExchange, isPending } = useCreateOfferExchange();
  const { data, isLoading: isLoadingTrade } = useGetExchangeRequestById(id);
  const tradeItemDetail = data?.result;

  const loadInventories = useCallback(() => {
    if (!user?.id) return;

    fetchInventories(
      { accountId: user.id, pageNumber: page, pageSize: ITEMS_PER_PAGE },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setInventories((prev) => [
              ...prev,
              ...data.result.items.filter((item) => item.product),
            ]);
            setTotalPages(data.result.totalPages);
          }
        },
        onError: () =>
          toast({ title: "Lỗi khi tải kho đồ", variant: "destructive" }),
      }
    );
  }, [fetchInventories, page, user?.id]);

  useEffect(() => {
    loadInventories();
  }, [loadInventories]);

  const handleSubmitTrade = () => {
    if (!selectedItem) return;

    createOfferExchange(
      { exchangeId: id, inventoryId: selectedItem, content },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setTradeSubmitted(true);
            toast({ title: "Đã gửi đề xuất giao dịch thành công" });
          } else {
            toast({ title: data.messages[0], variant: "destructive" });
          }
        },
        onError: () =>
          toast({ title: "Lỗi khi gửi đề xuất", variant: "destructive" }),
      }
    );
  };

  if (isLoadingTrade) {
    return (
      <div className="container mx-auto py-10 text-center bg-gray-50">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 lg:px-6 bg-gray-50">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/marketplace"
          className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại thị trường
        </Link>
        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900 flex items-center">
          {tradeItemDetail?.requestInventoryItem?.product?.name}
          <Badge className="ml-3 bg-red-600 hover:bg-red-700 text-white text-sm">
            {tradeItemDetail?.requestInventoryItem.collection?.collectionName}
          </Badge>
        </h1>
        <div className="mt-2 flex items-center text-gray-500 text-sm">
          <span>Đăng bởi {tradeItemDetail?.createByAccount?.firstName}</span>
          <div className="ml-4 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>
              {tradeItemDetail?.createDate
                ? `${Math.floor(
                    (Date.now() -
                      new Date(tradeItemDetail.createDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} ngày trước`
                : "Không rõ ngày"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Item Image */}
        <div className="relative rounded-lg overflow-hidden shadow-lg group bg-white">
          <img
            src={
              tradeItemDetail?.requestInventoryItem.product?.imagePath ||
              "/mock-images/image2.png"
            }
            alt={tradeItemDetail?.requestInventoryItem?.product?.name}
            className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4">
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

        {/* Item Details and Trade Form */}
        <Card className="shadow-xl border border-gray-200">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle className="flex items-center text-xl text-gray-900">
              <Package className="mr-2 h-5 w-5" /> Thông tin vật phẩm
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Star className="mr-2 h-4 w-4" /> Mô tả
              </h3>
              <p className="mt-2 text-gray-700 bg-gray-100 p-3 rounded-md border-l-4 border-red-600">
                {tradeItemDetail?.requestInventoryItem?.product?.description}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center">
                <Package className="mr-2 h-4 w-4" /> Thông tin giao dịch
              </h3>
              <div className="mt-2 bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-900">
                    {tradeItemDetail?.createByAccount?.firstName}
                  </span>{" "}
                  đang muốn giao dịch vật phẩm này. Hãy chọn vật phẩm từ kho đồ
                  của bạn để đề xuất.
                </p>
                <div className="mt-2 text-sm text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> Đề nghị hết hạn sau 48 giờ
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Đề xuất giao dịch
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[650px] max-h-[80vh] p-0">
                <DialogHeader className=" p-6 rounded-t-lg">
                  <DialogTitle className="text-xl flex items-center">
                    <Package className="mr-2 h-5 w-5" /> Đề xuất giao dịch
                  </DialogTitle>
                </DialogHeader>
                {tradeSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-12 px-6">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6 animate-bounce">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900">
                      Đã gửi đề nghị!
                    </h3>
                    <p className="text-center text-gray-600 mt-2">
                      Đề nghị của bạn đã được gửi. Bạn sẽ nhận thông báo khi
                      được phản hồi.
                    </p>
                    <Button
                      className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Đóng
                    </Button>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    <div className="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                      {inventories.length === 0 && !isFetchingInventories ? (
                        <p className="text-center text-gray-500 py-4">
                          Không có vật phẩm nào để hiển thị
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {inventories.map((item) => (
                            <InventoryItem
                              key={item.inventoryId}
                              item={item}
                              isSelected={selectedItem === item.inventoryId}
                              onSelect={() => setSelectedItem(item.inventoryId)}
                            />
                          ))}
                        </div>
                      )}
                      {isFetchingInventories && <LoadingIndicator />}
                    </div>
                    {page < totalPages && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setPage((prev) => prev + 1)}
                        disabled={isFetchingInventories}
                      >
                        Tải thêm
                      </Button>
                    )}
                    <div className="space-y-2">
                      <Label className="text-gray-700">Nội dung đề xuất</Label>
                      <Textarea
                        placeholder="Nhập nội dung đề xuất của bạn..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700"
                        disabled={
                          !selectedItem || isPending || isFetchingInventories
                        }
                        onClick={handleSubmitTrade}
                      >
                        {isPending ? <LoadingIndicator /> : "Gửi đề xuất"}
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
  );
}
