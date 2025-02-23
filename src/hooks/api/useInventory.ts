import { TAccount } from "@/types";
import { useApiMutation } from "./useApi";
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
}

export type TInventoryItem = {
  inventories: Inventory[];
  product: TProductSale;
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

export const useSellInventory = () => {
  return useApiMutation<string, TSellInventory>("/order/sell-item", "post");
};

export const useGetInventory = () => {
  return useApiMutation<TInventoryResponse, TGetInventory>(
    "/inventory/get-list-product-in-inventory",
    "post"
  );
};
