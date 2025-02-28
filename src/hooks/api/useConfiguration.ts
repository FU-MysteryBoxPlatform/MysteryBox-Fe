import { useApiMutation, useApiQuery } from "./useApi";

export type TConfiguration = {
  configurationId: string;
  name: string;
  vietnameseName: string;
  currentValue: string;
  unit: {
    id: string;
    name: string;
  };
};

export type TConfigurationResponse = {
  totalPages: number;
  items: TConfiguration[];
};

export type TUpdateConfiguration = {
  configurationId: string;
  name?: string;
  vietnameseName?: string;
  currentValue?: string;
  unit?: number;
};

export const useGetConfigurations = (pageNumber: number, pageSize: number) => {
  return useApiQuery<TConfigurationResponse>(
    `configuration/get-all-configuration/${pageNumber}/${pageSize}`
  );
};

export const useUpdateConfiguration = () => {
  return useApiMutation<TConfiguration, TUpdateConfiguration>(
    `configuration/update-configuration`,
    "put"
  );
};
