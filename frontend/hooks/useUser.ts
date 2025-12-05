import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { User } from "@/types/auth";
import { getRefreshToken } from "@/lib/stores/auth.store";

export function useUser() {
  const hasRefreshToken = typeof window !== "undefined" && !!getRefreshToken();

  const query = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => authApi.getMe(),
    enabled: hasRefreshToken, // Only fetch if refresh token exists
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isAuthenticated: !!query.data && !query.isError,
  };
}
