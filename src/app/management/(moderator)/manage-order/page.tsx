"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TOrder,
  TOrderDetail,
  useGetAdminOrderDetail,
  useGetAdminOrders,
} from "@/hooks/api/useOrder";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-date-picker";
import TableCollection from "./components/TableCollectionsOrderDetails";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || "1";
  const status = params["status"] || "1";
  const type = params["type"] || "0";
  const email = params["email"];
  const startDate = params["startDate"];
  const endDate = params["endDate"];
  const ref = useRef<NodeJS.Timeout>(null);

  const [orders, setOrders] = useState<TOrder[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [orderDetail, setOrderDetail] = useState<TOrderDetail[]>();

  const { mutate: mutateGetOrders, isPending } = useGetAdminOrders();
  const { data, refetch } = useGetAdminOrderDetail(orderId);

  const handleFilterByEmail = (value: string) => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      params["email"] = value || null;
      params["page"] = "1";
      router.push(`?${queryString.stringify(params)}`);
    }, 1000);
  };

  const handleFilterByStartDate = (date: Date | [Date, Date] | null) => {
    params["startDate"] = date && !Array.isArray(date) ? dayjs(date).toISOString() : null;
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };

  const handleFilterByEndDate = (date: Date | [Date, Date] | null) => {
    params["endDate"] = date && !Array.isArray(date) ? dayjs(date).toISOString() : null;
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };

  useEffect(() => {
    mutateGetOrders(
      {
        orderType: +type,
        email: email as string,
        startTime: startDate as string,
        endTime: endDate as string,
        orderStatus: +status,
        pageNumber: +page,
        pageSize: 10,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setOrders(data.result.items || []);
            setTotalPages(data.result.totalPages || 0);
          }
        },
      }
    );
  }, [email, endDate, mutateGetOrders, page, startDate, status, type]);

  useEffect(() => {
    if (orderId) refetch();
  }, [refetch, orderId]);

  useEffect(() => {
    setOrderDetail(data?.result.items);
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg border border-gray-200 rounded-xl">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Quản Lý Đơn Hàng
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Xem và quản lý tất cả các đơn hàng trên hệ thống
            </CardDescription>
          </CardHeader>
          <div className="p-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 mb-6 bg-gray-100 p-2 rounded-lg">
              {TABS.map((tab, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "flex-1 py-2 text-center rounded-md text-sm font-medium transition-colors",
                    tab.value === status
                      ? "bg-red-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  )}
                  onClick={() => {
                    params["status"] = tab.value;
                    params["page"] = "1";
                    router.push(`?${queryString.stringify(params)}`);
                  }}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Input
                placeholder="Tìm kiếm bằng email"
                defaultValue={email as string}
                onChange={(e) => handleFilterByEmail(e.target.value)}
                className="bg-white border-gray-300"
              />
              <div>
                <DatePicker
                  className="w-full h-10"
                  value={startDate ? new Date(startDate as string) : null}
                  onChange={(value) => handleFilterByStartDate(value as Date | [Date, Date] | null)}
                  clearIcon={null}
                  calendarIcon={null}
                />
              </div>
              <div>
                <DatePicker
                  className="w-full h-10"
                  value={endDate ? new Date(endDate as string) : null}
                  onChange={(value) => handleFilterByEndDate(value as Date | [Date, Date] | null)}
                  clearIcon={null}
                  calendarIcon={null}
                />
              </div>
              <Select
                value={type as string}
                onValueChange={(value: string) => {
                  params["type"] = value;
                  params["page"] = "1";
                  router.push(`?${queryString.stringify(params)}`);
                }}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Chọn loại đơn hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Tất cả</SelectItem>
                  <SelectItem value="0">Mua vật phẩm</SelectItem>
                  <SelectItem value="1">Mua túi mù</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <CardContent className="p-6 pt-0">
            {isPending ? (
              <div className="flex justify-center py-12">
                <LoadingIndicator />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                Không có đơn hàng nào phù hợp với bộ lọc.
              </div>
            ) : (
              <>
                <Table className="bg-white rounded-lg shadow-md border border-gray-200">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-900">
                        Tên
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Email
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Ngày Mua
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Thao Tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((ord) => {
                      const order = ord.order;
                      return (
                        <TableRow
                          key={order.orderId}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="font-medium text-gray-900">
                            {order.account.firstName} {order.account.lastName}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {order.account.email}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {dayjs(order.orderDate).format("DD/MM/YYYY")}
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  className="text-red-600 hover:text-red-700 transition-colors"
                                  onClick={() => setOrderId(order.orderId)}
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl rounded-xl">
                                <DialogHeader>
                                  <DialogTitle className="text-xl text-gray-900">
                                    Chi Tiết Đơn Hàng
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[60vh] overflow-auto">
                                  <TableCollection
                                    orderDetail={orderDetail?.filter(
                                      (order) => order.collection
                                    )}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="mt-6 flex justify-center">
                  <Paginator
                    currentPage={+page}
                    totalPages={totalPages}
                    onPageChange={(pageNumber) => {
                      params["page"] = pageNumber.toString();
                      router.push(`?${queryString.stringify(params)}`);
                    }}
                    showPreviousNext
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const TABS = [
  { title: "Hoàn Thành", value: "1" },
  { title: "Chờ Duyệt", value: "0" },
  { title: "Đã Hủy", value: "2" },
];
