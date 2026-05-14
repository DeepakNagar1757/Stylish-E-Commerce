import axios, { AxiosError } from "axios";
import apiClient from "./apiClient";
import { useAuthStore } from "../Store/authStore";
import { formatApiError, logError } from "./errorHandler";
import { ENDPOINTS } from "./endpoints";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    logError(formatApiError(error), "Request");
    return Promise.reject(error);
  },
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      try {
        console.log("Attempting to refresh token...");
        const response = await axios.post(
          `${apiClient.defaults.baseURL}${ENDPOINTS.AUTH.REFRESH}`,
          { refreshToken },
        );

        const { token } = response.data;
        console.log("Token refreshed successfully");

        await useAuthStore.getState().updateToken(token);

        processQueue(null, token);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        console.error("Token refresh failed:", refreshError?.response?.data || refreshError.message);
        processQueue(refreshError, null);
        isRefreshing = false;
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    const apiError = formatApiError(error);
    logError(apiError, "Response");
    
    // For non-401 errors, or if refresh failed, reject
    return Promise.reject(apiError);
  },
);
