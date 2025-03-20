"use client";
import { Value } from "@/app/components/FormUpdateProfile";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  useGetAllOrderByAccount,
  useGetOrderDetail,
} from "@/hooks/api/useOrder";
import { formatDate, formatPriceVND } from "@/lib/utils";
import { GlobalContext } from "@/provider/global-provider";
import { Filter, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import RatingForm from "./components/RatingForm";

export default function Page() {
  const { user } = useContext(GlobalContext);
  const [id, setId] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;

  // Filter states
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [orderDetailId, setOrderDetailId] = useState("");
  const [startDate, setStartDate] = useState<Value>();
  const [endDate, setEndDate] = useState<Value>();
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
  const { data, isLoading } = useGetAllOrderByAccount(user?.id ?? "", +page, 6);
  const orders = data?.result.items || [];
  const totalPages = data?.result.totalPages || 0;
  const {
    data: detail,
    isLoading: isLoading2,
    refetch,
  } = useGetOrderDetail(id);

  // Apply filters
  useEffect(() => {
    if (orders.length > 0) {
      let result = [...orders];
      if (statusFilter !== "") {
        result = result.filter(
          (order) => order.order.statusId === parseInt(statusFilter)
        );
      }
      if (startDate) {
        result = result.filter(
          (order) =>
            new Date(order.order.orderDate) >= new Date(startDate as Date)
        );
      }
      if (endDate) {
        result = result.filter(
          (order) =>
            new Date(order.order.orderDate) <= new Date(endDate as Date)
        );
      }
      setFilteredOrders(result);
    } else {
      setFilteredOrders([]);
    }
  }, [orders, startDate, endDate, statusFilter]);

  const applyFilters = () => {
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };

  const resetFilters = () => {
    setStartDate(null);
    setEndDate(null);
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

  const fetchDetail = (id: string) => {
    setId(id);
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">
        Đơn hàng của bạn
      </h1>

      <Card className="shadow-md border-none">
        <CardHeader className="bg-gray-50">
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-700">
            Quản lý đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <div
                    key={order.order.orderId}
                    className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                      id === order.order.orderId
                        ? "border-2 border-blue-500"
                        : "border border-gray-200"
                    }`}
                    onClick={() => fetchDetail(order.order.orderId)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">
                        Mã đơn hàng: {order.order.orderId.substring(0, 8)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(order.order.orderDate)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span>
                        Trạng thái:{" "}
                        <span
                          className={`${renderColorOrderStatus(
                            order.order.statusId
                          )} font-medium`}
                        >
                          {renderOrderStatus(order.order.statusId)}
                        </span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Tổng tiền:{" "}
                        <strong className="text-blue-600">
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

            {/* Order Details & Filters */}
            <div className="space-y-6">
              {/* Order Details */}
              {id && (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                    Chi tiết đơn hàng
                  </h3>
                  {isLoading2 ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto space-y-4">
                      {detail?.result.items.map((item) => (
                        <div
                          key={item.orderDetailId}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={
                                item.collection
                                  ? item.collection.imagePath
                                  : item.inventory?.product.imagePath
                              }
                              alt=""
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-700 line-clamp-2">
                                {item.collection
                                  ? `Túi mù ${item.collection.collectionName}`
                                  : `${item.inventory?.product.name}`}
                              </p>
                              <p className="text-sm text-blue-600">
                                {formatPriceVND(item.unitPrice)}
                              </p>
                              {item.order.statusId === 1 && !item.isRated && (
                                <button
                                  className="text-blue-500 hover:underline text-sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenRatingModal(true);
                                    setOrderDetailId(item.orderDetailId);
                                  }}
                                >
                                  Đánh giá
                                </button>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-600">
                            SL: <strong>{item.quantity}</strong>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Filters */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-700 flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Bộ lọc
                  </h3>
                  <button
                    className="text-sm text-blue-600 hover:text-blue-800"
                    onClick={resetFilters}
                  >
                    Đặt lại
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Từ ngày
                    </label>
                    <DatePicker
                      className="w-full h-10 border-gray-200 rounded-md"
                      value={startDate}
                      onChange={setStartDate}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Đến ngày
                    </label>
                    <DatePicker
                      className="w-full h-10 border-gray-200 rounded-md"
                      value={endDate}
                      onChange={setEndDate}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-md text-sm"
                    >
                      <option value="">Tất cả</option>
                      <option value="0">Chờ xác nhận</option>
                      <option value="1">Đang xử lý</option>
                      <option value="2">Hoàn thành</option>
                      <option value="3">Đã hủy</option>
                    </select>
                  </div>
                  <button
                    onClick={applyFilters}
                    className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination */}
          {orders.length > 0 && (
            <div className="mt-6">
              <Paginator
                currentPage={+(page as string)}
                totalPages={totalPages}
                onPageChange={(pageNumber) => {
                  params["page"] = pageNumber.toString();
                  router.push(`?${queryString.stringify(params)}`);
                }}
                showPreviousNext
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={openRatingModal} onOpenChange={setOpenRatingModal}>
        <DialogContent>
          <RatingForm
            orderDetailId={orderDetailId}
            onFinish={() => {
              setOpenRatingModal(false);
              refetch();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
