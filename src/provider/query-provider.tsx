"use client";
import { FC, ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
  children: ReactNode;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const QueryProvider: FC<Props> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
