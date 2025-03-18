"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Inventory, useGetAllInventory } from "@/hooks/api/useInventory";
import { cn } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const { user } = useContext(GlobalContext);
  const router = useRouter();
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);

  const { mutate: mutateGetAllInventory } = useGetAllInventory();

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
              console.log({ data });

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
    <div>
      <p className="text-xl md:text-2xl lg:text-3xl font-bold mb-6">
        Đăng ký và đấu thầu
      </p>
      <div>
        <div className="max-h-[500px] overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inventories?.length > 0 &&
              inventories?.map((item) => (
                <div
                  key={item.inventoryId}
                  className={cn(
                    "border rounded-lg overflow-hidden cursor-pointer transition-all transform hover:translate-y-[-2px] hover:shadow-md hover:border-red-500"
                  )}
                  onClick={() =>
                    router.push(
                      `/auctions/register-and-bid/${item.inventoryId}`
                    )
                  }
                >
                  <div className="flex gap-3 p-3">
                    <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          item.product?.imagePath || "/mock-images/image2.png"
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
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                        {item.product?.description}
                      </p>
                      <Button className="bg-[#E12E43] text-white mt-2 hover:bg-[#E12E43] hover:text-white h-6">
                        Đăng ký
                      </Button>
                    </div>
                    <div className="flex items-center">
                      <Badge
                        className={`ml-2 text-xs ${
                          getRarityColor(item.inventoryId).classes
                        }`}
                      >
                        {getRarityColor(item.inventoryId).rarity}
                      </Badge>
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
      </div>
    </div>
  );
}
