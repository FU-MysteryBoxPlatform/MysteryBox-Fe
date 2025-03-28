import { TAccount } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";
import { TCollectionProgress } from "./useCollection";
import { TProductSale } from "./useSale";

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

export type TCollectionWithProgress = {
  collection: TCollection;
  userCollectionProgress: TCollectionProgress;
};

export type TCollectionRequest = {
  keyword?: string;
  pageNumber: number;
  pageSize: number;
  minimumPrice?: number;
  maximumPrice?: number;
  startTime?: string;
  endTime?: string;
  accountId?: string;
};

export type TCollectionResponse = {
  totalPages: number;
  items: TCollectionWithProgress[];
};

export type TRating = {
  content: string;
  createDate: string;
  createByAccount: TAccount;
  point: number;
};

export type TCollectionDetail = {
  collection: TCollection;
  collectionImage: { path: string }[];
  products: TProductSale[];
  ratings: TRating[];
};

export type TCreateCollection = {
  collectionName: string;
  description: string;
  startTime: string;
  endTime: string;
  rewards: string;
  blindBoxPrice: number;
  totalItem: number;
  discountBlindBoxPrice: number;
  productDtos: {
    name: string;
    description: string;
    price: number;
    discount: number;
    rarityStatusId: number;
    productStatusId: number;
    imagePath: string;
  }[];
  listImage: string[];
};

export type TUpdateCollection = {
  collectionId: string;
  collectionName?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  isDeleted?: boolean;
  isActived?: boolean;
  rewards?: string;
  blindBoxPrice?: number;
  discountBlindBoxPrice?: number;
  imagePath?: string;
  updateProductDtos?: {
    productId?: string;
    name?: string;
    description?: string;
    price?: number;
    discount?: number;
    rarityStatusId?: number;
    productStatusId?: number;
    imagePath?: string;
  }[];
};

export const useGetCollections = () => {
  return useApiMutation<TCollectionResponse, TCollectionRequest>(
    `collection/get-collection-by-filter`,
    "post"
  );
};

export const useGetCollectionById = (id: string) => {
  return useApiQuery<TCollectionDetail>(
    `collection/get-collection-by-id/${id}`
  );
};

export const useCreateCollection = () => {
  return useApiMutation<TCollection, TCreateCollection>(
    `collection/create-new-collection`,
    "post"
  );
};

export const useUpdateCollection = () => {
  return useApiMutation<TCollection, TUpdateCollection>(
    `collection/update-collection-by-id`,
    "put"
  );
};

export const useDeleteCollection = (id: string) => {
  return useApiMutation<TCollection, string>(
    `collection/delete-colleciton?collectionId=${id}`,
    "delete"
  );
};
