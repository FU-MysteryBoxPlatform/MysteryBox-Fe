import { TAccount } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";

export type TUpdateAccountData = {
  accountId: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  dob: string;
  image: string;
  avatar?: string;
  mainRole?: string;
  phoneNumber?: string;
};

type TAccountResponse = {
  items: TAccount[];
  totalPages: number;
};

export const useUpdateAccount = () => {
  return useApiMutation<TAccount, TUpdateAccountData>(
    "/account/update-account",
    "put"
  );
};

export const useGetAllAccount = (
  pageNumber: number,
  pageSize: number,
  keyword?: string
) => {
  return useApiQuery<TAccountResponse>(
    `/account/get-all-account?keyword=${keyword}&pageIndex=${pageNumber}&pageSize=${pageSize}`
  );
};

export const useUpRole = () => {
  return useApiMutation<unknown, { accountId: string; roleName: string }>(
    `/account/up-role`,
    "post"
  );
};
