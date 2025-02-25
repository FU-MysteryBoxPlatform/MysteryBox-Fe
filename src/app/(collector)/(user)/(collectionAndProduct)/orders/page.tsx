"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TOrderResponse,
  useGetAllOrderByAccount,
  useGetOrderById,
} from "@/hooks/api/useOrder";
import { cn, formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

const OrderDetailModal = ({
  orderId,
  open,
  setOpen,
}: {
  orderId: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: data, isLoading, refetch } = useGetOrderById(orderId);

  console.log({ data: data?.result.items[0] });

  useEffect(() => {
    refetch();
  }, [orderId, refetch]);

  if (isLoading) {
    return (
      <div>
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
        </DialogHeader>
        <div>
          <p>
            <span className="font-semibold">Mã đơn hàng:</span>{" "}
            {data?.result.items[0].orderId}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function Page() {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const { user } = useContext(GlobalContext);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;

  const { data: data, isLoading } = useGetAllOrderByAccount(
    user?.id ?? "",
    page as number,
    10
  );
  const orders = data?.result as TOrderResponse[];
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-screen">
        <LoadingIndicator />
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
              <Table className="mb-6">
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
                    <TableHead className="md:table-cell">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.length > 0 &&
                    orders.map((order) => (
                      <TableRow key={order.order.orderId}>
                        <TableCell className="sm:table-cell">
                          {order.order.orderId.substring(0, 8)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {order.order.account.firstName}
                        </TableCell>
                        <TableCell className="flex items-center justify-center">
                          {order.order.paymentMethodId == 1 ? (
                            <img
                              src="/vnpay.png"
                              className="w-16"
                              alt="VNPAY"
                            />
                          ) : (
                            <img src="/momo.png" className="w-6" alt="MOMO" />
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
                          <p
                            className={cn(
                              order.order.orderStatus.name === "PROCESSING" &&
                                "text-orange-400",
                              order.order.orderStatus.name === "COMPLETED" &&
                                "text-green-400"
                            )}
                          >
                            {order.order.orderStatus.name === "PROCESSING"
                              ? "Đang xử lý"
                              : order.order.orderStatus.name === "COMPLETED"
                              ? "Đã hoàn thành"
                              : "Chưa xử lý"}
                          </p>
                        </TableCell>
                        <TableCell className="flex justify-center items-center">
                          <Eye
                            className="w-4 h-4 cursor-pointer"
                            onClick={() => {
                              setOpen(true);
                              setOrderId(order.order.orderId);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Paginator
                currentPage={+(page as string)}
                totalPages={1}
                onPageChange={(pageNumber) => {
                  params["page"] = pageNumber.toString();
                  router.push(`?${queryString.stringify(params)}`);
                }}
                showPreviousNext
              />
            </CardContent>
            <OrderDetailModal open={open} setOpen={setOpen} orderId={orderId} />
          </Card>
        </div>
      </div>
    </div>
  );
}
