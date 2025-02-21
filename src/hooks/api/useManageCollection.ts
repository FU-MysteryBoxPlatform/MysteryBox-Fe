import { useApiMutation } from "./useApi";

export type TCollection = {
  collectionId: string;
  collectionName: string;
  description: string;
  startTime: string;
  totalItem: number;
  isDeleted: boolean;
  isActived: boolean;
  rewards: string;
  imagePath: string;
  endTime: string;
  blindBoxPrice: number;
  discountBlindBoxPrice: number;
};

export type TCollectionRequest = {
  keyword?: string;
  minimumPrice?: number;
  maximumPrice?: number;
  startTime?: string;
  endTime?: string;
};

export type TCollectionResponse = {
  totalPages: number;
  items: TCollection[];
};

export const useGetCollections = (pageNumber: number, pageSize: number) => {
  return useApiMutation<TCollectionResponse, TCollectionRequest>(
    `collection/get-collection-by-filter?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    "post"
  );
};
