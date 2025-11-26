
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { BASE_URL } from "./config";
import { refresh_tokens } from "./authService";

// 👉 Optional: type extend to add _retry flag
type AppAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const appAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/* ---------------- REQUEST INTERCEPTOR ---------------- */
appAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      // axios v1 style header set
      if (config.headers && typeof (config.headers as any).set === "function") {
        (config.headers as any).set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        } as any;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/* ---------------- RESPONSE INTERCEPTOR ---------------- */

// global flag so multiple 401s ek hi refresh call use karein (optional simple guard)
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  failedQueue = [];
};

appAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AppAxiosRequestConfig;

    // ❌ No response at all (network error, etc)
    if (!error.response) {
      alert("Network error. Please check your connection.");
      return Promise.reject(error);
    }

    const status = error.response.status;

    // ✅ Handle 401 (unauthorized) with refresh token logic
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: unknown) => {
              if (typeof token === "string") {
                // attach new token and retry
                if (
                  originalRequest.headers &&
                  typeof (originalRequest.headers as any).set === "function"
                ) {
                  (originalRequest.headers as any).set(
                    "Authorization",
                    `Bearer ${token}`
                  );
                } else {
                  originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${token}`,
                  } as any;
                }
              }
              resolve(appAxios(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        // 🔁 Call your refresh_tokens() function
        const newAccessToken = await refresh_tokens();

        if (newAccessToken) {
          // ⭐ IMPORTANT: Save token globally
          localStorage.setItem("accessToken", newAccessToken);

          // Update header for this original request
          if (
            originalRequest.headers &&
            typeof (originalRequest.headers as any).set === "function"
          ) {
            (originalRequest.headers as any).set(
              "Authorization",
              `Bearer ${newAccessToken}`
            );
          } else {
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            } as any;
          }

          processQueue(null, newAccessToken);
          isRefreshing = false;

          // Retry original request
          return appAxios(originalRequest);
        } else {
          // refresh_tokens ne kuch nahi diya → logout
          processQueue(new Error("No new token"), null);
          isRefreshing = false;
        }
      } catch (err) {
        console.warn("🔴 Token refresh failed:", err);
        processQueue(err, null);
        isRefreshing = false;
      }

      // Agar yaha tak aa gaye → refresh fail ho gaya
      // 🔒 Clean logout:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      if (window?.location) {
        // Apne route ke hisab se change kar sakte ho
        window.location.href = "/customerlogin";
      } else {
        alert("Session expired. Please login again.");
      }

      return Promise.reject(error);
    }

    // Baaki non-401 errors ke लिए normal alert
    const message =
      (error.response?.data as any)?.message || "Something went wrong";
    alert(message);

    return Promise.reject(error);
  }
);
