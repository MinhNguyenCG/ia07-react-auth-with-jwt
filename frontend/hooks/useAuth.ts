import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, saveTokens, clearAuth } from "@/lib/api/auth";
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from "@/types/auth";
import { useRouter } from "next/navigation";
import { extractErrorMessage } from "@/lib/utils/error-handler";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Save tokens
      saveTokens(data.tokens);

      // Set user data in cache
      queryClient.setQueryData(["user"], data.user);

      // Redirect to dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", extractErrorMessage(error));
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      authApi.register(credentials),
    onSuccess: (data: AuthResponse) => {
      // Save tokens
      saveTokens(data.tokens);

      // Set user data in cache
      queryClient.setQueryData(["user"], data.user);

      // Redirect to dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Register error:", extractErrorMessage(error));
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear auth data
      clearAuth();

      // Clear all queries
      queryClient.clear();

      // Redirect to login
      router.push("/login");
    },
    onError: () => {
      // Even if logout fails on server, clear local data
      clearAuth();
      queryClient.clear();
      router.push("/login");
    },
  });

  return {
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
  };
}
