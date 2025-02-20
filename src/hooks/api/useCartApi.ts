import { useApiMutation } from "./useApi";



export type OrderDetail= {
  saleId: string;
  quantity: number;
  note: string;
}

export type Order= {
  customerId: string;
  paymentMethod: number;
  note: string;
  orderDetailDtos: OrderDetail[];
  returnUrl: string;
}


export const useCheckOut = () => {
  return useApiMutation<string, Order>(
    "/order/buying-item-from-collector",
    "post"
  );
};
