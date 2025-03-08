import { Auction, AuctionParticipantRequest } from "@/types";
import { useApiMutation } from "./useApi";

export type GetAuction = {
  keyword?: string;
  startTime?: string;
  endTime?: string;
  status?: number;
  pageNumber: number;
  pageSize: number;
};

export type JoinAuctionRequest = {
  accountId: string;
  auctionId: string;
  paymentMethod: number;
  returnUrl: string;
};

export type GetAuctionResponse = {
  items: Auction[];
  totalItems: number;
  totalPages: number;
};

export type RequestAuctionRequest = {
  inventoryId: string;
  startTime: string;
  endTime: string;
  minimunBid: number;
};
export const useGetAllAuctions = () => {
  return useApiMutation<GetAuctionResponse, GetAuction>(
    "/auction/get-all-auction",
    "post"
  );
};

export const useJoinAuction = () => {
  return useApiMutation<string | AuctionParticipantRequest, JoinAuctionRequest>(
    "/auction/participate-an-auction",
    "post"
  );
};
export const useRequestAuction = () => {
  return useApiMutation<string, RequestAuctionRequest>(
    "/auction/create-auction"
  );
};