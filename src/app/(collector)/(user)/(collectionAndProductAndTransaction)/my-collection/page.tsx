"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import {
  TCollectionWithProgress,
  useGetCollections,
} from "@/hooks/api/useManageCollection";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [collections, setCollections] = useState<TCollectionWithProgress[]>([]);
  const { mutate: mutateGetCollections, isPending } = useGetCollections();
  const { user } = useContext(GlobalContext);
  useEffect(() => {
    if (user) {
      mutateGetCollections(
        {
          accountId: user.id,
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
    }
  }, [mutateGetCollections, page]);

  if (isPending) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        BỘ SƯU TẬP CỦA TÔI
      </h1>
      {collections.length === 0 ? (
        <div className="text-center py-12 text-gray-600">
          Bạn chưa sở hữu bộ sưu tập nào.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {collections.map((item) => (
              <div
                key={item.collection.collectionId}
                className={cn(
                  "flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                )}
                onClick={() => {
                  if (item.userCollectionProgress?.userCollecitonProgressId) {
                    router.push(
                      `/my-collection/${item.userCollectionProgress.userCollecitonProgressId}`
                    );
                  } else {
                    toast({
                      title:
                        "Bạn chưa sở hữu vật phẩm nào trong bộ sưu tập này!",
                      variant: "destructive",
                    });
                  }
                }}
              >
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={item.collection.imagePath || "/placeholder.svg"}
                    alt={item.collection.collectionName}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <p className="text-lg font-semibold text-gray-900 text-center line-clamp-1">
                  {item.collection.collectionName}
                </p>
              </div>
            ))}
          </div>
          {collections.length > 0 && (
            <div className="mt-8 flex justify-center">
              <Paginator
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(pageNumber) => setPage(pageNumber)}
                showPreviousNext
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
