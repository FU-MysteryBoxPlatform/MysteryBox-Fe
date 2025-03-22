import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllBidByAuctionId } from "@/hooks/api/useAuction";
import { cn, formatPriceVND } from "@/lib/utils";
import { Crown } from "lucide-react";
import { useEffect } from "react";

export default function TableAuctionParticipant({
  auctionId,
}: {
  auctionId?: string;
}) {
  const {
    data,
    isLoading,
    refetch: refetchList,
  } = useGetAllBidByAuctionId(auctionId as string);

  const bidList = data?.result?.items;

  useEffect(() => {
    refetchList();
  }, [auctionId]);

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );

  return (
    <Card>
      <CardContent>
        <Table className="mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Trạng thái</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bidList?.map((bid) => (
              <TableRow key={bid.auctionHistoryId}>
                <TableCell className="font-medium">
                  {bid.createByAccount?.firstName +
                    " " +
                    bid.createByAccount?.lastName}
                </TableCell>
                <TableCell>{bid.createByAccount?.email}</TableCell>
                <TableCell>
                  <p>{formatPriceVND(bid.amount)}</p>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "px-2 py-1 rounded-full text-white relative w-fit",
                      bid.statusId === 0
                        ? "bg-green-600"
                        : bid.statusId === 1
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    )}
                  >
                    {bid.statusId === 1 && (
                      <Crown className="absolute -top-2 -right-1 text-green-500 w-5 h-5 rotate-[20deg]" />
                    )}
                    {bid.statusId === 0
                      ? "Đã đặt chỗ"
                      : bid.statusId === 1
                      ? "Chiến thắng"
                      : "Thất bại"}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
