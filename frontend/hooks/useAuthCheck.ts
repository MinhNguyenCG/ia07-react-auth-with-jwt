import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRefreshToken } from "@/lib/stores/auth.store";

/**
 * Hook to check if user is authenticated and redirect if not
 */
export function useAuthCheck(redirectTo: string = "/login") {
  const router = useRouter();

  useEffect(() => {
    const hasRefreshToken = getRefreshToken();

    if (!hasRefreshToken) {
      router.push(redirectTo);
    }
  }, [router, redirectTo]);
}

/**
 * Hook to redirect authenticated users away from auth pages
 */
export function useGuestCheck(redirectTo: string = "/dashboard") {
  const router = useRouter();

  useEffect(() => {
    const hasRefreshToken = getRefreshToken();

    if (hasRefreshToken) {
      router.push(redirectTo);
    }
  }, [router, redirectTo]);
}
