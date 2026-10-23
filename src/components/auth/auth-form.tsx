"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { AuthState } from "@/app/(auth)/actions";

const initialState: AuthState = {};

function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Please wait..." : children}
    </button>
  );
}

export function AuthForm({
  action,
  mode,
}: {
  action: (state: AuthState, formData: FormData) => Promise<AuthState>;
  mode: "login" | "signup";
}) {
  const [state, formAction] = useActionState(action, initialState);
  const isSignup = mode === "signup";

  return (
    <form action={formAction} className="space-y-4">
      {isSignup && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          Full Name
          <input
            name="fullName"
            required
            autoComplete="name"
            className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            placeholder="Your name"
          />
        </label>
      )}

      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
        College Email
        <input
          name="email"
          required
          type="email"
          autoComplete="email"
          className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          placeholder="you@college.edu"
        />
      </label>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">Password</label>
          {!isSignup && (
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <input
          name="password"
          required
          type="password"
          minLength={8}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          placeholder="Minimum 8 characters"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-2.5 text-xs font-semibold text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="rounded-md border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-semibold text-emerald-700">
          {state.success}
        </p>
      )}

      <SubmitButton>{isSignup ? "Create Account" : "Log In"}</SubmitButton>

      <p className="text-center text-xs text-slate-500 pt-2">
        {isSignup ? "Already registered?" : "New to SORTED?"}{" "}
        <Link className="font-semibold text-blue-600 hover:text-blue-800" href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
