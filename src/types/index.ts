export type TBaseResponse<T> = {
  result: T;
  isSuccess: boolean;
  message: string[];
};
