"use client";
import {
  TCollectionWithProgress,
  useGetCollections,
} from "@/hooks/api/useManageCollection";
import { formatPriceVND } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewProductsSection() {
  const [items, setItems] = useState<TCollectionWithProgress[]>([]);
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
    <div className="my-10 md:my-16">
      <>
        <h1 className="text-center text-red-600 text-3xl my-2 font-bold uppercase font-sans mb-10">
          Túi mù tại MYBOX
        </h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-10 flex-1">
          {items.map((item) => (
            <div
              key={item.collection.collectionId}
              className="bg-white rounded-lg shadow-md flex flex-col items-center overflow-hidden cursor-pointer"
              onClick={() =>
                route.push(`/products/${item.collection.collectionId}`)
              }
            >
              <img
                src={item.collection.imagePath || "/placeholder.svg"}
                alt={item.collection.collectionName}
                className="h-[150px] object-cover w-full"
              />

              <div className="p-4 w-full flex-1 flex flex-col">
                <h2 className="font-semibold mb-1">
                  {item.collection.collectionName}
                </h2>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Còn lại:</span>
                  <span className="text-sm font-bold text-red-500">
                    {item.collection.totalItem}
                  </span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Giá túi mù:</span>
                  <span className="text-sm">
                    {formatPriceVND(item.collection.blindBoxPrice ?? 0)}
                  </span>
                </div>
                {item.collection.discountBlindBoxPrice > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Giá giảm:</span>
                    <span className="text-sm text-green-600">
                      {formatPriceVND(
                        item.collection.discountBlindBoxPrice ?? 0
                      )}
                    </span>
                  </div>
                )}
                <div className="mt-auto">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      item.collection.isActived
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.collection.isActived ? "Đang mở bán" : "Đóng"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    </div>
  );
}
