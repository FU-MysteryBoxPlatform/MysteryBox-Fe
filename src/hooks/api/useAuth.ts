import { TAccount } from "@/types";
import { useApiMutation } from "./useApi";

export type TRegisterData = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
};

export type TRegisterResponse = {
  response: string;
};

export type TLoginData = {
  email: string;
  password: string;
};

export type TLoginResponse = {
  mainRole: "COLLECTOR" | "MODERATOR";
  token: string;
  refreshToken: string;
  account: TAccount;
};

export const useRegister = () => {
  return useApiMutation<TRegisterResponse, TRegisterData>(
    "/account/create-account",
    "post"
  );
};

export const useLogin = () => {
  return useApiMutation<TLoginResponse, TLoginData>("/account/login", "post");
};
