"use client";

import { AuthLayout } from "@/components/AuthLayout";
import { LoginForm } from "@/components/LoginForm";
import { useGuestCheck } from "@/hooks/useAuthCheck";

export default function LoginPage() {
  useGuestCheck();

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
      linkText="Sign up for free"
      linkHref="/register"
      linkLabel="Don't have an account?"
    >
      <LoginForm />
    </AuthLayout>
  );
}
