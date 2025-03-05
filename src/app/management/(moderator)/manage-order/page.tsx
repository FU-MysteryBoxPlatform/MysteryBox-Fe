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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderEntity, useGetAllOrderByAccount } from "@/hooks/api/useOrder";
import { GlobalContext } from "@/provider/global-provider";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const { user } = useContext(GlobalContext);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const status = params["status"] || "0";

  const [orders, setOrders] = useState<OrderEntity[]>();
  const [totalPages, setTotalPages] = useState(0);

  //TODO: replace with api get order for mod
  const { data, isLoading, refetch } = useGetAllOrderByAccount(
    user?.id || "",
    +page,
    10
  );

  useEffect(() => {
    refetch();
  }, [page, refetch, status]);

  useEffect(() => {
    setOrders(data?.result.items);
    setTotalPages(data?.result.totalPages || 0);
  }, [data?.result.items, data?.result.totalPages]);

  console.log({ orders });

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
        <CardContent>
          {isLoading ? (
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
                    <TableHead>SĐT</TableHead>
                    <TableHead>Vai trò</TableHead>
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
                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell></TableCell>
                          <TableCell></TableCell>

                          <TableCell>
                            {/* <Button
                            className="bg-[#E12E43] text-white hover:bg-[#B71C32]"
                            onClick={() => {
                              setOpenDetailModal(true);
                              setProductSale(sale);
                            }}
                          >
                            Xem chi tiết
                          </Button> */}
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
