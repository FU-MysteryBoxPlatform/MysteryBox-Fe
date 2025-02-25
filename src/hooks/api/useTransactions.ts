import { useApiQuery } from "./useApi";

export const useGetAllTransaction = (
  status: number,
  pageNumber: number,
  pageSize: number
) => {
  return useApiQuery<unknown[]>(
    `/transaction/get-all-transaction/${pageNumber}/${pageSize}?status=${status}`
  );
};
