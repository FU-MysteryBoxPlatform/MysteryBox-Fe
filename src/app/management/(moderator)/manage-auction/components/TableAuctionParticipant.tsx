import LoadingIndicator from "@/app/components/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAllAuctionParticipant,
  useApproveAuctionRequest,
  useGetAuctionById,
} from "@/hooks/api/useAuction";
import { TOrderDetail } from "@/hooks/api/useOrder";
import { toast } from "@/hooks/use-toast";
import { cn, formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";

export default function TableAuctionParticipant({
  auctionId,
  isEnd,
}: {
  auctionId?: string;
  isEnd?: boolean;
}) {
  const { user } = useContext(GlobalContext);

  const [requestApproveId, setRequestApproveId] = useState("");

  const {
    data: auction,
    isLoading,
    refetch: refetchDataAuction,
  } = useGetAuctionById(auctionId || "");
  const { mutate: approveAuctionRequest, isPending } =
    useApproveAuctionRequest();

  const participants = auction?.result.auctionParticipantRequests || [];

  const handleApprove = (requestId: string) => {
    setRequestApproveId(requestId);
    approveAuctionRequest(
      {
        accountId: user?.id ?? "",
        auctionRequestId: requestId,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Đã duyệt",
            });
            refetchDataAuction();
          } else {
            toast({
              title: data.messages[0],
            });
          }
        },
      }
    );
  };

  if (isLoading)
    return (
      <div className="w-full flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bộ sưu tập</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Tên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày yêu cầu</TableHead>
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
                <TableCell
                  className={cn(
                    "flex items-center gap-2",
                    p.statusId === 0 && "text-red-500",
                    p.statusId === 1 && "text-green-500",
                    p.statusId === 2 && "text-gray-500"
                  )}
                >
                  {p.statusId === 0
                    ? "Đang chờ duyệt"
                    : p.statusId === 1
                    ? "Đã duyệt"
                    : "Đã từ chối"}
                </TableCell>

                <TableCell>
                  {dayjs(p.createDate).format("DD/MM/YYYY")}
                </TableCell>
                {p.statusId === 0 && (
                  <TableCell>
                    <Button
                      onClick={() =>
                        handleApprove(p.auctionParticipantRequestId)
                      }
                    >
                      {isPending &&
                      requestApproveId === p.auctionParticipantRequestId ? (
                        <LoadingIndicator />
                      ) : (
                        "Duyệt"
                      )}
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
