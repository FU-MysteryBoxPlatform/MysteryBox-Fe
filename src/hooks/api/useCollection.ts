import { Collection, Product, TAccount } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";
import { TCollection } from "./useManageCollection";
import { TProductSale } from "./useSale";

export type TCollectionProgress = {
  userCollecitonProgressId: string;
  isCompleted: boolean;
  completionDate: string;
  account: TAccount;
  updateDate: string;
  progress: number;
  collectionId: string;
  collection: TCollection;
};

export type TCollectionProgressDetail = {
  userCollectionProgress: TCollectionProgress;
  products: TProductSale[];
};

export type TCollectionProgressResponse = {
  totalPages: number;
  items: TCollectionProgressDetail[];
};

export type UserCollectionProgress = {
  userCollecitonProgressId: string;
  isCompleted: boolean;
  completionDate: string;
  accountId: string;
  updateDate: string;
  progress: number; // Tiến trình (có thể là phần trăm hoặc số bước)
  collectionId: string;
  collection: Collection;
  isRewardClaimed: boolean;
};

export type RewardResponse = {
  collection: Collection;
  userCollectionProgress: UserCollectionProgress;
};
export type GetProductPayload = {
  keyword?: string;
  rarityStatus?: number;
  productStatus?: number;
  pageNumber?: number;
  pageSize?: number;
};
export type GetProductResponse = {
  items: Product[];
  totalPages: number;
};
type ProductResponse = {
  product: Product;
  salesDataPoints: Array<{
    date: string;
    unitPrice: number;
  }>;
};
export const useGetUserCollection = (
  id: string,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<TCollectionProgressResponse>(
    `progress/get-all-user-collection-progress-by-account/${id}/${pageNumber}/${pageSize}`
  );
};

export const useGetCollectionProgressById = (id: string) => {
  return useApiQuery<TCollectionProgressDetail>(
    `progress/get-user-collection-progress-by-id/${id}`
  );
};

export const useGetCollectionRewardById = (id: string, userId: string) => {
  return useApiQuery<RewardResponse>(
    `/collection/get-collection-reward-by-id/${id}/${userId}`
  );
};
export const useGetAllProduct = () => {
  return useApiMutation<GetProductResponse, GetProductPayload>(
    `/collection/get-all-product`
  );
};
export const useGetProductById = (id: string) => {
  return useApiQuery<ProductResponse>(`collection/get-product-detail/${id}`);
};
