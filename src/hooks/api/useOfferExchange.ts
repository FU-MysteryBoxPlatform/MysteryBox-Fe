import { OfferExchange } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";
export interface OfferExchangeResponse {
  items: OfferExchange[];
  totalPages: number;
}

export interface ConfirmExchage {
  isAccepted: boolean;
  offerId: string;
  paymentMethod: 0;
  returnUrl: string;
}
export const useGetAllOfferByExchangeId = (
  exchangeId: string,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<OfferExchangeResponse>(
    `/offer/get-all-offer-by-exchange-id/${exchangeId}/${pageNumber}/${pageSize}`
  );
};

export const useConfirmAcceptedOfffer = () => {
  return useApiMutation(`/offer/confirm-accepted-offer`, "post");
};

export const useCreateOfferExchange = () => {
  return useApiMutation<
    {
      exchangeId: string;
      inventoryId: string;
      content?: string;
    },
    unknown
  >("/offer/create-offer-exchange", "post");
};
