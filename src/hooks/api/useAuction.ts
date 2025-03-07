import { Auction } from "@/types";
import { useApiMutation } from "./useApi";

export type GetAuction = {
  keyword?: string;
  startTime?: string;
  endTime?: string;
  status?: number;
  pageNumber: number;
  pageSize: number;
};

export type GetAuctionResponse = {
    items: Auction[];
    totalItems: number;
    totalPages: number;
    };

export const useGetAllAuctions = () => {
  return useApiMutation<GetAuctionResponse, GetAuction>(
    "/auction/get-all-auction",
    "post"
  );
};
