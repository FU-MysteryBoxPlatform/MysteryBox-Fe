"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAllOrderByAccount,
  useGetOrderDetail,
} from "@/hooks/api/useOrder";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { useContext, useState, useEffect } from "react";
import { GlobalContext } from "@/provider/global-provider";
import { Calendar, Loader2, Filter } from "lucide-react";
import Paginator from "@/app/components/Paginator";
import queryString from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/app/components/LoadingIndicator";

export default function Page() {
  const { user } = useContext(GlobalContext);
  const [id, setId] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;

  // Filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  interface Order {
    order: {
      orderId: string;
      statusId: number;
      orderDate: string;
      totalAmount: number;
    };
  }

  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  const { data: data, isLoading } = useGetAllOrderByAccount(
    user?.id ?? "",
    +page,
    6
  );

  const orders = data?.result.items || [];
  const totalPages = data?.result.totalPages || 0;
  const { data: detail, isLoading: isLoading2 } = useGetOrderDetail(id);

  // Apply filters when orders or filter values change
  useEffect(() => {
    if (orders.length > 0) {
      let result = [...orders];

      // Filter by status
      if (statusFilter !== "") {
        result = result.filter(
          (order) => order.order.statusId === parseInt(statusFilter)
        );
      }

      // Filter by date range
      if (startDate) {
        result = result.filter(
          (order) => new Date(order.order.orderDate) >= new Date(startDate)
        );
      }

      if (endDate) {
        result = result.filter(
          (order) => new Date(order.order.orderDate) <= new Date(endDate)
        );
      }

      setFilteredOrders(result);
    } else {
      setFilteredOrders([]);
    }
  }, [orders, startDate, endDate, statusFilter]);

  // Apply filters
  const applyFilters = () => {
    // Reset to first page when applying filters
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };

  // Reset filters
  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setStatusFilter("");
  };

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center h-[70vh]">
        <LoadingIndicator />
      </div>
    );
  }

  const renderOrderStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Đang xử lý";
      case 2:
        return "Hoàn thành";
      case 3:
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
        return "text-blue-700";
      case 2:
        return "text-green-500";
      case 3:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const fetchDetail = (id: string) => {
    setId(id);
  };

  return (
    <div className="rounded-lg flex-1 max-md:w-full">
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
              <div className="grid grid-cols-12 gap-4">
                {/* Orders list - adjusts from 12 columns on mobile to 6 on larger screens */}
                <div className="col-span-12 md:col-span-6 p-4">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <div
                        key={order.order.orderId}
                        className={`bg-white shadow-lg p-4 rounded-lg my-1 text-sm font-sans cursor-pointer ${
                          id === order.order.orderId
                            ? "border-2 border-blue-500"
                            : ""
                        }`}
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
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Không có đơn hàng nào
                    </div>
                  )}
                </div>

                {/* Details and filters panel - stacked on mobile, side by side on larger screens */}
                <div className="col-span-12 md:col-span-6 p-4">
                  {/* Order details section */}
                  {id !== "" && (
                    <div className="bg-white shadow-lg p-4 rounded-lg mb-4 text-base font-sans">
                      <div className="flex justify-center mb-2">
                        <span className="inline-block">
                          <strong className="">Chi tiết đơn hàng</strong>
                        </span>
                      </div>
                      {isLoading2 ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        <div className="max-h-80 overflow-y-auto">
                          {detail?.result.items.map((item) => (
                            <div key={item.orderDetailId}>
                              <div className="flex justify-between my-2 border border-gray-200 p-2 rounded-lg">
                                <span className="flex items-center">
                                  <img
                                    src={
                                      item.collection
                                        ? item.collection.imagePath
                                        : item.inventory?.product.imagePath
                                    }
                                    alt=""
                                    className="w-16 h-16 md:w-20 md:h-20 aspect-square object-cover"
                                  />
                                  <div className="flex flex-col ml-2">
                                    <strong className="text-gray-600 text-xs md:text-sm line-clamp-2">
                                      {item.collection
                                        ? `Túi mù ${item.collection.collectionName}`
                                        : `${item.inventory?.product.name}`}
                                    </strong>
                                    <span className="text-blue-700 text-xs md:text-sm font-semibold">
                                      Đơn giá: {formatPriceVND(item.unitPrice)}
                                    </span>
                                  </div>
                                </span>

                                <span className="flex items-center text-gray-500 text-xs md:text-sm">
                                  SL:{" "}
                                  <strong className="ml-1 text-blue-700">
                                    {item.quantity}
                                  </strong>
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Filter section */}
                  <div className="bg-white shadow-lg p-4 rounded-lg text-base font-sans">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold flex items-center">
                        <Filter className="h-4 w-4 mr-2" />
                        Bộ lọc đơn hàng
                      </span>
                      <button
                        className="text-xs text-blue-600 hover:text-blue-800"
                        onClick={resetFilters}
                      >
                        Đặt lại
                      </button>
                    </div>

                    {/* Date range filter */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Từ ngày:
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                        <Calendar className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đến ngày:
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                        />
                        <Calendar className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    {/* Status filter */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái:
                      </label>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">Tất cả</option>
                        <option value="0">Chờ xác nhận</option>
                        <option value="1">Đang xử lý</option>
                        <option value="2">Hoàn thành</option>
                        <option value="3">Đã hủy</option>
                      </select>
                    </div>

                    {/* Apply button */}
                    <button
                      onClick={applyFilters}
                      className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
                    >
                      Áp dụng bộ lọc
                    </button>
                  </div>
                </div>
              </div>

              {/* Pagination */}
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
                  Không có đơn hàng nào
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
