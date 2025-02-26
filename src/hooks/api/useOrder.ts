import { Order, OrderDetail } from "@/types";
import { useApiQuery } from "./useApi";

export type OrderEntity = {
  order: Order;
};
export type TOrderResponse = {
  items: OrderEntity[];
};

export type TOrderDetailResponse = {
  items: OrderDetail[];
};
export const useGetAllOrderByAccount = (
  id: string,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<TOrderResponse>(
    `/order/get-all-order-by-account-id/${id}/${pageNumber}/${pageSize}`
  );
};

export const useGetOrderDetail = (id: string) => {
  return useApiQuery<TOrderDetailResponse>(`/order/get-order-detail/${id}`);
};
