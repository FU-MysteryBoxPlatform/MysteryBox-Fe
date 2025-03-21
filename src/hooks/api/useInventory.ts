import { Collection, TAccount, TransferItem } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";
import { Account } from "./useManageSale";
import { TProductSale } from "./useSale";

export interface Inventory {
  inventoryId: string;
  productId: string;
  product: Product;
  quantity: number;
  accountId: string;
  account: Account;
  accquiredDate: string;
  itemStatusId: number;
  itemStatus: ItemStatus;
  imagePath: string;
}

export type TInventoryItem = {
  inventories: Inventory[];
  product: TProductSale;
  collection: Collection;
};

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  isDeleted: boolean;
  rarityStatusId: number;
  rarityStatus: RarityStatus;
  productStatusId: number;
  productStatus: ProductStatus;
  imagePath: string;
}

export interface RarityStatus {
  id: number;
  name: string;
  dropRate: string;
}

export interface ProductStatus {
  id: number;
  name: string;
}

export interface ItemStatus {
  id: number;
  name: string;
}

export type TSellInventory = {
  accountId: string;
  sellerItems: {
    inventoryId: string;
    quantity: number;
    price: number;
  }[];
};

export type TGetInventory = {
  accountId: string;
  pageNumber: number;
  pageSize: number;
  rarityStatus?: string;
  minimumPrice?: string;
  maximumPrice?: string;
  itemStatus?: string;
};
export type TInventoryProductResponse = {
  product: TProductSale;
  inventories: Inventory[];
};

export type TInventoryResponse = {
  account: TAccount;
  listProduct: {
    items: TInventoryItem[];
    totalPages: number;
  };
};

export type TGetAllInventoryResponse = {
  items: Inventory[];
  totalPages: number;
};
export type TGetAllInventoryInCollection = {
  collectionId: string;
  pageNumber: number;
  pageSize: number;
};
export type TGetAllInventoryInCollectionResponse = {
  collection: Collection;
  inventories: Inventory[];
};
export type TransferHistoryResponse = {
  items: TransferItem[];
  totalPages: number;
};

export const useSellInventory = () => {
  return useApiMutation<string, TSellInventory>("/order/sell-item", "post");
};

export const useGetInventory = () => {
  return useApiMutation<TInventoryResponse, TGetInventory>(
    "/inventory/get-list-product-in-inventory",
    "post"
  );
};

export const useGetAllInventory = () => {
  return useApiMutation<TGetAllInventoryResponse, TGetInventory>(
    "/inventory/get-all-item-in-inventory",
    "post"
  );
};

export const useGetInventoryById = (inventoryId: string) => {
  return useApiQuery<TGetAllInventoryResponse>(
    `/inventory/get-item-in-inventory/${inventoryId}`
  );
};

export const useGetListItemInCollection = () => {
  return useApiMutation<
    TGetAllInventoryInCollectionResponse,
    TGetAllInventoryInCollection
  >("/inventory/get-list-item-in-collection", "post");
};

export const useGetHistoryTransferInventoryById = (inventoryId: string) => {
  return useApiQuery<TransferHistoryResponse>(
    `/inventory/get-transfer-history-by-inventory-id/${inventoryId}`
  );
};
