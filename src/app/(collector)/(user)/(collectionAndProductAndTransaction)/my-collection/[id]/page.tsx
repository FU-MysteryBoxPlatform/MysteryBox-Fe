"use client";
import { useGetCollectionProgressById } from "@/hooks/api/useCollection";
import { useGetCollectionById } from "@/hooks/api/useManageCollection";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { id } = useParams();
  const { data, refetch: refetchProgress } = useGetCollectionProgressById(
    id as string
  );

  const collectionProgress = data?.result.userCollectionProgress;
  const ownedProductIds = data?.result.products.map((item) => item.productId);
  const { data: collectionData, refetch: refetchCollection } =
    useGetCollectionById(collectionProgress?.collectionId as string);
  const collectionProducts = collectionData?.result.products;

  useEffect(() => {
    refetchProgress();
  }, [refetchProgress, id]);

  useEffect(() => {
    refetchCollection();
  }, [refetchCollection, collectionProgress?.collectionId]);

  return (
    <div className="flex-1">
      <p className="text-lg md:text-xl font-bold mb-4 md:mb-6">
        Bộ sưu tập{" "}
        <span className="text-[#E12E43]">
          {collectionProgress?.collection.collectionName}
        </span>
      </p>
      <p className="font-semibold mb-4">
        Bạn đã sưu tập được{" "}
        <span className="text-[#E12E43]">
          {ownedProductIds?.length}/{collectionProducts?.length}
        </span>{" "}
        vật phẩm trong bộ sưu tập này
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 w-full">
        {collectionProducts?.map((item) => {
          const isOwned = ownedProductIds?.includes(item.productId);

          return (
            <div
              key={item.productId}
              className={cn(
                "relative flex flex-col items-center gap-2 border rounded-lg p-4 cursor-pointer",
                !isOwned
                  ? "opacity-50 border-red-300"
                  : "border-green-400 hover:bg-green-100"
              )}
            >
              <Image
                src={item.imagePath}
                alt="thumb"
                width={120}
                height={120}
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="text-sm font-semibold">{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PRODUCTS_IN_COLLECTION = [
  {
    id: 1,
    thumbImg: "/mock-images/image1.png",
    name: "Levi Ackerman",
    isOwned: true,
  },
  {
    id: 2,
    thumbImg: "/mock-images/image2.png",
    name: "Eren Yeager",
    isOwned: false,
  },
  {
    id: 3,
    thumbImg: "/mock-images/image3.png",
    name: "Mikasa Ackerman",
    isOwned: true,
  },
  {
    id: 4,
    thumbImg: "/mock-images/image4.png",
    name: "Reiner",
    isOwned: false,
  },
  {
    id: 5,
    thumbImg: "/mock-images/image5.png",
    name: "Cony",
    isOwned: false,
  },
  {
    id: 6,
    thumbImg: "/mock-images/image1.png",
    name: "Annie",
    isOwned: true,
  },
];
