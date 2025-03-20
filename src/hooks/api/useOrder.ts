import { Order, OrderDetail } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";
import { Collection } from "./useManageSale";
import { Inventory } from "./useInventory";

export type TOrderDetail = {
  orderDetailId: string;
  inventoryId?: string;
  inventory?: Inventory;
  collectionId?: string;
  collection?: Collection;
  orderId: string;
  quantity: number;
  unitPrice: number;
  note: string;
  order: Order;
};

export type TOrder = {
  order: Order;
  orderDetails: TOrderDetail[];
};

export type OrderEntity = {
  order: Order;
};
export type TOrderResponse = {
  items: OrderEntity[];
  totalPages: number;
};

export type TOrderDetailResponse = {
  items: OrderDetail[];
};

export type TAdminOrderRequest = {
  email?: string;
  startTime?: string;
  endTime?: string;
  orderType: number;
  orderStatus: number;
  pageNumber: number;
  pageSize: number;
};

export type TAdminOrderResponse = {
  items: TOrder[];
  totalPages: number;
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

export const useGetAdminOrders = () => {
  return useApiMutation<TAdminOrderResponse, TAdminOrderRequest>(
    `order/get-all-order-by-filter`,
    "post"
  );
};

export const useGetAdminOrderDetail = (id: string) => {
  return useApiQuery<{
    items: TOrderDetail[];
    totalPages: number;
  }>(`/order/get-order-detail/${id}`);
};
