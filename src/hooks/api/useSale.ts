import { useApiQuery } from "./useApi";

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

export type TSaleData = {
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

export const useSale = () => {
  return useApiQuery<TSaleData[]>("/sale/get-sale-data");
};

export const useSaleDetail = (id: string) => {
  return useApiQuery<TSaleData[]>(`/sale/get-sale-by-id/${id}`);
};
