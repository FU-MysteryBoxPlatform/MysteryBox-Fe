"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TOrderResponse, useGetAllOrderByAccount } from "@/hooks/api/useOrder";
import { formatPriceVND } from "@/lib/utils";
import dayjs from "dayjs";
import { useContext } from "react";
import { GlobalContext } from "@/provider/global-provider";
import { Loader2 } from "lucide-react";
import vnpay from "../../../../../../public/vnpay.png";
import momo from "../../../../../../public/momo.png";
export default function Page() {
  const { user } = useContext(GlobalContext);
  console.log(user);
  const { data: data, isLoading } = useGetAllOrderByAccount(
    user?.id ?? "",
    1,
    10
  );
  const orders = data?.result as TOrderResponse[];
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow-md">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-lg font-medium text-gray-700">Loading ...</span>
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 border border-gray-300 rounded-lg flex-1 max-md:w-full">
      <div>
        <p className="text-xl md:text-2xl font-semibold mb-2 md:mb-4">
          Đơn hàng của bạn
        </p>
        <div>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Quản lý tất cả đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sm:table-cell">Mã đơn hàng</TableHead>
                    <TableHead>Tên khách hàng</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead className="md:table-cell">Tổng tiền</TableHead>

                    <TableHead className="md:table-cell">
                      Ngày đặt hàng
                    </TableHead>
                    <TableHead className="md:table-cell">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.length > 0 &&
                    orders.map((order, index) => (
                      <TableRow key={order.order.orderId}>
                        <TableCell className="sm:table-cell">
                          {order.order.orderId.substring(0, 8)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.order.account.firstName}
                        </TableCell>
                        <TableCell className="md:table-cell">
                          {order.order.paymentMethodId == 1 ? (
                            <img src={vnpay.src} className="w-16" alt="VNPAY" />
                          ) : (
                            <img
                              src={momo.src}
                              className="w-14 h-14"
                              alt="MOMO"
                            />
                          )}
                        </TableCell>
                        <TableCell className="md:table-cell">
                          {formatPriceVND(order.order.totalAmount ?? 0)}
                        </TableCell>
                        <TableCell className="md:table-cell">
                          {dayjs(order.order.orderDate).format(
                            "YYYY-MM-DD HH:mm A"
                          )}
                        </TableCell>
                        <TableCell className="md:table-cell">
                          {order.order.orderStatus.name}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
