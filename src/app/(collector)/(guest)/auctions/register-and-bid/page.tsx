"use client";

import { useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Inventory, useGetAllInventory } from "@/hooks/api/useInventory";
import { cn } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";

interface RarityInfo {
  rarity: string;
  classes: string;
}

const ITEMS_PER_PAGE = 10;

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

  return {
    rarity,
    classes: rarityMap[rarity],
  };
};

const InventoryCard = ({ item }: { item: Inventory }) => {
  const router = useRouter();
  const { rarity, classes } = getRarityColor(item.itemStatus.id);

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden cursor-pointer",
        "transition-all transform hover:-translate-y-0.5 hover:shadow-md",
        "hover:border-red-500 bg-white"
      )}
      onClick={() =>
        router.push(`/auctions/register-and-bid/${item.inventoryId}`)
      }
    >
      <div className="flex gap-4 p-4">
        <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={item.product?.imagePath || "/mock-images/image2.png"}
            alt={item.product?.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between ">
            <h4 className="font-semibold text-red-900 truncate">
              {item.product?.name}
            </h4>
            <Badge className={cn("text-xs mx-4", classes)}>{rarity}</Badge>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2 mt-1">
            {item.product?.description}
          </p>
          <Button className="mt-2 h-8 bg-[#E12E43] hover:bg-[#c6283a] text-white text-sm">
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function InventoryPage() {
  const { user } = useContext(GlobalContext);
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const { mutate: fetchInventories } = useGetAllInventory();

  const loadInventories = useCallback(() => {
    if (!user?.id) return;

    fetchInventories(
      {
        accountId: user.id,
        pageNumber: page,
        pageSize: ITEMS_PER_PAGE,
      },
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
        onError: (error) => {
          console.error("Failed to load inventories:", error);
        },
      }
    );
  }, [fetchInventories, page, user?.id]);

  useEffect(() => {
    loadInventories();
  }, [loadInventories]);

  const handleLoadMore = () => setPage((prev) => prev + 1);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Đăng ký và đấu thầu
      </h1>

      <div className="space-y-6">
        <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
          {inventories.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Không có vật phẩm nào để hiển thị
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2  gap-4">
              {inventories.map((item) => (
                <InventoryCard key={item.inventoryId} item={item} />
              ))}
            </div>
          )}
        </div>

        {page < totalPages && (
          <div className="text-center">
            <Button
              variant="outline"
              className="mt-4 text-gray-700 border-gray-300 hover:bg-gray-50"
              onClick={handleLoadMore}
            >
              Tải thêm
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
