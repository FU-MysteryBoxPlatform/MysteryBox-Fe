import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TOrderDetail } from "@/hooks/api/useOrder";
import { cn, formatPriceVND } from "@/lib/utils";
import dayjs from "dayjs";

export default function TableCollection({
  orderDetail,
}: {
  orderDetail?: TOrderDetail[];
}) {
  if (!orderDetail) return null;

  const renderOrderStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Hoàn thành";
      case 2:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const renderColorOrderStatus = (status: number) => {
    switch (status) {
      case 0:
        return "text-orange-400";
      case 1:
        return "text-green-500";
      case 2:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bộ sưu tập</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Người mua</TableHead>
              <TableHead>Tên bộ sưu tập</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Giá</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Ngày mua</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderDetail?.map((o) => (
              <TableRow key={o.orderId}>
                <TableCell className="font-medium">
                  {o.order?.account?.firstName +
                    " " +
                    o.order?.account?.lastName}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <img
                    src={o.collection?.imagePath}
                    alt="collection"
                    className="w-10 h-10 object-cover"
                  />
                  {o.collection?.collectionName}
                </TableCell>
                <TableCell
                  className={cn(renderColorOrderStatus(o.order.statusId))}
                >
                  {renderOrderStatus(o.order.statusId)}
                </TableCell>
                <TableCell>{formatPriceVND(o.order.totalAmount)}</TableCell>
                <TableCell>{o.quantity}</TableCell>
                <TableCell>
                  {dayjs(o.order.orderDate).format("DD/MM/YYYY")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
