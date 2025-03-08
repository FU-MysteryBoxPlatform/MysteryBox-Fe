"use client";

import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useCreateBid,
  useGetAllBidByAuctionId,
  useGetAuctionById,
} from "@/hooks/api/useAuction";
import { toast } from "@/hooks/use-toast";
import { formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr"; // Import SignalR

export default function Page() {
  const { id } = useParams();

  if (typeof id !== "string") {
    throw new Error("Invalid id");
  }
  const {
    data: auction,
    isPending,
    refetch: refetchDataAuction,
  } = useGetAuctionById(id);
  const {
    data: bidList,
    isPending: isCreatePending,
    refetch: refetchList,
  } = useGetAllBidByAuctionId(id);
  const { mutateAsync: createBid } = useCreateBid();
  //TODO: get box details here
  const [amount, setAmount] = useState<number>(
    auction?.result?.auction?.currentBid ?? 0
  );
  const { user } = useContext(GlobalContext);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  const handleConfirm = async () => {
    if (!auction?.result.auction.auctionId) return;
    if (amount < auction?.result.auction.currentBid) return;
    await createBid(
      {
        auctionId: auction?.result.auction.auctionId,
        bidAmount: amount,
        accountId: user?.id ?? "",
      },
      {
        onSuccess: (data) => {
          setAmount(0);
          if (data.isSuccess) {
            toast({
              title: "Thành công",
              description: "Đấu giá thành công",
            });
          } else {
            toast({
              description: data.messages[0],
              title: "Đấu giá thất bại",
            });
          }
        },
      }
    );
  };

  const fetchData = async () => {
    await refetchDataAuction();
    await refetchList();
  };
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_PUBLIC_DOMAIN}/notifications/`)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  useEffect(() => {
    let retryCount = 0;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 3000; // 3 seconds

    const startConnection = async () => {
      if (connection) {
        try {
          await connection.start();
          connection.on("LOAD_NEW_BID", async () => {
            await fetchData(); // Fetch new bids when a new bid is placed
          });
        } catch (error) {
          if (retryCount < MAX_RETRIES) {
            retryCount++;
            setTimeout(startConnection, RETRY_DELAY);
            console.log(error); // Retry connection
          } else {
            console.log("Max retries reached. Could not connect to SignalR.");
          }
        }
      }
    };
    startConnection();
  }, [connection]);

  if (isPending) return <LoadingIndicator />;

  return (
    <div>
      <div className="flex gap-6 max-md:flex-col">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={auction?.result?.auction.inventory.product.imagePath}
          alt="image"
          className="shrink-0 object-cover aspect-square max-h-[274px]"
        />
        <div className="flex-1 grid gap-6">
          <p className="text-xl md:text-2xl lg:text-3xl font-bold">
            Chi tiết sản phẩm
          </p>
          <Card className="w-full">
            <CardContent className="p-6 grid xl:grid-cols-2 gap-4">
              <div className="">
                <p className="text-lg lg:text-xl font-bold mb-1">Giá bắt đầu</p>
                <p className="font-bold mb-6">
                  {formatPriceVND(Number(auction?.result?.auction?.minimunBid))}
                </p>
                <div className="flex items-center">
                  {Array.from(
                    { length: bidList?.result?.items?.length ?? 0 },
                    (_, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full bg-gray-400 border border-[#C4C4C4] [&:not(:first-of-type)]:-ml-2"
                      />
                    )
                  )}
                </div>
              </div>
              <div className="">
                <p className="text-lg lg:text-xl font-bold mb-1">
                  Giá đấu thầu hiện tại
                </p>
                <p className="font-bold">
                  {formatPriceVND(Number(auction?.result?.auction.currentBid))}
                </p>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="grid grid-cols-2 gap-6 bg-black p-6 text-white">
              <div className="text-lg font-bold flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#E12E43] animate-ping"></div>
                Đấu thầu hiện tại
              </div>
              <div className="text-lg font-bold">
                {bidList?.result?.items?.length} ra giá
              </div>
            </div>
            <div className="border border-black p-6 grid gap-4">
              {bidList?.result?.items?.map((bid) => (
                <div
                  key={bid.auctionHistoryId}
                  className="grid grid-cols-2 gap-6"
                >
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={bid.createByAccount?.avatar ?? ""}
                      alt="image"
                      className="w-12 h-12 rounded-full"
                    />
                    <p className="text-lg font-bold">
                      {bid.createByAccount?.firstName}
                    </p>
                  </div>
                  <p>{formatPriceVND(bid.amount)}</p>
                </div>
              ))}
            </div>
          </div>

          <Input
            type="number"
            min={auction?.result?.auction.currentBid}
            placeholder="Nhập giá đấu"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <Button
            className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
            onClick={handleConfirm}
          >
            {isCreatePending ? <LoadingIndicator /> : "Đặt giá đấu thầu"}
          </Button>
        </div>
      </div>
    </div>
  );
}
