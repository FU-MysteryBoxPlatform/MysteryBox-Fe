import { Order, OrderDetail } from "@/types";
import { useApiQuery } from "./useApi";

export type TOrderResponse = {
    order: Order;

}

export const useGetAllOrderByAccount = (id: string, pageNumber:number,pageSize:number) => {
  return useApiQuery<TOrderResponse[]>(
    `/order/get-all-order-by-account-id/${id}/${pageNumber}/${pageSize}`
  );
};

export const useGetOrderDetail = (id: string) => {
  return useApiQuery<OrderDetail[]>(`/order/get-order-detail/${id}`);
};