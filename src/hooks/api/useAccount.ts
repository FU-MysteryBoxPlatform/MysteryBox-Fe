import { TAccount } from "@/types";
import { useApiMutation } from "./useApi";

export type TUpdateAccountData = {
  accountId: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  dob: string;
  image: string;
};

export const useUpdateAccount = () => {
  return useApiMutation<TAccount, TUpdateAccountData>(
    "/account/update-account",
    "put"
  );
};
