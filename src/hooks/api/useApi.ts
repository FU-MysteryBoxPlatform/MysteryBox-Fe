import axiosClient from "@/axios-client";
import type { TBaseResponse } from "@/types";
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";

export function useApiQuery<T>(
  url: string,
  options?: UseQueryOptions<TBaseResponse<T>, AxiosError> & {
    pollingInterval?: number;
  }
) {
  return useQuery<TBaseResponse<T>, AxiosError>({
    queryKey: [url],
    queryFn: async () => {
      const response = await axiosClient.get<TBaseResponse<T>>(url);
      return response.data;
    },
    ...options,
    refetchInterval: options?.pollingInterval,
  });
}

export function useApiMutation<T, U>(
  url: string,
  method: "post" | "put" | "patch" | "delete" = "post",
  contentType:
    | "application/json"
    | "multipart/form-data"
    | string = "application/json",
  options?: UseMutationOptions<TBaseResponse<T>, AxiosError, U>
) {
  return useMutation<TBaseResponse<T>, AxiosError, U>({
    mutationFn: async (data) => {
      const response = await axiosClient[method]<TBaseResponse<T>>(url, data, {
        headers: {
          "Content-Type": contentType,
        },
      });
      return response.data;
    },
    ...options,
  });
}
