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
  const page = params["page"] || "1";
  const currTab = params["tab"] || "0";

  const [transactions, setTransactions] = useState<TTransaction[]>([]);
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
    if (data?.isSuccess) {
      setTransactions(data.result.items || []);
      setTotalPages(data.result.totalPages || 0);
    }
  }, [data]);

  const renderTransactionStatus = (status: number) => {
    switch (status) {
      case 0:
        return "Chờ Xác Nhận";
      case 1:
        return "Hoàn Thành";
      case 2:
        return "Thất Bại";
      case 3:
        return "Đã Hủy";
      default:
        return "Không Xác Định";
    }
  };

  const renderColorTransactionStatus = (status: number) => {
    switch (status) {
      case 0:
        return "text-orange-500";
      case 1:
        return "text-red-600";
      case 2:
        return "text-red-500";
      case 3:
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg border border-gray-200 rounded-xl">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Quản Lý Giao Dịch
            </CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              Xem và quản lý tất cả các giao dịch trên hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 bg-gray-100 p-2 rounded-lg">
              {TABS.map((tab, idx) => (
                <button
                  key={idx}
                  className={cn(
                    "flex-1 py-2 px-4 text-center rounded-md text-sm font-medium transition-colors min-w-[100px]",
                    tab.value === currTab
                      ? "bg-red-600 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  )}
                  onClick={() => {
                    params["tab"] = tab.value;
                    params["page"] = "1";
                    router.push(`?${queryString.stringify(params)}`);
                  }}
                >
                  {tab.title}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingIndicator />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                Không có giao dịch nào phù hợp với bộ lọc.
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
                        Loại Giao Dịch
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Thanh Toán
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Ngày Thực Hiện
                      </TableHead>
                      <TableHead className="font-semibold text-gray-900">
                        Thao Tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tran, i) => (
                      <TableRow
                        key={i}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          {tran.account?.firstName} {tran.account?.lastName}
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-semibold text-white",
                              tran.transactionType.name === "TRADING"
                                ? "bg-orange-500"
                                : tran.transactionType.name === "SELL"
                                ? "bg-blue-500"
                                : "bg-red-600"
                            )}
                          >
                            {tran.transactionType.name === "TRADING"
                              ? "Giao Dịch"
                              : tran.transactionType.name === "SELL"
                              ? "Bán"
                              : "Mua"}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {tran.paymentMethod.name}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {dayjs(tran.date).format("DD/MM/YYYY HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <button
                                className="text-red-600 hover:text-red-700 transition-colors"
                                onClick={() => setTransactionDetail(tran)}
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl rounded-xl">
                              <DialogHeader>
                                <DialogTitle className="text-xl text-gray-900">
                                  Chi Tiết Giao Dịch
                                </DialogTitle>
                              </DialogHeader>
                              <div className="max-h-[60vh] overflow-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="font-semibold text-gray-900">
                                        Người Mua
                                      </TableHead>
                                      <TableHead className="font-semibold text-gray-900">
                                        Loại Giao Dịch
                                      </TableHead>
                                      <TableHead className="font-semibold text-gray-900">
                                        Trạng Thái
                                      </TableHead>
                                      <TableHead className="font-semibold text-gray-900">
                                        Giá
                                      </TableHead>
                                      <TableHead className="font-semibold text-gray-900">
                                        Mã Đặt Hàng
                                      </TableHead>
                                      <TableHead className="font-semibold text-gray-900">
                                        Ngày Giao Dịch
                                      </TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell className="font-medium text-gray-900">
                                        {transactionDetail?.account?.firstName}{" "}
                                        {transactionDetail?.account?.lastName}
                                      </TableCell>
                                      <TableCell>
                                        <span
                                          className={cn(
                                            "px-2 py-1 rounded-full text-xs font-semibold text-white",
                                            transactionDetail?.transactionType
                                              .name === "TRADING"
                                              ? "bg-orange-500"
                                              : transactionDetail
                                                  ?.transactionType.name ===
                                                "SELL"
                                              ? "bg-blue-500"
                                              : "bg-red-600"
                                          )}
                                        >
                                          {transactionDetail?.transactionType
                                            .name === "TRADING"
                                            ? "Giao Dịch"
                                            : transactionDetail?.transactionType
                                                .name === "SELL"
                                            ? "Bán"
                                            : "Mua"}
                                        </span>
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
                                      <TableCell className="text-gray-700">
                                        {formatPriceVND(
                                          transactionDetail?.order
                                            .totalAmount || 0
                                        )}
                                      </TableCell>
                                      <TableCell className="text-gray-700">
                                        {transactionDetail?.orderId || "N/A"}
                                      </TableCell>
                                      <TableCell className="text-gray-700">
                                        {dayjs(transactionDetail?.date).format(
                                          "DD/MM/YYYY HH:mm"
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
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
  { title: "Đang Chờ", value: "0" },
  { title: "Thành Công", value: "1" },
  { title: "Thất Bại", value: "2" },
  { title: "Đã Hủy", value: "3" },
];
