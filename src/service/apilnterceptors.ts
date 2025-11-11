
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "./config";
import { refresh_tokens } from "./authService";


export const appAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});


appAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        (config.headers as any) = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
appAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refresh_tokens();
        if (newAccessToken && error.config) {
          const originalRequest = error.config as InternalAxiosRequestConfig;

          if (originalRequest.headers && typeof originalRequest.headers.set === "function") {
            originalRequest.headers.set("Authorization", `Bearer ${newAccessToken}`);
          } else {
            (originalRequest.headers as any) = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };
          }

          return appAxios(originalRequest);
        }
      } catch (err) {
        console.warn("Token refresh failed:", err);
      }
    }

    alert((error.response?.data as any)?.message || "Something went wrong");
    return Promise.reject(error);
  }
);
