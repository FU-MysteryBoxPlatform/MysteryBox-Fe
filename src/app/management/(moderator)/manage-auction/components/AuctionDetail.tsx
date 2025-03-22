import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAuctionById } from "@/hooks/api/useAuction";
import { cn, formatPriceVND } from "@/lib/utils";
import dayjs from "dayjs";
import { useEffect } from "react";

export default function AuctionDetail({ auctionId }: { auctionId?: string }) {
  const {
    data,
    isLoading,
    refetch: refetchDataAuction,
  } = useGetAuctionById(auctionId || "");

  const auctionDetail = data?.result?.auction;
  const participants = data?.result?.auctionParticipantRequests;

  useEffect(() => {
    refetchDataAuction();
  }, [auctionId]);

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <CardTitle>Thông tin</CardTitle>
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="grid gap-1">
                <p>Giá bắt đầu:</p>
                <p>Giá hiện tại:</p>
                <p>Ngày bắt đầu:</p>
                <p>Ngày kết thúc:</p>
              </div>
              <div className="grid gap-1 font-bold">
                <p>{formatPriceVND(auctionDetail?.minimunBid || 0)}</p>
                <p>{formatPriceVND(auctionDetail?.currentBid || 0)}</p>
                <p>
                  {dayjs(auctionDetail?.startTime).format("DD/MM/YYYY HH:mm")}
                </p>
                <p>
                  {dayjs(auctionDetail?.endTime).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <CardTitle>Thông tin sản phẩm</CardTitle>
            <div className="flex gap-4 mt-4 [&>div]:flex-1">
              <img
                src={auctionDetail?.inventory?.product?.imagePath}
                alt=""
                className="h-20 w-20 object-cover"
              />

              <div className="grid gap-1 h-fit">
                <p className="font-bold">
                  {auctionDetail?.inventory?.product?.name}
                </p>
                <p className="text-sm text-gray-400">
                  {auctionDetail?.inventory?.product?.description}
                </p>
                <p className="text-sm ">
                  {formatPriceVND(
                    auctionDetail?.inventory?.product?.price || 0
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <p className="mb-2 font-bold text-sm">Danh sách tham dự</p>
        <Card>
          <CardContent>
            <Table className="mb-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Email</TableHead>

                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {participants?.map((p) => (
                  <TableRow key={p.auctionParticipantRequestId}>
                    <TableCell className="font-medium">
                      {p.createByAccount?.firstName +
                        " " +
                        p.createByAccount?.lastName}
                    </TableCell>
                    <TableCell>{p.createByAccount?.email}</TableCell>

                    <TableCell>
                      <div
                        className={cn(
                          "px-2 py-1 rounded-full text-white relative w-fit",
                          p.statusId === 1
                            ? "bg-green-600"
                            : p.statusId === 0
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        )}
                      >
                        {p.statusId === 0
                          ? "Đang chờ duyệt"
                          : p.statusId === 1
                          ? "Đã duyệt"
                          : "Đã từ chối"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
