import { useApiMutation } from "./useApi";

export type TSellInventory = {
  accountId: string;
  sellerItems: {
    productId: string;
    quantity: number;
    price: number;
  }[];
};

export const useSellInventory = () => {
  return useApiMutation<string, TSellInventory>("/order/sell-item", "post");
};
