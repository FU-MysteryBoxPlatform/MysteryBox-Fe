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
import { Calendar } from "lucide-react";
import { useGetAllTransactionByAccountId } from "@/hooks/api/useTransactions";
import { GlobalContext } from "@/provider/global-provider";
import { formatDate } from "@/lib/utils";
import LoadingIndicator from "@/app/components/LoadingIndicator";
import Paginator from "@/app/components/Paginator";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

const PaymentHistoryDashboard: React.FC = () => {
  const { user } = useContext(GlobalContext);
  const [statusFilter, setStatusFilter] = useState<string>("0");
 const searchParams = useSearchParams();
  const router = useRouter();
  const params = queryString.parse(searchParams.toString());
  const page = params["page"] || 1;
  // Call API with explicit status values
  const { data: initialData, isPending } = useGetAllTransactionByAccountId(
    user?.id ?? "",
    Number(statusFilter) || 0, // Status (0, 1, 2, 3)
    +page,
    10 // Limit
  );

  const paymentData = initialData?.result.items || [];
  const totalPages = initialData?.result.totalPages || 0;

  // Function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  const getStatusBadge = (status: string | undefined): string => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-200 text-yellow-800";
      case "SUCCESS":
        return "bg-green-200 text-green-800";
      case "FAILED":
        return "bg-red-200 text-red-800";
      case "CANCELLED":
        return "bg-gray-400 text-gray-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Lịch sử giao dịch của {user?.firstName}</CardTitle>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">
              Hiển thị {paymentData.length} giao dịch
            </span>
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value: string) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Pending</SelectItem>
              <SelectItem value="1">Completed</SelectItem>
              <SelectItem value="2">Cancelled</SelectItem>
              <SelectItem value="3">Processing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          {isPending && (
            <div className="w-full flex items-center justify-center mb-10">
              <LoadingIndicator />
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Phương thức thanh toán</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentData.map((payment) => (
                <TableRow key={payment.paymentHistoryId}>
                  <TableCell className="font-mono text-xs">
                    {payment.orderId?.substring(0, 8)}...
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatDate(payment.date)}
                  </TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>{payment.paymentMethod?.name || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusBadge(payment.transationStatus?.name)}
                    >
                      {payment.transationStatus?.name || "UNKNOWN"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {paymentData.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-6 text-gray-500"
                  >
                    No payment records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {paymentData.length > 0 ? (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistoryDashboard;
