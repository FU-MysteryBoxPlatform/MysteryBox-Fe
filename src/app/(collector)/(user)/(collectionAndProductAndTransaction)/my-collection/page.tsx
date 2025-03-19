"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import {
  TCollection,
  useGetCollections,
} from "@/hooks/api/useManageCollection";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [collections, setCollections] = useState<TCollection[]>([]);
  const { mutate: mutateGetCollections, isPending } = useGetCollections();

  useEffect(() => {
    mutateGetCollections(
      {
        pageNumber: page,
        pageSize: 12,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setCollections(data.result.items || []);
            setTotalPages(data.result.totalPages || 0);
          }
        },
      }
    );
  }, [mutateGetCollections, page]);

  console.log({ collections });

  if (isPending)
    return (
      <div className="w-full flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );

  return (
    <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full">
      <p className="text-lg md:text-xl font-bold mb-4 md:mb-6">
        Bộ sưu tập của tôi
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {collections.map((item) => {
          return (
            <div
              key={item.collection.collectionId}
              className={cn(
                "flex flex-col items-center gap-2 border border-gray-300 rounded-lg p-4 hover:bg-gray-100",
                item.userCollectionProgress?.userCollecitonProgressId &&
                  "cursor-pointer"
              )}
              onClick={() => {
                if (item.userCollectionProgress?.userCollecitonProgressId) {
                  router.push(
                    `/my-collection/${item.userCollectionProgress.userCollecitonProgressId}`
                  );
                }
              }}
            >
              <Image
                src={item.collection.imagePath}
                alt="thumb"
                width={120}
                height={120}
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="text-sm font-semibold">
                {item.collection.collectionName}
              </p>
            </div>
          );
        })}
      </div>
      {collections.length > 0 && (
        <Paginator
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(pageNumber) => {
            setPage(pageNumber);
          }}
          showPreviousNext
        />
      )}
    </div>
  );
}
