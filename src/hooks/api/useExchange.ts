import { ExchangeRequest } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";

export type ExchangeResponse = {
  items: ExchangeRequest[];
  totalPages: number;
};
export type ExchangeRequestApi = {
  inventoryId: string;
  content: string;
};

export type ExchangeFilterRequest = {
  exchangeStatus?: number;
  pageNumber?: number;
  pageSize?: number;
  keyword?: string;
  rarityStatus?: number;
};

export const useCreateExchangeRequest = () => {
  return useApiMutation<ExchangeRequest, ExchangeRequestApi>(
    "/exchange/create-exchange-request",
    "post"
  );
};
export const useGetExchangeRequestById = (exchangeRequestId: string) => {
  return useApiQuery<ExchangeRequest>(
    `/exchange/get-exchange-request-details-by-id/${exchangeRequestId}`
  );
};

export const useGetAllExchangeRequest = () => {
  return useApiMutation<ExchangeResponse, ExchangeFilterRequest>(
    `/exchange/get-all-exchange-request`,
    "post"
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

export const useCancelExchangeRequest = (exchangeId: string) => {
  return useApiMutation<ExchangeRequest, string>(
    `/exchange/cancel-exchange?exchangeId=${exchangeId}`,
    "put"
  );
};
