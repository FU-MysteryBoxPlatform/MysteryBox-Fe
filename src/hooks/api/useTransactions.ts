import { PaymentHistory } from "@/types";
import { useApiQuery } from "./useApi";

export type TransactionResponse = {
  items: PaymentHistory[];
  totalPages: number;
};

export const useGetAllTransaction = (
  status: number,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<unknown[]>(
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
