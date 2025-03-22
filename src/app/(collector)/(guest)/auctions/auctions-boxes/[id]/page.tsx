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
import * as signalR from "@microsoft/signalr";

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
  const { data: bidList, refetch: refetchList } = useGetAllBidByAuctionId(id);
  const { mutateAsync: createBid, isPending: isCreatePending } = useCreateBid();
  const { user } = useContext(GlobalContext);
  const [amount, setAmount] = useState("");
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  // Format số tiền khi người dùng nhập
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Chỉ lấy số
    setAmount(value);
  };

  // Kiểm tra và đặt giá đấu
  const handleConfirm = async () => {
    if (!auction?.result.auction.auctionId) return;

    const numericAmount = Number(amount);
    if (numericAmount <= auction?.result.auction.currentBid) {
      toast({
        title: "Lỗi",
        description: "Giá đấu phải lớn hơn giá hiện tại",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await createBid({
        auctionId: auction.result.auction.auctionId,
        bidAmount: numericAmount,
        accountId: user?.id ?? "",
      });

      if (response.isSuccess) {
        toast({
          title: "Thành công",
          description: "Đấu giá thành công",
        });
        setAmount("");
        await fetchData();
      } else {
        toast({
          description: response.messages[0],
          title: "Đấu giá thất bại",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi đặt giá",
        variant: "destructive",
      });
    }
  };

  const fetchData = async () => {
    await Promise.all([refetchDataAuction(), refetchList()]);
  };

  // Thiết lập SignalR
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
        connection.on("LOAD_NEW_BID", fetchData);
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    };

    startConnection();
  }, [connection]);

  if (isPending) return <LoadingIndicator />;

  // Lấy người chiến thắng hiện tại
  const currentWinner = bidList?.result?.items?.[0];

  return (
    <div className="container mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <img
            src={auction?.result?.auction.inventory.product.imagePath}
            alt={auction?.result?.auction.inventory.product.name}
            className="object-cover rounded-lg max-h-[400px] w-full"
          />
        </div>

        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {auction?.result?.auction.inventory.product.name}
          </h1>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Giá khởi điểm</p>
                  <p className="font-bold">
                    {formatPriceVND(
                      Number(auction?.result?.auction.minimunBid)
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giá hiện tại</p>
                  <p className="font-bold text-red-600">
                    {formatPriceVND(
                      Number(auction?.result?.auction.currentBid)
                    )}
                  </p>
                </div>
              </div>

              {/* Hiển thị người chiến thắng hiện tại */}
              {currentWinner && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500">
                    Người dẫn đầu hiện tại
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <img
                      src={currentWinner.createByAccount?.avatar ?? ""}
                      alt="winner avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <p className="font-semibold">
                      {currentWinner.createByAccount?.firstName}{" "}
                      {currentWinner.createByAccount?.lastName}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Input và Button đặt giá */}
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Nhập giá đấu (VD: 1000000)"
              value={amount ? Number(amount).toLocaleString("vi-VN") : ""}
              onChange={handleAmountChange}
              className="flex-1"
            />
            <Button
              onClick={handleConfirm}
              disabled={isCreatePending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isCreatePending ? <LoadingIndicator /> : "Đặt giá"}
            </Button>
          </div>

          {/* Lịch sử đấu giá */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Lịch sử đấu giá</h3>
                <span className="text-sm text-gray-500">
                  {bidList?.result?.items?.length ?? 0} lượt ra giá
                </span>
              </div>
              <div className="space-y-4 max-h-[200px] overflow-y-auto">
                {bidList?.result?.items?.map((bid) => (
                  <div
                    key={bid.auctionHistoryId}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={bid.createByAccount?.avatar ?? ""}
                        alt="bidder avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <p>{bid.createByAccount?.firstName}</p>
                    </div>
                    <p className="font-semibold">
                      {formatPriceVND(bid.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
