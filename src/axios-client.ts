import axios, { AxiosError } from "axios";
import cookie from "./utils/cookie";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = cookie.get("ACCESS_TOKEN");

    if (accessToken) {
      if (config.headers) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      cookie.delete("ACCESS_TOKEN");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
