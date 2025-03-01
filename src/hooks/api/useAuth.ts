import { TAccount } from "@/types";
import { useApiMutation, useApiQuery } from "./useApi";

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

export type TForgotPasswordData = {
  email: string;
};

export type TResetPasswordData = {
  email: string;
  recoveryCode: string;
  newPassword: string;
};

export type TRegisterOTPData = {
  email: string;
  verifyCode: string;
};

export const useRegister = () => {
  return useApiMutation<TRegisterResponse, TRegisterData>(
    "/account/create-account",
    "post"
  );
};

export const useRegisterOTP = () => {
  return useApiMutation<string, TRegisterOTPData>(
    "/account/active-account",
    "put"
  );
};

export const useLogin = () => {
  return useApiMutation<TLoginResponse, TLoginData>("/account/login", "post");
};

export const useForgotPassword = () => {
  return useApiMutation<TForgotPasswordData, string>(
    "/account/send-email-forgot-password",
    "post"
  );
};

export const useResetPassword = () => {
  return useApiMutation<TResetPasswordData, TResetPasswordData>(
    "/account/forgot-password",
    "put"
  );
};

export const useGetAccountById = (id: string) => {
  return useApiQuery<TAccount>(`/account/get-account-by-user-id/${id}`);
};
