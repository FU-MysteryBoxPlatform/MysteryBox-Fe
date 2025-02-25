import { Order } from "@/types";
import { useApiQuery } from "./useApi";

export type TOrderResponse = {
  order: Order;
};

export type TOrderDetailResponse = {
  items: Order[];
};

export const useGetAllOrderByAccount = (
  id: string,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<TOrderResponse[]>(
    `/order/get-all-order-by-account-id/${id}/${pageNumber}/${pageSize}`
  );
};

export const useGetOrderById = (id: string) => {
  return useApiQuery<TOrderDetailResponse>(`/order/get-order-detail/${id}`);
};
