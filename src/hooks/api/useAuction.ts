import { Auction, AuctionHistory, AuctionParticipantRequest } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";

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
export type AuctionDetailResponse = {
  auction: Auction;
};

export type GetAuctionHistory = {
  items: AuctionHistory[];
  totalItems: number;
  totalPages: number;
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

export const useGetAuctionById = (id: string) => {
  return useApiQuery<AuctionDetailResponse>(
    `/auction/get-auction-by-details/${id}`
  );
};

export const useGetAllBidByAuctionId = (id: string) => {
  return useApiQuery<GetAuctionHistory>(
    `/auction/get-all-bid-by-auction/${id}/0/0`
  );
};

export const useCreateBid = () => {
  return useApiMutation<
    AuctionHistory,
    { auctionId: string; bidAmount: number; accountId: string }
  >("/auction/create-bid", "post");
};
