import { Order, PaymentHistory, TAccount } from "@/types";
import { useApiQuery } from "./useApi";

export type TTransaction = {
  paymentHistoryId: string;
  amount: number;
  date: string;
  paidDate: string;
  paymentMethodId: number;
  paymentMethod: PaymentMethod;
  transactionStatusId: number;
  transationStatus: TransationStatus;
  transactionTypeId: number;
  transactionType: TransactionType;
  orderId: string;
  order: Order;
  exchangeRequestId: string;
  auctionId: string;
  auctionHistoryId: string;
  auctionParticipateRequestId: string;
  accountId: string;
  account: TAccount;
  walletTransactionId: string;
};

export interface PaymentMethod {
  id: number;
  name: string;
}

export interface TransationStatus {
  id: number;
  name: string;
}

export interface TransactionType {
  id: number;
  name: string;
}

export type TransactionResponse = {
  items: PaymentHistory[];
  totalPages: number;
};

export const useGetAllTransaction = (
  pageNumber: number,
  pageSize: number,
  status?: number
) => {
  return useApiQuery<{
    items: TTransaction[];
    totalPages: number;
  }>(
    `/transaction/get-all-transaction/${pageNumber}/${pageSize}?status=${status}`
  );
};

export const useGetAllTransactionByAccountId = (
  accountId: string,
  status: number,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<TransactionResponse>(
    `/transaction/get-transaction-by-account-id/${accountId}?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`
  );
};
