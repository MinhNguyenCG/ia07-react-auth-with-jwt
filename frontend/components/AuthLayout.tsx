import Link from "next/link";
import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
  linkLabel: string;
}

export function AuthLayout({
  children,
  title,
  subtitle,
  linkText,
  linkHref,
  linkLabel,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Decorative / Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 text-white">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-600 to-blue-900 opacity-90" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay opacity-20" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          <div className="flex items-center gap-2 text-lg font-medium">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            JWT Auth System
          </div>

          <div className="space-y-6">
            <blockquote className="space-y-2 text-lg">
              <p className="text-lg text-zinc-200">
                &ldquo;This authentication system demonstrates a secure,
                scalable, and production-ready implementation using NestJS and
                Next.js.&rdquo;
              </p>
              <footer className="text-sm text-zinc-400">
                Authentication Demo Project
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center bg-white px-8 py-12 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {subtitle}{" "}
              <Link
                href={linkHref}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                {linkText}
              </Link>
            </p>
          </div>

          {children}

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Protected by industry standard encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
}
