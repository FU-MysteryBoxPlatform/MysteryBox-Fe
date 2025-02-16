import axiosClient from "@/axios-client";
import { TBaseResponse } from "@/types";
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";

export function useApiQuery<T>(
  url: string,
  options?: UseQueryOptions<AxiosResponse<TBaseResponse<T>>, AxiosError> & {
    pollingInterval?: number;
  }
) {
  return useQuery<AxiosResponse<TBaseResponse<T>>, AxiosError>({
    queryKey: [url],
    queryFn: () => axiosClient.get<TBaseResponse<T>>(url),
    ...options,
    refetchInterval: options?.pollingInterval,
  });
}

export function useApiMutation<T, U>(
  url: string,
  method: "post" | "put" | "patch" | "delete" = "post",
  options?: UseMutationOptions<AxiosResponse<TBaseResponse<T>>, AxiosError, U>
) {
  return useMutation<AxiosResponse<TBaseResponse<T>>, AxiosError, U>({
    mutationFn: (data) => axiosClient[method]<TBaseResponse<T>>(url, data),
    ...options,
  });
}
