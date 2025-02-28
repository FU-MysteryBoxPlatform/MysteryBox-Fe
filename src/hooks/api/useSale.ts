import { useApiQuery } from "./useApi";
import { SalesData, TAccount } from "@/types";

export type TProductSale = {
  name: string;
  description: string;
  price: number;
  discount: number;
  rarityStatus: {
    id?: number;
    name: string;
    dropRate: string;
  };
  productStatus: {
    id?: number;
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
  totalAmount: number;
  totalFee: number;
  saleDate: string;
  saleStatus: {
    name: string;
  };
  createDate: string;
  updateDate: string;
  createByAccount: TAccount;
  updateByAccount: TAccount;
};
export type TSaleResponse = {
  items: TSaleDetailData[];
  totalPages: number;
};

export const useAllSale = (page: number, size: number) => {
  return useApiQuery<SalesData[]>(`/sale/get-all-sale/${page}/${size}`);
};

export const useSaleDetail = (id: string) => {
  return useApiQuery<TSaleDetailData>(`/sale/get-sale-by-id/${id}`);
};

export const useAllSaleByAccountId = (
  accountId: string,
  page: number,
  size: number
) => {
  return useApiQuery<TSaleResponse>(
    `/sale/get-sale-by-create-by-account-id/${accountId}/${page}/${size}`
  );
};
