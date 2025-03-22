import { TAccount } from "@/types";
import { useApiMutation } from "./useApi";

export type GetAllReportReq = {
  accountId?: string;
  reportStatus?: number;
  pageNumber: number;
  pageSize: number;
};

export type UpdateStatusReportReq = {
  accountId: string;
  reportId: string;
  reportStatus: number;
};

export type TReport = {
  reportId: string;
  createByAccount: TAccount;
  saleAccount: TAccount;
  reason: string;
  reportStatusId: number;
  createDate: string;
};

export type TReportResponse = {
  items: TReport[];
  totalPages: number;
};

export const useGetAllReport = () => {
  return useApiMutation<TReportResponse, GetAllReportReq>(
    "/report/get-all-report",
    "post"
  );
};

export const useUpdateStatusReport = () => {
  return useApiMutation<unknown, UpdateStatusReportReq>(
    "/report/update-report",
    "put"
  );
};
