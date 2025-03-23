"use client";
import AuctionCard from "@/app/components/AuctionCard";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { useGetAllAuctions } from "@/hooks/api/useAuction";
import { Auction } from "@/types";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";

export default function Page() {
  const [auctionData, setAuctionData] = useState<Auction[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const { mutateAsync: mutateAuction, isPending } = useGetAllAuctions();

  const refetch = async () => {
    mutateAuction(
      {
        pageNumber: pageNumber,
        pageSize: 6,
        status: 1,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            console.log("ehehe", data);
            setAuctionData(data.result.items);
            setTotalPages(data.result.totalPages);
          }
        },
      }
    );
  };
  useEffect(() => {
    refetch();
  }, [pageNumber]);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_DOMAIN}/notifications/`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        await connection.start();
        connection.on("LOAD_NEW_BID", refetch);
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    };

    startConnection();
  }, [connection]);
  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4">
        {auctionData.map((product) => (
          <div key={product.auctionId} className="cursor-pointer">
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
