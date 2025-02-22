import { useApiMutation } from "./useApi";
import { Account } from "./useManageSale";

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
}

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
    productId: string;
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

export type TInventoryResponse = {
  totalPages: number;
  items: Inventory[];
};

export const useSellInventory = () => {
  return useApiMutation<string, TSellInventory>("/order/sell-item", "post");
};

export const useGetInventory = () => {
  return useApiMutation<TInventoryResponse, TGetInventory>(
    "/inventory/get-all-item-in-inventory",
    "post"
  );
};
