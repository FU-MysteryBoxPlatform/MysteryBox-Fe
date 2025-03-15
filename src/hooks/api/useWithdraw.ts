import { PaymentMethod, TAccount } from "@/types";
import { useApiMutation } from "./useApi";

export type TWithdrawDetail = {
  walletTransactionId: string;
  notificationMessageId: string;
  amount: number;
  walletTransactionTypeId: number;
  walletTransactionType: {
    id: number;
    name: string;
  };
  timeStamp: string;
  walletTransactionStatusId: number;
  walletTransactionStatus: {
    id: number;
    name: string;
  };
  walletId: string;
  wallet: TWallet;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
};

export type TWallet = {
  walletId: string;
  balance: number;
  lastTransactionDate: string;
  createdAt: string;
  lastUpdatedAt: string;
  isLocked: boolean;
  accountId: string;
  account: TAccount;
};

export type TGetAllWithdrawRequest = {
  accountId: string;
  walletTransactionType: number;
  startTime?: string;
  endTime?: string;
  status?: number;
  pageNumber: number;
  pageSize: number;
};

export type TWithdrawResponse = {
  items: TWithdrawDetail[];
  totalPages: number;
};

export const useGetAllWithdraw = () => {
  return useApiMutation<TWithdrawResponse, TGetAllWithdrawRequest>(
    "/wallet/get-all-wallet-transaction-with-filter",
    "post"
  );
};
