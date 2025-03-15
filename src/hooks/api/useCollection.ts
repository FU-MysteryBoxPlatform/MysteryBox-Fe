import { TAccount } from "@/types";
import { useApiQuery } from "./useApi";
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
