import { useApiMutation } from "./useApi";



export type OrderDetail= {
  saleId: string;
  quantity: number;
  note: string;
}

export type OrderRequest = {
  customerId: string;
  blindBoxOrderDetails: {
    collectionId: string;
    quantity: number;
  }[];
  orderDetailDtos: {
    saleId: string;
  }[];
  paymentMethod: number;
  returnUrl: string;
};


export const useCheckOut = () => {
  return useApiMutation<string, OrderRequest>("/order/check-out", "post");
};
export const useUpdateTransaction = (transactionId: string, transactionStatus:number) => {
  return useApiMutation<unknown, unknown>(
    `/transaction/update-transaction-status?transactionId=${transactionId}&transactionStatus=${transactionStatus}`,
    "put"
  );
};