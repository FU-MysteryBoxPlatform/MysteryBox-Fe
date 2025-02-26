"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAllOrderByAccount,
  useGetOrderDetail,
} from "@/hooks/api/useOrder";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/provider/global-provider";
import { Loader2 } from "lucide-react";
import Paginator from "@/app/components/Paginator";
import queryString from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
export default function Page() {
  const { user } = useContext(GlobalContext);
  const [id, setId] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  console.log(user);

  const { data: data, isLoading } = useGetAllOrderByAccount(
    user?.id ?? "",
    +page,
    6
  );
  // setTotalPages(data?.result.totalPages || 0);
  const orders = data?.result.items || [];
 let totalPages = data?.result.totalPages || 0;
  const { data: detail, isLoading: isLoading2 } = useGetOrderDetail(id);
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


  console.log(orders);
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
              <div className="grid grid-cols-12">
                <div className="col-span-6 p-4">
                  {orders.length > 0 &&
                    orders?.map((order) => (
                      <div
                        key={order.order.orderId}
                        className="bg-white shadow-lg p-4 rounded-lg my-1 text-sm font-sans cursor-pointer"
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
                {id != "" && (
                  <div className="col-span-6 p-4">
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
                          {detail?.result.items.map((item) => (
                            <div key={item.orderDetailId}>
                              <div className="flex justify-between my-2 border border-gray-200 p-2 rounded-lg my-2">
                                <span className=" flex items-center">
                                  <img
                                    src={
                                      item.collection
                                        ? item.collection.imagePath
                                        : item.inventory?.product.imagePath
                                    }
                                    alt=""
                                    className="w-20 h-20 aspect-square"
                                  />
                                  <div className="flex flex-col ml-2">
                                    <strong className="text-gray-600 text-sm">
                                      {item.collection
                                        ? `Túi mù ${item.collection.collectionName}`
                                        : `${item.inventory?.product.name}`}
                                    </strong>
                                    <span className="text-blue-700 text-sm  font-semibold">
                                      Đơn giá: {formatPriceVND(item.unitPrice)}
                                    </span>
                                  </div>
                                </span>

                                <span className="flex items-center text-gray-500 text-sm">
                                  Số lượng:{" "}
                                  <strong className="ml-1 text-blue-700 ">
                                    {item.quantity}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {orders.length > 0 ? (
                <Paginator
                  currentPage={+(page as string)}
                  totalPages={totalPages}
                  onPageChange={(pageNumber) => {
                    params["page"] = pageNumber.toString();
                    router.push(`?${queryString.stringify(params)}`);
                  }}
                  showPreviousNext
                />
              ) : (
                <div className="w-full text-center mt-10">
                  Không có bộ sưu tập nào
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
