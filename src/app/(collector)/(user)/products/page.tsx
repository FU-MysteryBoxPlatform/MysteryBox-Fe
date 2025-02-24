"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCollections } from "@/hooks/api/useManageCollection";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  interface CollectionItem {
    collectionId: string;
    collectionName: string;
    description: string;
    startTime: string;
    totalItem: number;
    isActived: boolean;
    rewards: string;
    imagePath: string;
    endTime: string;
    blindBoxPrice: number;
    discountBlindBoxPrice: number;
  }


  const [items, setItems] = useState<CollectionItem[]>([]);
  const getData = useGetCollections();
  const route = useRouter();
  const fetchData = async () => {
    const data = await getData.mutateAsync({
      pageNumber: 1,
      pageSize: 10,
    });
    setItems(data.result.items);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 lg:px-16">
        <div className="flex gap-10 py-10 max-md:flex-col">
          <div className="md:min-w-[180px] lg:min-w-[250px]">
            <p className="text-xl font-semibold mb-6">Bộ lọc</p>
            <div>
              <div>
                <p className="text-base font-semibold">Danh mục</p>
              </div>
            </div>
          </div>
          <div className="">
            {getData.isPending ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10 flex-1">
                {PRODUCTS.map((product) => (
                  <div key={product.id} className="flex flex-col items-center">
                    <Skeleton className="w-full h-[100px] mb-2" />
                    <Skeleton className="w-1/2 mx-auto h-4" />
                  </div>
                ))}
              </div>
            ) : (
              <>
              <h1 className="text-center text-red-600 text-3xl my-2 font-bold uppercase font-sans">Túi mù tại MYBOX</h1>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-10 flex-1">
                  {items.map((item) => (
                    <div
                      key={item.collectionId}
                      className="bg-white rounded-lg shadow-md flex flex-col items-center overflow-hidden"
                      onClick={() => route.push(`/products/${item.collectionId}`)}
                    >
                      <div className="relative h-64">
                        <img
                          src={item.imagePath || "/placeholder.svg"}
                          alt={item.collectionName}
                        />
                      </div>
                      <div className="p-6">
                        <h2 className="text-xl font-semibold mb-2">
                          {item.collectionName}
                        </h2>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            Còn lại:
                          </span>
                          <span className="text-sm font-bold text-red-500">{item.totalItem}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                           Ngày bắt đầu bán:
                          </span>
                          <span className="text-sm">
                            {formatDate(item.startTime)}
                          </span>
                        </div>
                        {item.endTime !== "0001-01-01T00:00:00" && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                            Ngày đóng bán:
                            </span>
                            <span className="text-sm">
                              {formatDate(item.endTime)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                          Giá túi mù:
                          </span>
                          <span className="text-sm">
                            {formatPriceVND(item.blindBoxPrice ?? 0)}
                          </span>
                        </div>
                        {item.discountBlindBoxPrice > 0 && (
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                           Giá giảm:
                            </span>
                            <span className="text-sm text-green-600">
                              {formatPriceVND(item.discountBlindBoxPrice ?? 0)}
                            </span>
                          </div>
                        )}
                        <div className="mt-4">
                          <h3 className="text-sm font-semibold mb-1">
                            Phần thưởng khi sưu tập đủ bộ sưu tập:
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.rewards}
                          </p>
                        </div>
                        <div className="mt-4">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded ${
                              item.isActived
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.isActived ? "Đang mở bán" : "Đóng"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const PRODUCTS = [
  {
    id: 1,
  },
  {
    id: 2,
  },
  {
    id: 3,
  },
  {
    id: 4,
  },
  {
    id: 5,
  },
  {
    id: 6,
  },
  {
    id: 7,
  },
  {
    id: 8,
  },
];
