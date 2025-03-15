"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import {
  TCollectionProgressDetail,
  useGetUserCollection,
} from "@/hooks/api/useCollection";
import { GlobalContext } from "@/provider/global-provider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { user } = useContext(GlobalContext);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [collections, setCollections] = useState<TCollectionProgressDetail[]>(
    []
  );
  const { data, isLoading, refetch } = useGetUserCollection(
    user?.id as string,
    page,
    12
  );

  useEffect(() => {
    refetch();
  }, [refetch, page]);

  useEffect(() => {
    setCollections(data?.result.items || []);
    setTotalPages(data?.result.totalPages || 0);
  }, [data]);

  console.log({ collections });

  if (isLoading)
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
              key={item.userCollectionProgress.userCollecitonProgressId}
              className="flex flex-col items-center gap-2 border border-gray-300 rounded-lg p-4 hover:bg-gray-100 cursor-pointer"
              onClick={() =>
                router.push(
                  `/my-collection/${item.userCollectionProgress.userCollecitonProgressId}`
                )
              }
            >
              <Image
                src={item.userCollectionProgress?.collection.imagePath}
                alt="thumb"
                width={120}
                height={120}
                className="w-full h-40 object-cover rounded-lg"
              />
              <p className="text-sm font-semibold">
                {item.userCollectionProgress?.collection.collectionName}
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
            refetch();
          }}
          showPreviousNext
        />
      )}
    </div>
  );
}
