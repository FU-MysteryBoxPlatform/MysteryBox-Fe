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
  const page = params["page"] || 1;
  const status = params["status"] || "1";
  const type = params["type"] || "0";
  const email = params["email"];
  const startDate = params["startDate"];
  const endDate = params["endDate"];
  const ref = useRef<NodeJS.Timeout>(null);

  const [orders, setOrders] = useState<TOrder[]>();
  const [totalPages, setTotalPages] = useState(0);
  const [orderId, setOrderId] = useState("");
  const [orderDetail, setOrderDetail] = useState<TOrderDetail[]>();

  const { mutate: mutateGetOrders, isPending } = useGetAdminOrders();
  const { data, refetch } = useGetAdminOrderDetail(orderId);

  const handleFilterByEmail = (value: string) => {
    if (ref.current) {
      clearTimeout(ref.current);
    }
    ref.current = setTimeout(() => {
      params["email"] = value;
      params["page"] = "1";
      router.push(`?${queryString.stringify(params)}`);
    }, 1000);
  };

  const handleFilterByStartDate = (date?: Date) => {
    if (!date) params["startDate"] = null;
    else params["startDate"] = dayjs(date).toISOString();
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };
  const handleFilterByEndDate = (date?: Date) => {
    if (!date) params["endDate"] = null;
    else params["endDate"] = dayjs(date).toISOString();
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };

  useEffect(() => {
    mutateGetOrders(
      {
        orderType: +type,
        email: email as string,
        startTime: startDate ? (startDate as string) : undefined,
        endTime: endDate ? (endDate as string) : undefined,
        orderStatus: +status,
        pageNumber: +(page as string),
        pageSize: 10,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            setOrders(data.result.items);
            setTotalPages(data.result.totalPages);
          }
        },
      }
    );
  }, [email, endDate, mutateGetOrders, page, startDate, status, type]);

  useEffect(() => {
    refetch();
  }, [refetch, orderId]);

  useEffect(() => {
    setOrderDetail(data?.result.items);
  }, [data]);

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            Quản lý tài khoản
          </CardTitle>
          <CardDescription>
            Quản lý tất cả các tài khoản trên hệ thống
          </CardDescription>
        </CardHeader>
        <div className="p-6">
          {/* Tabs */}
          <div className="p-2 flex items-center gap-2 [&>*]:flex-1 bg-gray-100 rounded-md mb-4">
            {TABS.map((tab, idx) => (
              <div
                key={idx}
                className={cn(
                  tab.value === status && "bg-[#E12E43] text-white",
                  "text-center rounded-lg cursor-pointer"
                )}
                onClick={() => {
                  params["status"] = tab.value;
                  router.push(`?${queryString.stringify(params)}`);
                }}
              >
                {tab.title}
              </div>
            ))}
          </div>
          <div className="flex gap-4 [&>*]:flex-1">
            <Input
              placeholder="Tìm kiếm bằng email"
              defaultValue={email as string}
              onChange={(e) => handleFilterByEmail(e.target.value)}
            />

            <DatePicker
              className="w-full h-9 [&>div]:border-gray-200 [&>div]:rounded-lg"
              value={startDate ? new Date(startDate as string) : null}
              onChange={(value) => {
                handleFilterByStartDate(value as Date);
              }}
            />
            <DatePicker
              className="w-full h-9 [&>div]:border-gray-200 [&>div]:rounded-lg"
              value={endDate ? new Date(endDate as string) : null}
              onChange={(value) => handleFilterByEndDate(value as Date)}
            />

            <Select
              value={type as string}
              onValueChange={(value: string) => {
                params["type"] = value;
                params["page"] = "1";
                router.push(`?${queryString.stringify(params)}`);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by order type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">Tất cả</SelectItem>
                <SelectItem value="0">Mua vật phẩm</SelectItem>
                <SelectItem value="1">Mua túi mù</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <CardContent>
          {isPending ? (
            <div className="w-full flex items-center justify-center">
              <LoadingIndicator />
            </div>
          ) : (
            <>
              <Table className="mb-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Ngày mua</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!!orders?.length &&
                    orders?.length > 0 &&
                    orders?.map((ord) => {
                      const order = ord.order;
                      return (
                        <TableRow key={order.orderId}>
                          <TableCell>
                            {order.account.firstName +
                              " " +
                              order.account.lastName}
                          </TableCell>
                          <TableCell>{order.account.email}</TableCell>
                          <TableCell>
                            {dayjs(order.orderDate).format("DD/MM/YYYY")}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger>
                                  <Eye
                                    className="h-4 w-4 cursor-pointer"
                                    onClick={() => {
                                      setOrderId(order.orderId);
                                    }}
                                  />
                                </DialogTrigger>
                                <DialogContent className="max-w-[80vw]">
                                  <DialogHeader>
                                    <DialogTitle>Chi tiết đặt hàng</DialogTitle>
                                  </DialogHeader>
                                  <div className="max-h-[50vh] overflow-auto">
                                    <TableCollection
                                      orderDetail={orderDetail?.filter(
                                        (order) => order.collection
                                      )}
                                    />
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              {orders?.length && orders.length > 0 ? (
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const TABS = [
  {
    title: "Hoàn thành",
    value: "1",
  },
  {
    title: "Chờ duyệt",
    value: "0",
  },
  {
    title: "Đã huỷ",
    value: "2",
  },
];
