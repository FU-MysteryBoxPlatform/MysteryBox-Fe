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
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Trạng thái loading khi bấm "Xem thêm"
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const { mutateAsync: mutateAuction, isPending } = useGetAllAuctions();

  const fetchAuctions = async (page: number, append = false) => {
    setIsLoadingMore(true); // Bật loading khi fetch thêm dữ liệu
    try {
      // Lấy dữ liệu với status 0
      const responseStatus0 = await mutateAuction({
        pageNumber: page,
        pageSize: 6,
        status: 0,
      });

      // Lấy dữ liệu với status 1
      const responseStatus1 = await mutateAuction({
        pageNumber: page,
        pageSize: 6,
        status: 1,
      });

      // Gộp dữ liệu từ cả hai status
      const combinedItems = [
        ...(responseStatus0?.isSuccess ? responseStatus0.result.items : []),
        ...(responseStatus1?.isSuccess ? responseStatus1.result.items : []),
      ];

      // Loại bỏ trùng lặp dựa trên auctionId
      const uniqueItems = combinedItems.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.auctionId === item.auctionId)
      );

      // Cập nhật state
      if (append) {
        setAuctionData((prevData) => [...prevData, ...uniqueItems]); // Append dữ liệu mới
      } else {
        setAuctionData(uniqueItems); // Ghi đè dữ liệu (dùng cho lần đầu hoặc refresh)
      }

      // Cập nhật totalPages
      setTotalPages(
        Math.max(
          responseStatus0?.result?.totalPages || 0,
          responseStatus1?.result?.totalPages || 0
        )
      );
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setIsLoadingMore(false); // Tắt loading sau khi hoàn tất
    }
  };

  // Fetch lần đầu hoặc khi SignalR yêu cầu refresh
  const refetch = () => fetchAuctions(pageNumber, false);

  // Xử lý khi bấm "Xem thêm"
  const loadMore = () => {
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);
    fetchAuctions(nextPage, true); // Append dữ liệu
  };

  // Fetch dữ liệu lần đầu
  useEffect(() => {
    fetchAuctions(1, false); // Load trang đầu tiên
  }, []);

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

  // Kết nối SignalR và listen event
  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      try {
        await connection.start();
        connection.on("LOAD_NEW_BID", refetch); // Refresh toàn bộ dữ liệu khi có bid mới
      } catch (error) {
        console.error("SignalR Connection Error:", error);
      }
    };

    startConnection();
  }, [connection]);

  return (
    <div className="">
      <div className="grid md:grid-cols-2 xl:grid-cols-3 grid-cols-1 md:gap-4">
        {auctionData.map((product) => (
          <div key={product.auctionId} className="cursor-pointer">
            <AuctionCard auction={product} />
          </div>
        ))}
      </div>

      {/* Loading lần đầu */}
      {isPending && auctionData.length === 0 && (
        <div className="w-full h-full flex items-center justify-center">
          <LoadingIndicator />
        </div>
      )}

      {/* Loading khi bấm "Xem thêm" */}
      {isLoadingMore && (
        <div className="w-full flex items-center justify-center mt-4">
          <LoadingIndicator />
        </div>
      )}

      {/* Nút "Xem thêm" */}
      {pageNumber < totalPages && (
        <Button
          className="bg-[#E12E43] text-white hover:bg-[#B71C32] mt-6 ml-auto block"
          onClick={loadMore}
          disabled={isLoadingMore} // Disable nút khi đang load
        >
          Xem thêm
        </Button>
      )}
    </div>
  );
}
