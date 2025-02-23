import { useApiQuery } from "./useApi";
import { SalesData } from "@/types";

export type TProductSale = {
  name: string;
  description: string;
  price: number;
  discount: number;
  rarityStatus: {
    name: string;
    dropRate: string;
  };
  productStatus: {
    name: string;
  };
  imagePath: string;
  productId?: string;
};

export type TSaleInventory = {
  inventoryId: string;
  product: TProductSale;
  quantity: number;
  account: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
};

export type TSaleDetailData = {
  saleId: string;
  inventoryId: string;
  inventory: TSaleInventory;
  quantitySold: number;
  unitPrice: number;
  saleDate: string;
  saleStatus: {
    name: string;
  };
};

export const useAllSale = (page: number, size: number) => {
  return useApiQuery<SalesData[]>(`/sale/get-all-sale/${page}/${size}`);
};

export const useSaleDetail = (id: string) => {
  return useApiQuery<TSaleDetailData>(`/sale/get-sale-by-id/${id}`);
};
