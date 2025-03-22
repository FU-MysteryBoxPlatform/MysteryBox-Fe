import {
  Auction,
  AuctionHistory,
  AuctionParticipantRequest,
  AuctionRequest,
  TAccount,
} from "@/types";
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
  startDate: string;
  endDate: string;
  minimumBid: number;
  accountId: string;
};

export type TAuctionParticipant = {
  auctionParticipantRequestId: string;
  createByAccount: TAccount;
  statusId: number;
  createDate: string;
};

export type AuctionDetailResponse = {
  auction: Auction;
  auctionParticipantRequests: TAuctionParticipant[];
};

export type GetAuctionHistory = {
  items: AuctionHistory[];
  totalItems: number;
  totalPages: number;
};

export type GetAuctionParticipantRequest = {
  accountId: string;
  auctionId: string;
};

export type ApproveAuctionRequest = {
  accountId: string;
  auctionRequestId: string;
};

export type GetAllAuctionRequest = {
  items: AuctionRequest[];
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
    "/auction/create-auction-request"
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

export const getAllAuctionParticipant = () => {
  return useApiMutation<unknown, GetAuctionParticipantRequest>(
    "/auction/get-auction-participant-request",
    "post"
  );
};

export const useApproveAuctionRequest = () => {
  return useApiMutation<unknown, ApproveAuctionRequest>(
    "/auction/approved-auction-request",
    "put"
  );
};

export const useGetAllAuctionRequest = (
  pageNumber: number,
  pageSize: number,
  status: number
) => {
  return useApiQuery<GetAllAuctionRequest>(
    `/auction/get-all-auction-request?pageNumber=${pageNumber}&pageSize=${pageSize}&status=${status}`
  );
};
