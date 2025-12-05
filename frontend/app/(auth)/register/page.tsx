"use client";

import { AuthLayout } from "@/components/AuthLayout";
import { RegisterForm } from "@/components/RegisterForm";
import { useGuestCheck } from "@/hooks/useAuthCheck";

export default function RegisterPage() {
  useGuestCheck();

  return (
    <AuthLayout
      title="Create an account"
      subtitle="Sign up to get started with JWT Auth"
      linkText="Sign in"
      linkHref="/login"
      linkLabel="Already have an account?"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
