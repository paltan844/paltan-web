/*
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "./config";
import { refresh_tokens } from "./authService";

type AppAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const appAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/* ================= REQUEST INTERCEPTOR ================= /
appAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as any;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {

  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

appAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AppAxiosRequestConfig;
    const status = error.response?.status;

    if (!error.response) {
      alert("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: unknown) => {

              if (typeof token === "string") {
                originalRequest.headers = {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${token}`,
                } as any;
              }
              resolve(appAxios(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const newAccessToken = await refresh_tokens();

        if (!newAccessToken) throw new Error("Refresh failed");
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        } as any;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return appAxios(originalRequest);
      } catch (err) {

        processQueue(err, null);
        isRefreshing = false;

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        window.location.href = "/customerlogin";
        return Promise.reject(err);
      }
    }

    const backendMessage =
      (error.response.data as any)?.message || "Something went wrong";
    alert(backendMessage);

    return Promise.reject(error);
  }
);
*/

import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "./config";
import { refresh_tokens } from "./authService";

type AppAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const appAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/* ================= REQUEST INTERCEPTOR ================= */
appAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      } as any;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {

  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

appAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AppAxiosRequestConfig;
    const status = error.response?.status;

    if (!error.response) {
      alert("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: unknown) => {

              if (typeof token === "string") {
                originalRequest.headers = {
                  ...originalRequest.headers,
                  Authorization: `Bearer ${token}`,
                } as any;
              }
              resolve(appAxios(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;
      try {
        const newAccessToken = await refresh_tokens();

        if (!newAccessToken) throw new Error("Refresh failed");
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        } as any;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return appAxios(originalRequest);
      } catch (err) {

        processQueue(err, null);
        isRefreshing = false;

      //  localStorage.removeItem("accessToken");
      //  localStorage.removeItem("refreshToken");
       // localStorage.removeItem("user");

     //   window.location.href = "/customerlogin";
        return Promise.reject(err);
      }
    }

    const backendMessage =
      (error.response.data as any)?.message || "Something went wrong";
    alert(backendMessage);

    return Promise.reject(error);
  }
);

