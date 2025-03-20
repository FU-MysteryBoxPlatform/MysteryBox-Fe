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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TTransaction,
  useGetAllTransaction,
} from "@/hooks/api/useTransactions";
import { cn, formatPriceVND } from "@/lib/utils";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  const currTab = params["tab"] || "0";

  const [transactions, setTransactions] = useState<TTransaction[]>();
  const [totalPages, setTotalPages] = useState(0);
  const [transactionDetail, setTransactionDetail] = useState<TTransaction>();

  const { data, isLoading, refetch } = useGetAllTransaction(
    +page,
    10,
    +currTab
  );

  useEffect(() => {
    refetch();
  }, [refetch, page, currTab]);

  useEffect(() => {
    setTransactions(data?.result.items);
    setTotalPages(data?.result.totalPages || 0);
  }, [data]);

  const renderTransactionStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Chờ xác nhận";
      case 1:
        return "Hoàn thành";
      case 2:
        return "Đã thất bại";
      case 3:
        return "Đã huỷ";
      default:
        return "Không xác định";
    }
  };

  const renderColorTransactionStatus = (status: number) => {
    switch (status) {
      case 0:
        return "text-orange-400";
      case 1:
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            Quản lý giao dịch
          </CardTitle>
          <CardDescription>
            Quản lý tất cả các giao dịch trên hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className="p-2 flex items-center gap-2 [&>*]:flex-1 bg-gray-100 rounded-md mb-4">
            {TABS.map((tab, idx) => (
              <div
                key={idx}
                className={cn(
                  tab.value === currTab && "bg-[#E12E43] text-white",
                  "text-center rounded-lg cursor-pointer"
                )}
                onClick={() => {
                  params["tab"] = tab.value;
                  router.push(`?${queryString.stringify(params)}`);
                }}
              >
                {tab.title}
              </div>
            ))}
          </div>

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
                    <TableHead>Loại giao dịch</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead>Ngày thực hiện</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions?.length && transactions?.length > 0
                    ? transactions?.map((tran, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell>
                              {tran.account?.firstName +
                                " " +
                                tran.account?.lastName}
                            </TableCell>
                            <TableCell>
                              <div
                                className={cn(
                                  "px-2 py-1 rounded-lg text-white w-fit",
                                  tran.transactionType.name === "TRADING"
                                    ? "bg-orange-500"
                                    : tran.transactionType.name === "SELL"
                                    ? "bg-blue-500"
                                    : "bg-green-500"
                                )}
                              >
                                {tran.transactionType.name === "TRADING"
                                  ? "Giao dịch"
                                  : tran.transactionType.name === "SELL"
                                  ? "Bán"
                                  : "Mua"}
                              </div>
                            </TableCell>

                            <TableCell>{tran.paymentMethod.name}</TableCell>
                            <TableCell>
                              {dayjs(tran.date).format("DD/MM/YYYY HH:mm")}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog>
                                  <DialogTrigger>
                                    <Eye
                                      className="h-4 w-4 cursor-pointer"
                                      onClick={() => {
                                        setTransactionDetail(tran);
                                      }}
                                    />
                                  </DialogTrigger>
                                  <DialogContent className="max-w-[80vw]">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Chi tiết giao dịch
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="max-h-[50vh] overflow-auto">
                                      <Table className="mb-4">
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Người mua</TableHead>
                                            <TableHead>
                                              Loại giao dịch
                                            </TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Giá</TableHead>
                                            <TableHead>Mã đặt hàng</TableHead>
                                            <TableHead>
                                              Ngày giao dịch
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          <TableRow>
                                            <TableCell className="font-medium">
                                              {transactionDetail?.account
                                                .firstName +
                                                " " +
                                                transactionDetail?.account
                                                  .lastName}
                                            </TableCell>

                                            <TableCell>
                                              <div
                                                className={cn(
                                                  "px-2 py-1 rounded-lg text-white w-fit",
                                                  tran.transactionType.name ===
                                                    "TRADING"
                                                    ? "bg-orange-500"
                                                    : tran.transactionType
                                                        .name === "SELL"
                                                    ? "bg-blue-500"
                                                    : "bg-green-500"
                                                )}
                                              >
                                                {tran.transactionType.name ===
                                                "TRADING"
                                                  ? "Giao dịch"
                                                  : tran.transactionType
                                                      .name === "SELL"
                                                  ? "Bán"
                                                  : "Mua"}
                                              </div>
                                            </TableCell>
                                            <TableCell
                                              className={cn(
                                                renderColorTransactionStatus(
                                                  transactionDetail?.transactionStatusId ||
                                                    0
                                                )
                                              )}
                                            >
                                              {renderTransactionStatus(
                                                transactionDetail?.transactionStatusId ||
                                                  0
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {formatPriceVND(
                                                transactionDetail?.order
                                                  .totalAmount || 0
                                              )}
                                            </TableCell>
                                            <TableCell>
                                              {transactionDetail?.orderId}
                                            </TableCell>
                                            <TableCell>
                                              {dayjs(
                                                transactionDetail?.date
                                              ).format("DD/MM/YYYY HH:mm")}
                                            </TableCell>
                                          </TableRow>
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    : null}
                </TableBody>
              </Table>
              {transactions?.length && transactions.length > 0 ? (
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
                  Không có giao dịch nào
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
    title: "Đang chờ",
    value: "0",
  },
  {
    title: "Thành công",
    value: "1",
  },
  {
    title: "Thất bại",
    value: "2",
  },
  {
    title: "Đã huỷ",
    value: "3",
  },
];
