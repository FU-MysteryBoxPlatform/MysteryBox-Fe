"use client";
import { useGetCollectionProgressById } from "@/hooks/api/useCollection";
import { useGetCollectionById } from "@/hooks/api/useManageCollection";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { id } = useParams();
  const { data: progressData, refetch: refetchProgress } =
    useGetCollectionProgressById(id as string);
  const { data: collectionData, refetch: refetchCollection } =
    useGetCollectionById(
      progressData?.result.userCollectionProgress?.collectionId as string
    );

  const collectionProgress = progressData?.result.userCollectionProgress;
  const ownedProductIds = progressData?.result.products.map(
    (item) => item.productId
  );
  const collectionProducts = collectionData?.result.products;

  useEffect(() => {
    refetchProgress();
  }, [refetchProgress, id]);

  useEffect(() => {
    if (collectionProgress?.collectionId) refetchCollection();
  }, [refetchCollection, collectionProgress?.collectionId]);

  if (!collectionProgress || !collectionProducts) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Bộ Sưu Tập{" "}
        <span className="text-emerald-600">
          {collectionProgress.collection.collectionName}
        </span>
      </h1>
      <p className="text-lg font-semibold text-gray-700 mb-8">
        Bạn đã sưu tập được{" "}
        <span className="text-emerald-600">
          {ownedProductIds?.length || 0}/{collectionProducts.length}
        </span>{" "}
        vật phẩm
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collectionProducts.map((item) => {
          const isOwned = ownedProductIds?.includes(item.productId);

          return (
            <div
              key={item.productId}
              className={cn(
                "relative flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm transition-all",
                isOwned
                  ? "border-emerald-300 hover:shadow-md hover:bg-emerald-50"
                  : "opacity-60 border-gray-300"
              )}
            >
              <div className="relative w-full h-48 rounded-lg overflow-hidden">
                <Image
                  src={item.imagePath || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                <div
                  className={cn(
                    "absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold text-white",
                    isOwned ? "bg-emerald-600" : "bg-gray-500"
                  )}
                >
                  {isOwned ? "Đã sở hữu" : "Chưa sở hữu"}
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900 text-center line-clamp-1">
                {item.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
