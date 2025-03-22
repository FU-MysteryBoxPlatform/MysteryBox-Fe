"use client";
import React, { useState, useContext } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, RefreshCw } from "lucide-react";
import {
  useGetAllTransactionByAccountId,
  useReCharge,
} from "@/hooks/api/useTransactions";
import { GlobalContext } from "@/provider/global-provider";
import { formatDate } from "@/lib/utils";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TransactionDetail from "@/app/management/(moderator)/manage-transaction/components/TransactionDetail";

const PaymentHistoryDashboard: React.FC = () => {
  const { user } = useContext(GlobalContext);
  const [statusFilter, setStatusFilter] = useState<string>("0");
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;

  const [paymentHistoryId, setPaymentHistoryId] = useState("");

  const {
    data: initialData,
    isPending,
    refetch,
  } = useGetAllTransactionByAccountId(
    user?.id ?? "",
    Number(statusFilter) || 0,
    +page,
    10
  );

  const paymentData = initialData?.result.items || [];
  const totalPages = initialData?.result.totalPages || 0;
  const { mutateAsync: reCharge } = useReCharge();
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string | undefined): string => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "SUCCESS":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRetryPayment = async (paymentId: string) => {
    // Logic xử lý retry payment ở đây
    console.log(`Retrying payment for ${paymentId}`);
    // Ví dụ: router.push(`/retry-payment/${paymentId}`);
    reCharge(
      {
        returnUrl: `${window.location.host}`.includes("localhost")
          ? `http://${window.location.host}/payment`
          : `https://${window.location.host}/payment`,
        transactionId: paymentId,
      },
      {
        onSuccess: (data) => {
          if (data.isSuccess) {
            toast({
              title: "Đã thử lại giao dịch thành công",
            });
            if (data.result != null) {
              window.location.href = data.result;
            }
          } else {
            toast({
              title: "Thử lại giao dịch thất bại",
              description: data.messages[0],
            });
          }
        },
      }
    );
    await refetch();
  };

  const handleViewDetail = (paymentId: string) => {
    setPaymentHistoryId(paymentId);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-lg">
      <Card className="w-full border-none ">
        <CardHeader className="bg-white p-6 flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Lịch sử giao dịch của {user?.firstName}
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-600">
                Hiển thị {paymentData.length} giao dịch
              </span>
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value: string) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-40 bg-white">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                <SelectItem value="0" className="text-gray-700">
                  Đang chờ
                </SelectItem>
                <SelectItem value="1" className="text-gray-700">
                  Hoàn tất
                </SelectItem>
                <SelectItem value="2" className="text-gray-700">
                  Đã hủy
                </SelectItem>
                <SelectItem value="3" className="text-gray-700">
                  Đang xử lý
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            {isPending ? (
              <div className="w-full flex items-center justify-center py-12">
                <LoadingIndicator />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="">
                      <TableHead className="text-gray-900 font-semibold">
                        Mã giao dịch
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Ngày giao dịch
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Tổng tiền
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Loại giao dịch
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Phương thức
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Trạng thái
                      </TableHead>
                      <TableHead className="text-gray-900 font-semibold">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentData.map((payment) => (
                      <TableRow
                        key={payment.paymentHistoryId}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <TableCell className="font-mono text-sm text-gray-700">
                          {payment.paymentHistoryId?.substring(0, 8)}...
                        </TableCell>
                        <TableCell className="font-medium text-gray-700">
                          {formatDate(payment.date)}
                        </TableCell>
                        <TableCell className="text-gray-900 font-semibold">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                        <TableCell className="text-gray-900 font-semibold">
                          {payment.transactionType.name}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {payment.paymentMethod?.name || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${getStatusBadge(
                              payment.transationStatus?.name
                            )} px-2 py-1`}
                          >
                            {payment.transationStatus?.name || "UNKNOWN"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {payment.transationStatus?.name === "PENDING" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRetryPayment(payment.paymentHistoryId)
                                }
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  className="text-red-600 hover:text-red-700 transition-colors"
                                  onClick={() =>
                                    handleViewDetail(payment.paymentHistoryId)
                                  }
                                >
                                  <Eye className="h-5 w-5" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[80vw] rounded-xl">
                                <DialogHeader>
                                  <DialogTitle className="text-xl text-gray-900">
                                    Chi Tiết Giao Dịch
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="max-h-[60vh] overflow-auto">
                                  <TransactionDetail
                                    paymentHistoryId={paymentHistoryId}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {paymentData.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-gray-500"
                        >
                          Không tìm thấy giao dịch nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                {paymentData.length > 0 && (
                  <div className="mt-6 flex justify-center">
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
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistoryDashboard;
