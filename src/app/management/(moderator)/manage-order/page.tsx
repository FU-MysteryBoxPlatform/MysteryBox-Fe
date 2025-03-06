"use client";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { TOrder, TOrderDetail, useGetAdminOrders } from "@/hooks/api/useOrder";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { CalendarIcon, Ellipsis, Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useRef, useState } from "react";

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
  const [orderDetail, setOrderDetail] = useState<TOrderDetail[]>();

  const { mutate: mutateGetOrders, isPending } = useGetAdminOrders();

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
    params["startDate"] = dayjs(date).toISOString();
    params["page"] = "1";
    router.push(`?${queryString.stringify(params)}`);
  };
  const handleFilterByEndDate = (date?: Date) => {
    params["endDate"] = dayjs(date).toISOString();
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

            <Popover>
              <PopoverTrigger className="px-2 py-1 text-sm rounded-md border border-gray-300 flex justify-between items-center">
                <p>{dayjs(startDate as string).format("DD/MM/YYYY")}</p>
                <CalendarIcon />
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={dayjs(startDate as string).toDate()}
                  onSelect={(date) => handleFilterByStartDate(date)}
                  className="rounded-md border w-fit"
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger className="px-2 py-1 text-sm rounded-md border border-gray-300 flex justify-between items-center">
                <p>{dayjs(endDate as string).format("DD/MM/YYYY")}</p>
                <CalendarIcon />
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={dayjs(endDate as string).toDate()}
                  onSelect={(date) => handleFilterByEndDate(date)}
                  className="rounded-md border w-fit"
                />
              </PopoverContent>
            </Popover>

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
                  {orders?.length &&
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
                                      setOrderDetail(ord.orderDetails);
                                    }}
                                  />
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Chi tiết đặt hàng</DialogTitle>
                                  </DialogHeader>
                                  <div className="max-h-[50vh] overflow-auto">
                                    <p className="mb-2">
                                      <span className="font-semibold">
                                        Mã đặt hàng:
                                      </span>{" "}
                                      {orderDetail?.[0].orderId}
                                    </p>
                                    <p className="font-semibold mb-2">
                                      Bộ sưu tập
                                    </p>
                                    <div className="grid grid-cols-3 gap-2 mb-2">
                                      {orderDetail
                                        ?.filter((item) => item.collection)
                                        ?.map((o) => (
                                          <div key={o.collectionId}>
                                            <img
                                              src={o.collection.imagePath}
                                              alt=""
                                              className="object-cover w-full aspect-square rounded-md mb-1"
                                            />
                                            <p className="text-sm line-clamp-2">
                                              {o.collection.collectionName}
                                            </p>
                                          </div>
                                        ))}
                                    </div>
                                    <p className="font-semibold mb-2">
                                      Vật phẩm
                                    </p>
                                    <div className="grid grid-cols-3 gap-2 mb-2">
                                      {orderDetail
                                        ?.filter((item) => item.inventory)
                                        ?.map((i) => (
                                          <div key={i.inventoryId}>
                                            <img
                                              src={
                                                i.inventory.product.imagePath
                                              }
                                              alt=""
                                              className="object-cover w-full aspect-square rounded-md mb-1"
                                            />
                                            <p className="text-sm line-clamp-2">
                                              {i.inventory.product.name}
                                            </p>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Ellipsis className="h-4 w-4" />
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
