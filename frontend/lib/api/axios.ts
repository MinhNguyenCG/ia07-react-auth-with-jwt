import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  useAuthStore,
  getRefreshToken,
  removeRefreshToken,
} from "../stores/auth.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor - Attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 and refresh token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // If error is not 401 or request has already been retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If already refreshing, queue the request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      // No refresh token available, logout
      isRefreshing = false;
      useAuthStore.getState().clearAccessToken();
      removeRefreshToken();

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(error);
    }

    try {
      // Call refresh token endpoint
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        response.data;

      // Update tokens
      useAuthStore.getState().setAccessToken(newAccessToken);

      if (typeof window !== "undefined") {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      // Update authorization header
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      }

      // Process queued requests
      processQueue(null, newAccessToken);

      // Retry original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh token failed, logout
      processQueue(refreshError as Error, null);

      useAuthStore.getState().clearAccessToken();
      removeRefreshToken();

      // Redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
