import { useApiQuery } from "./useApi";

export type DailySalesPercentage = {
  date: string;
  saleNumber: number;
  salePercentage: number;
};

export type Collection = {
  collectionId: string;
  collectionName: string;
  description: string;
  startTime: string;
  totalItem: number;
  isDeleted: boolean;
  isActived: boolean;
  rewards: string;
  imagePath: string;
  endTime: string;
  blindBoxPrice: number;
  discountBlindBoxPrice: number;
};

export type ApiResponse = {
  dailySalesPercentage: DailySalesPercentage[];
  collections: Collection[];
};
export type BlindBoxCollection = {
  collectionId: string;
  collectionName: string;
  description: string;
  startTime: string;
  totalItem: number;
  isDeleted: boolean;
  isActived: boolean;
  rewards: string;
  imagePath: string;
  endTime: string;
  blindBoxPrice: number;
  discountBlindBoxPrice: number;
};

export type StatisticResponse = {
  orderPercentageDifference: number;
  totalSaleProfit: number;
  exchangeProfit: number;
  auctionProfit: number;
  numberOfOrder: number;
  numberOfOrderDifference: number;
  bestBlindBoxList: BlindBoxCollection[];
};

export const useGetStatisticForDashboard = (
  startTime: string,
  endTime: string
) => {
  return useApiQuery<ApiResponse>(
    `statistic/get-statistice-for-dash-board?startTime=${startTime}&endTime=${endTime}`
  );
};

export const useGetStatistic = () => {
  return useApiQuery<StatisticResponse>(`statistic/get-statistic-number`);
};
