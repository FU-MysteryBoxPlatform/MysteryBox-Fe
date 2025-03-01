"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Package,
  Shield,
  Sword,
  Star,
  Clock,
} from "lucide-react";

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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import RarityColorBadge from "@/app/components/RarityColorBadge";
import { useGetExchangeRequestById } from "@/hooks/api/useExchange";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";

export default function TradePage() {
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const id = params["id"] as string;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [tradeSubmitted, setTradeSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [itemHover, setItemHover] = useState<string | null>(null);
  const { data } = useGetExchangeRequestById(id);
  const tradeItemDetail = data?.result;
  const toggleItemSelection = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleSubmitTrade = () => {
    setTradeSubmitted(true);
  };

  const getRarityColor = (item: {
    id: string;
    name?: string;
    description?: string;
    category?: string;
    image?: string;
    owner?: string;
    trades?: number;
  }) => {
    const rarityMap = {
      Common: "bg-gray-200 text-gray-800",
      Uncommon: "bg-green-100 text-green-800",
      Rare: "bg-blue-100 text-blue-800",
      Epic: "bg-purple-100 text-purple-80 0",
      Legendary: "bg-orange-100 text-orange-800",
    };

    // Assign rarity based on item id for demo purposes
    const itemId = parseInt(item.id.replace("inv", "")) || parseInt(item.id);
    const rarities = ["Common", "Uncommon", "Rare", "Epic", "Legendary"];
    const rarity: keyof typeof rarityMap = rarities[
      itemId % 5
    ] as keyof typeof rarityMap;

    return {
      rarity,
      classes: rarityMap[rarity],
    };
  };

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
          {tradeItemDetail?.requestInventoryItem.product.name}
          <Badge className="ml-3 bg-red-700 hover:bg-red-800 text-white">
            {tradeItemDetail?.requestInventoryItem.collection?.collectionName}
          </Badge>
        </h1>
        <div className="flex items-center mt-2">
          <p className="text-gray-600">
            Đăng bởi {tradeItemDetail?.createByAccount.firstName}
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
              tradeItemDetail?.requestInventoryItem.product.imagePath ||
              "/mock-images/image2.png"
            }
            alt={tradeItemDetail?.requestInventoryItem.product.name}
            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full">
            <RarityColorBadge
              dropRate={
                tradeItemDetail?.requestInventoryItem.product.rarityStatus
                  .dropRate || "Unknown"
              }
              rarityName={
                tradeItemDetail?.requestInventoryItem.product.rarityStatus
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
                  {tradeItemDetail?.requestInventoryItem.product.description}
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
                      {tradeItemDetail?.createByAccount.firstName}
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 shadow-md text-lg py-6">
                    Đề Xuất Giao Dịch
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
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
                    <div className="bg-white">
                      <Tabs defaultValue="weapons" className="p-6">
                        <TabsList className="grid grid-cols-3 mb-6 bg-red-50 p-1 rounded-lg">
                          <TabsTrigger
                            value="weapons"
                            className="data-[state=active]:bg-red-700 data-[state=active]:text-white rounded-md py-2"
                          >
                            <Sword className="mr-2 h-4 w-4" />
                            Vũ Khí
                          </TabsTrigger>
                          <TabsTrigger
                            value="armor"
                            className="data-[state=active]:bg-red-700 data-[state=active]:text-white rounded-md py-2"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Áo Giáp
                          </TabsTrigger>
                          <TabsTrigger
                            value="consumables"
                            className="data-[state=active]:bg-red-700 data-[state=active]:text-white rounded-md py-2"
                          >
                            <Package className="mr-2 h-4 w-4" />
                            Tiêu Hao
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent
                          value="weapons"
                          className="space-y-4 max-h-64 overflow-y-auto pr-2"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {inventoryItems
                              .filter((item) => item.category === "Weapon")
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all transform hover:translate-y-[-2px] hover:shadow-md ${
                                    selectedItems.includes(item.id)
                                      ? "border-2 border-red-700 bg-red-50 shadow-md"
                                      : "hover:border-red-500"
                                  }`}
                                  onClick={() => toggleItemSelection(item.id)}
                                  onMouseEnter={() => setItemHover(item.id)}
                                  onMouseLeave={() => setItemHover(null)}
                                >
                                  <div className="flex gap-3 p-3">
                                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                      <img
                                        src={
                                          item.image ||
                                          "/mock-images/image2.png"
                                        }
                                        alt={item.name}
                                        className={`h-full w-full object-cover transition-transform duration-300 ${
                                          itemHover === item.id
                                            ? "scale-110"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <div className="flex items-center">
                                        <h4 className="font-medium text-red-900">
                                          {item.name}
                                        </h4>
                                        <Badge
                                          className={`ml-2 text-xs ${
                                            getRarityColor(item).classes
                                          }`}
                                        >
                                          {getRarityColor(item).rarity}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                        {item.description}
                                      </p>
                                      {selectedItems.includes(item.id) && (
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
                        </TabsContent>
                        <TabsContent
                          value="armor"
                          className="space-y-4 max-h-64 overflow-y-auto pr-2"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {inventoryItems
                              .filter((item) => item.category === "Armor")
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all transform hover:translate-y-[-2px] hover:shadow-md ${
                                    selectedItems.includes(item.id)
                                      ? "border-2 border-red-700 bg-red-50 shadow-md"
                                      : "hover:border-red-500"
                                  }`}
                                  onClick={() => toggleItemSelection(item.id)}
                                  onMouseEnter={() => setItemHover(item.id)}
                                  onMouseLeave={() => setItemHover(null)}
                                >
                                  <div className="flex gap-3 p-3">
                                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                      <img
                                        src={
                                          item.image ||
                                          "/mock-images/image2.png"
                                        }
                                        alt={item.name}
                                        className={`h-full w-full object-cover transition-transform duration-300 ${
                                          itemHover === item.id
                                            ? "scale-110"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <div className="flex items-center">
                                        <h4 className="font-medium text-red-900">
                                          {item.name}
                                        </h4>
                                        <Badge
                                          className={`ml-2 text-xs ${
                                            getRarityColor(item).classes
                                          }`}
                                        >
                                          {getRarityColor(item).rarity}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                        {item.description}
                                      </p>
                                      {selectedItems.includes(item.id) && (
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
                        </TabsContent>
                        <TabsContent
                          value="consumables"
                          className="space-y-4 max-h-64 overflow-y-auto pr-2"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {inventoryItems
                              .filter((item) => item.category === "Consumable")
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className={`border rounded-lg overflow-hidden cursor-pointer transition-all transform hover:translate-y-[-2px] hover:shadow-md ${
                                    selectedItems.includes(item.id)
                                      ? "border-2 border-red-700 bg-red-50 shadow-md"
                                      : "hover:border-red-500"
                                  }`}
                                  onClick={() => toggleItemSelection(item.id)}
                                  onMouseEnter={() => setItemHover(item.id)}
                                  onMouseLeave={() => setItemHover(null)}
                                >
                                  <div className="flex gap-3 p-3">
                                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                                      <img
                                        src={
                                          item.image ||
                                          "/mock-images/image2.png"
                                        }
                                        alt={item.name}
                                        className={`h-full w-full object-cover transition-transform duration-300 ${
                                          itemHover === item.id
                                            ? "scale-110"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                    <div>
                                      <div className="flex items-center">
                                        <h4 className="font-medium text-red-900">
                                          {item.name}
                                        </h4>
                                        <Badge
                                          className={`ml-2 text-xs ${
                                            getRarityColor(item).classes
                                          }`}
                                        >
                                          {getRarityColor(item).rarity}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                                        {item.description}
                                      </p>
                                      {selectedItems.includes(item.id) && (
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
                        </TabsContent>
                      </Tabs>

                      <div className="px-6 pb-4">
                        <h4 className="font-medium mb-3 text-red-900 flex items-center">
                          <Package className="mr-2 h-4 w-4" />
                          Vật Phẩm Đã Chọn ({selectedItems.length})
                        </h4>
                        {selectedItems.length === 0 ? (
                          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md text-center">
                            Chưa chọn vật phẩm nào
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 bg-red-50 p-4 rounded-md">
                            {selectedItems.map((itemId) => {
                              const item = inventoryItems.find(
                                (i) => i.id === itemId
                              );
                              return item ? (
                                <div
                                  key={item.id}
                                  className="bg-white border border-red-200 text-red-900 px-3 py-1.5 rounded-full text-sm flex items-center gap-1 shadow-sm"
                                >
                                  <span className="w-2 h-2 rounded-full bg-red-700"></span>
                                  {item.name}
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>

                      <DialogFooter className="px-6 pb-6 pt-2">
                        <Button
                          onClick={handleSubmitTrade}
                          disabled={selectedItems.length === 0}
                          className={`w-full ${
                            selectedItems.length === 0
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900"
                          } py-6 text-lg shadow-md transition-all`}
                        >
                          {selectedItems.length === 0
                            ? "Chọn ít nhất một vật phẩm"
                            : `Gửi Đề Nghị Giao Dịch (${selectedItems.length} vật phẩm)`}
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

      {/* <div className="mb-8">
        <Card className="shadow-lg border-none overflow-hidden">
          <CardHeader className=" text-white">
            <CardTitle className="text-lg">Gợi Ý Vật Phẩm Tương Tự</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {tradeItems
                .filter(
                  (item) =>
                    item.id !== tradeItem.id &&
                    item.category === tradeItem.category
                )
                .slice(0, 4)
                .map((item) => (
                  <Link href={`/${item.id}`} key={item.id}>
                    <div className="border rounded-md overflow-hidden hover:shadow-md transition-all hover:border-red-300 cursor-pointer">
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={item.image || "/mock-images/image2.png"}
                          alt={item.name}
                          className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={getRarityColor(item).classes}>
                            {getRarityColor(item).rarity}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-red-900 text-sm">
                          {item.name}
                        </h4>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Star className="h-3 w-3 fill-yellow-500 stroke-yellow-500 mr-1" />
                          <span>{item.trades} giao dịch</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
const tradeItems = [
  {
    id: "1",
    name: "Enchanted Sword",
    description:
      "A powerful sword with magical properties. Deals extra damage against undead enemies.",
    category: "Weapon",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "DragonSlayer",
    trades: 5,
  },
  {
    id: "2",
    name: "Plate Armor",
    description:
      "Heavy armor that provides excellent protection against physical attacks.",
    category: "Armor",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "KnightOfTheRealm",
    trades: 3,
  },
  {
    id: "3",
    name: "Health Potion",
    description: "Restores 50 health points when consumed. Tastes like cherry.",
    category: "Consumable",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "AlchemistSupreme",
    trades: 12,
  },
  {
    id: "4",
    name: "Fire Staff",
    description:
      "A staff that can cast powerful fire spells. Be careful not to burn yourself.",
    category: "Weapon",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "WizardOfTheFlame",
    trades: 7,
  },
  {
    id: "5",
    name: "Leather Boots",
    description: "Light boots that increase movement speed and stealth.",
    category: "Armor",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "ShadowWalker",
    trades: 2,
  },
  {
    id: "6",
    name: "Mana Crystal",
    description:
      "Restores 30 mana points when consumed. Glows with a blue light.",
    category: "Consumable",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "MysticMage",
    trades: 8,
  },
  {
    id: "7",
    name: "Bow of Accuracy",
    description: "A finely crafted bow that increases accuracy and range.",
    category: "Weapon",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "ForestHunter",
    trades: 4,
  },
  {
    id: "8",
    name: "Shield of Protection",
    description:
      "A sturdy shield that provides protection against all types of damage.",
    category: "Armor",
    image: "/mock-images/image2.png?height=300&width=300",
    owner: "GuardianOfLight",
    trades: 6,
  },
];

const inventoryItems = [
  {
    id: "inv1",
    name: "Dagger of Stealth",
    description: "A small but deadly dagger that grants stealth bonuses.",
    category: "Weapon",
    image: "/mock-images/image2.png?height=300&width=300",
  },
  {
    id: "inv2",
    name: "Chainmail Armor",
    description: "Flexible armor made of interlocking metal rings.",
    category: "Armor",
    image: "/mock-images/image2.png?height=300&width=300",
  },
  {
    id: "inv3",
    name: "Strength Potion",
    description: "Temporarily increases strength by 10 points.",
    category: "Consumable",
    image: "/mock-images/image2.png?height=300&width=300",
  },
  {
    id: "inv4",
    name: "Warhammer",
    description:
      "A heavy hammer that deals massive damage to armored opponents.",
    category: "Weapon",
    image: "/mock-images/image2.png?height=300&width=300",
  },
  {
    id: "inv5",
    name: "Helmet of Vision",
    description:
      "Enhances vision in dark places and protects against critical hits.",
    category: "Armor",
    image: "/mock-images/image2.png?height=300&width=300",
  },
  {
    id: "inv6",
    name: "Invisibility Potion",
    description: "Makes the user invisible for 30 seconds.",
    category: "Consumable",
    image: "/mock-images/image2.png?height=300&width=300",
  },
  {
    id: "inv7",
    name: "Crossbow",
    description: "A powerful ranged weapon with high accuracy.",
    category: "Weapon",
    image: "/mock-images/image2.png?height=300&width=300",
  },
  {
    id: "inv8",
    name: "Gauntlets of Power",
    description: "Increases melee damage and provides protection for hands.",
    category: "Armor",
    image: "/mock-images/image2.png?height=300&width=300",
  },
];
