import apiClient from "./axios";
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
  AuthTokens,
} from "@/types/auth";
import {
  useAuthStore,
  setRefreshToken,
  removeRefreshToken,
  getRefreshToken,
} from "../stores/auth.store";

export const authApi = {
  /**
   * Register a new user
   */
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      credentials
    );
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await apiClient.post<AuthTokens>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Logout - clear tokens from server
   */
  logout: async (): Promise<void> => {
    const refreshToken = getRefreshToken();

    try {
      await apiClient.post("/auth/logout", {
        refreshToken: refreshToken || undefined,
      });
    } catch (error) {
      // Ignore errors during logout
      console.error("Logout error:", error);
    } finally {
      // Always clear tokens locally
      useAuthStore.getState().clearAccessToken();
      removeRefreshToken();
    }
  },

  /**
   * Get current user info
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },
};

/**
 * Save tokens after login/register
 */
export const saveTokens = (tokens: AuthTokens): void => {
  useAuthStore.getState().setAccessToken(tokens.accessToken);
  setRefreshToken(tokens.refreshToken);
};

/**
 * Clear all auth data
 */
export const clearAuth = (): void => {
  useAuthStore.getState().clearAccessToken();
  removeRefreshToken();
};
