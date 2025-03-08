"use client";
import AuctionCard from "@/app/components/AuctionCard";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { useGetAllAuctions } from "@/hooks/api/useAuction";
import { Auction } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const [auctionData, setAuctionData] = useState<Auction[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const { mutateAsync: mutateAuction, isPending } = useGetAllAuctions();

  useEffect(() => {
    mutateAuction(
      {
        pageNumber: pageNumber,
        pageSize: 6,
        status: 0,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            console.log("ehehe",data)
            setAuctionData(data.result.items);
            setTotalPages(data.result.totalPages);
          }
        },
      }
    );
  }, [pageNumber]);

  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4">
        {auctionData.map((product) => (
          <div
            key={product.auctionId}
            className="cursor-pointer"
          >
            <AuctionCard auction={product} />
          </div>
        ))}
      </div>
      {isPending && (
        <div className="w-full h-full flex items-center justify-center">
          <LoadingIndicator />
        </div>
      )}
      {pageNumber < totalPages && (
        <Button
          className="bg-[#E12E43] text-white hover:bg-[#B71C32] mt-6 ml-auto"
          onClick={() => setPageNumber((pageNumber) => pageNumber + 1)}
        >
          Xem thêm
        </Button>
      )}
    </div>
  );
}
