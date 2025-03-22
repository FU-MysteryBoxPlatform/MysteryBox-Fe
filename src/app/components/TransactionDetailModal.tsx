// components/transaction/TransactionDetailModal.tsx
"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Transaction {
  paymentHistoryId: string;
  amount: number;
  date: string;
  paidDate: string | null;
  paymentMethod: { name: string };
  transationStatus: { name: string };
  transactionType: { name: string };
  orderId: string;
  orderResponse: {
    order: {
      orderId: string;
      orderDate: string;
      totalAmount: number;
      orderType: { name: string };
      paymentMethod: { name: string };
      orderStatus: { name: string };
      account: {
        firstName: string;
        lastName: string;
        email: string;
      };
    };
    orderDetails: Array<{
      collection: {
        collectionName: string;
        description: string;
        imagePath: string;
        discountBlindBoxPrice: number;
      };
      quantity: number;
      unitPrice: number;
    }>;
  };
}

interface TransactionDetailModalProps {
  transaction: Transaction;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const getStatusBadge = (status: string): string => {
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

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chi tiết giao dịch</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao dịch</CardTitle>
              <CardDescription>
                Mã: {transaction.paymentHistoryId}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ngày giao dịch</p>
                  <p className="font-medium">{formatDate(transaction.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số tiền</p>
                  <p className="font-medium">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phương thức</p>
                  <p className="font-medium">
                    {transaction.paymentMethod.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <Badge
                    className={getStatusBadge(
                      transaction.transationStatus.name
                    )}
                  >
                    {transaction.transationStatus.name}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Loại giao dịch</p>
                <p className="font-medium">
                  {transaction.transactionType.name}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông tin đơn hàng</CardTitle>
              <CardDescription>Mã đơn: {transaction.orderId}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Người mua</p>
                  <p className="font-medium">
                    {transaction.orderResponse.order.account.firstName}{" "}
                    {transaction.orderResponse.order.account.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    {transaction.orderResponse.order.account.email}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Sản phẩm</p>
                {transaction.orderResponse.orderDetails.map((detail, index) => (
                  <div key={index} className="mt-2 border-t pt-2">
                    <p className="font-medium">
                      {detail.collection.collectionName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {detail.collection.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm">
                        Số lượng: {detail.quantity} x{" "}
                        {formatCurrency(detail.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailModal;
