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
  accessToken: string;
  refreshToken: string;
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
