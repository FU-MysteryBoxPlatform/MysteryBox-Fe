import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TTransaction,
  useGetTransactionById,
} from "@/hooks/api/useTransactions";
import { cn, formatPriceVND } from "@/lib/utils";
import dayjs from "dayjs";
import { useEffect } from "react";
import TableCollection from "../../manage-order/components/TableCollectionsOrderDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TransactionDetail({
  paymentHistoryId,
}: {
  paymentHistoryId?: string;
}) {
  const { data: transactionDetail, refetch } = useGetTransactionById(
    paymentHistoryId || ""
  );

  const detail = transactionDetail?.result;
  const orderDetail = detail?.orderResponse?.orderDetails;
  const exchangeRequest = detail?.exchangeRequest;

  const renderTransactionStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Chờ Xác Nhận";
      case 1:
        return "Hoàn Thành";
      case 2:
        return "Thất Bại";
      case 3:
        return "Đã Hủy";
      default:
        return "Không Xác Định";
    }
  };

  const renderColorTransactionStatus = (status: number) => {
    switch (status) {
      case 0:
        return "text-orange-500";
      case 1:
        return "text-red-600";
      case 2:
        return "text-red-500";
      case 3:
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  const renderExchangeRequestStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Đang chờ";
      case 1:
        return "Đã từ chối";
      case 2:
        return "Đã hoàn thành";
      default:
        return "Đã hủy";
    }
  };
  const renderColorExchangeRequestStatus = (status: number) => {
    switch (status) {
      case 0:
        return "text-orange-500";
      case 1:
        return "text-red-500";
      case 2:
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  useEffect(() => {
    refetch();
  }, [paymentHistoryId]);

  return (
    <div className="grid gap-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-gray-900">
              Người Mua
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Loại Giao Dịch
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Trạng Thái
            </TableHead>
            <TableHead className="font-semibold text-gray-900">
              Thanh Toán
            </TableHead>
            <TableHead className="font-semibold text-gray-900">Giá</TableHead>
            <TableHead className="font-semibold text-gray-900">
              Ngày Giao Dịch
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium text-gray-900">
              {detail?.account?.firstName} {detail?.account?.lastName}
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-xs font-semibold text-white",
                  detail?.transactionType.name === "TRADING"
                    ? "bg-orange-500"
                    : detail?.transactionType.name === "SELL"
                    ? "bg-blue-500"
                    : "bg-red-600"
                )}
              >
                {detail?.transactionType.name === "TRADING"
                  ? "Giao Dịch"
                  : detail?.transactionType.name === "SELL"
                  ? "Bán"
                  : "Mua"}
              </span>
            </TableCell>
            <TableCell
              className={cn(
                renderColorTransactionStatus(detail?.transactionStatusId || 0)
              )}
            >
              {renderTransactionStatus(detail?.transactionStatusId || 0)}
            </TableCell>
            <TableCell>{detail?.paymentMethod.name}</TableCell>
            <TableCell className="text-gray-700">
              {formatPriceVND(detail?.order?.totalAmount || 0)}
            </TableCell>
            <TableCell className="text-gray-700">
              {dayjs(detail?.date).format("DD/MM/YYYY HH:mm")}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <TableCollection title="Đơn hàng" orderDetail={orderDetail} />
      {!!exchangeRequest && (
        <Card>
          <CardHeader>
            <CardTitle>Trao đổi</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="mb-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Người mua</TableHead>
                  <TableHead>Trao đổi</TableHead>
                  <TableHead>Nhận</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày yêu cầu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">
                    {exchangeRequest.createByAccount?.firstName +
                      " " +
                      exchangeRequest.createByAccount?.lastName}
                  </TableCell>
                  <TableCell className="flex items-center gap-2">
                    <img
                      src={
                        exchangeRequest?.offeredInventoryItem?.product
                          ?.imagePath
                      }
                      alt="exchange item"
                      className="w-10 h-10 object-cover"
                    />
                    {exchangeRequest?.offeredInventoryItem?.product?.name}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          exchangeRequest?.requestInventoryItem?.product
                            ?.imagePath
                        }
                        alt="exchange item"
                        className="w-10 h-10 object-cover"
                      />
                      {exchangeRequest?.requestInventoryItem?.product?.name}
                    </div>
                  </TableCell>
                  <TableCell>{exchangeRequest?.content}</TableCell>
                  <TableCell
                    className={cn(
                      renderColorExchangeRequestStatus(exchangeRequest.statusId)
                    )}
                  >
                    {renderExchangeRequestStatus(exchangeRequest?.statusId)}
                  </TableCell>
                  <TableCell>
                    {dayjs(exchangeRequest?.createDate).format("DD/MM/YYYY")}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
