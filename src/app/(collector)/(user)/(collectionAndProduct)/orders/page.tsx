"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
<<<<<<< HEAD
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

=======
  TOrderResponse,
  useGetAllOrderByAccount,
  useGetOrderDetail,
} from "@/hooks/api/useOrder";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { useContext, useState } from "react";
import { GlobalContext } from "@/provider/global-provider";
import { Loader2 } from "lucide-react";
>>>>>>> 0703bf1 (feat: add ui detail)
export default function Page() {
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const { user } = useContext(GlobalContext);
<<<<<<< HEAD

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;

=======
  const [id, setId] = useState("");
  console.log(user);
>>>>>>> 0703bf1 (feat: add ui detail)
  const { data: data, isLoading } = useGetAllOrderByAccount(
    user?.id ?? "",
    page as number,
    10
  );
  const { data: detail, isLoading: isLoading2 } = useGetOrderDetail(id);
  const orders = data?.result as TOrderResponse[];
  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

<<<<<<< HEAD
=======
  const renderOrderStatus = (status: number) => {
    switch (status) {
      case 1:
        return "Đã xác nhận";
      case 2:
        return "Đang xử lý";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };
  const renderColorOrderStatus = (status: number) => {
    switch (status) {
      case 1:
        return "text-orange-400";
      case 2:
        return "text-blue-700";
      case 3:
        return "text-green-500";
      case 4:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };
  const fetchDetail = (id: string) => {
    setId(id);
  };
>>>>>>> 0703bf1 (feat: add ui detail)
  return (
    <div className="  rounded-lg flex-1 max-md:w-full">
      <div>
        <p className="text-xl md:text-2xl font-semibold mb-2 md:mb-4 border border-gray-300 px-6 py-4 rounded-lg">
          Đơn hàng của bạn
        </p>
        <div>
          <Card x-chunk="dashboard-06-chunk-0 border-none">
            <CardHeader>
              <CardTitle>Quản lý tất cả đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent>
<<<<<<< HEAD
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
=======
              <div className="grid grid-cols-12">
                <div className="col-span-7 p-4">
                  {orders?.length > 0 &&
                    orders.map((order) => (
                      <div
                        className="bg-white shadow-lg p-4 rounded-lg my-1 text-sm font-sans"
                        onClick={() => fetchDetail(order.order.orderId)}
                      >
                        <div className="flex justify-between">
                          <span className="inline-block">
                            <strong> Mã đơn hàng:</strong>{" "}
                            {order.order.orderId.substring(0, 8)}
                          </span>

                          <span className="inline-block text-gray-600 text-sm">
                            {formatDate(order.order.orderDate)}
                          </span>
                        </div>

                        <div className="flex justify-between my-2">
                          <span className="inline-block">
                            <strong className="text-gray-600">
                              Trạng thái
                            </strong>
                            :{" "}
                            <span
                              className={`${renderColorOrderStatus(
                                order.order.statusId
                              )}`}
                            >
                              {renderOrderStatus(order.order.statusId)}
                            </span>
                          </span>

                          <span className="inline-block text-gray-500 text-sm">
                            Tổng tiền:
                            <strong className="ml-1 text-blue-700 ">
                              {formatPriceVND(order.order.totalAmount)}
                            </strong>
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="col-span-5 p-4">
                  <div className="bg-white shadow-lg p-4 rounded-lg my-1 text-base font-sans">
                    <div className="flex justify-center">
                      <span className="inline-block">
                        <strong className="">Chi tiết đơn hàng</strong>
                      </span>
                    </div>
                    {isLoading2 ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div>
                        {detail?.result.map((item ) => (
                          <div>
                            <div className="flex justify-between my-2">
                              <span className="inline-block">
                                <strong className="text-gray-600">
                                  {item.collection ? "Túi mù" : "Vật phẩm"}
                                </strong>
                              </span>

                              <span className="inline-block text-gray-500 text-sm">
                                Số lượng:{" "}
                                <strong className="ml-1 text-blue-700 ">
                                  {item.quantity}
                                </strong>
                              </span>
                            </div>
                            <div className="flex justify-center my-2">
                              <span className="inline-block">
                                <strong className="text-gray-600 mr-2 my-2">
                                  Đơn giá
                                </strong>
                                <span className="text-blue-700">
                                  {formatPriceVND(item.unitPrice)}
                                </span>
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
>>>>>>> 0703bf1 (feat: add ui detail)
            </CardContent>
            <OrderDetailModal open={open} setOpen={setOpen} orderId={orderId} />
          </Card>
        </div>
      </div>
    </div>
  );
}
