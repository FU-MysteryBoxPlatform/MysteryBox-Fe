import { useApiMutation, useApiQuery } from "./useApi";
import { TCollection } from "./useManageCollection";
import { TProductSale } from "./useSale";

export type TCollectionDetail = {
  collection: TCollection;
  products: TProductSale[];
};

export type TOpenBlindBoxResponse = {
  product: TProductSale;
  inventoryId: string;
};

export const useGetCollectionDetail = (id: string) => {
  return useApiQuery<TCollectionDetail>(
    `collection/get-collection-by-id/${id}`
  );
};

export const useOpenBlindBox = (id: string) => {
  return useApiMutation<TOpenBlindBoxResponse, unknown>(
    `inventory/open-blind-box?inventoryId=${id}`
  );
};
