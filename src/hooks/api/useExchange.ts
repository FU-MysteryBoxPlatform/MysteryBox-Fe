import { ExchangeRequest } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";

export type ExchangeResponse = {
  items: ExchangeRequest[];
  totalPages: number;
};
export const useCreateExchangeRequest = (inventoryId: string) => {
  return useApiMutation<ExchangeRequest, unknown>(
    "/exchange/create-exchange-request?inventoryId=" + inventoryId,
    "post"
  );
};
export const useGetExchangeRequestById = (exchangeRequestId: string) => {
  return useApiQuery<ExchangeRequest>(
    `/exchange/get-exchange-request-details-by-id/${exchangeRequestId}`
  );
};

export const useGetAllExchangeRequest = (
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<ExchangeResponse>(
    `/exchange/get-all-exchange-request/${pageNumber}/${pageSize}`
  );
};

export const useGetAllExchangeRequestByUserId = (
  accountId: string,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<ExchangeResponse>(
    "/exchange/get-all-exchange-requets-by-account/" +
      accountId +
      "/" +
      pageNumber +
      "/" +
      pageSize
  );
};
