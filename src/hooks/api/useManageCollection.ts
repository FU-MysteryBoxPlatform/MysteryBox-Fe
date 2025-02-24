import { useApiMutation, useApiQuery } from "./useApi";
import { TProductSale } from './useSale';

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
  pageNumber: number;
  pageSize: number;
  minimumPrice?: number;
  maximumPrice?: number;
  startTime?: string;
  endTime?: string;
};

export type TCollectionResponse = {
  totalPages: number;
  items: TCollection[];
};

export type TCollectionDetail = {
  collection: TCollection;
  products: TProductSale[];
};
export const useGetCollections = () => {
  return useApiMutation<TCollectionResponse, TCollectionRequest>(
    `collection/get-collection-by-filter`,
    "post"
  );
};

export const useGetCollectionById = (id:string) => {
  return useApiQuery<TCollectionDetail>(
    `collection/get-collection-by-id/${id}`
  );
};
