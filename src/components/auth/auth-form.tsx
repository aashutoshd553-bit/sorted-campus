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
      className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Please wait…" : children}
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
        <label className="block text-sm font-semibold text-slate-700">
          Full name
          <input
            name="fullName"
            required
            autoComplete="name"
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/70 px-3.5 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Your name"
          />
        </label>
      )}

      <label className="block text-sm font-semibold text-slate-700">
        College email
        <input
          name="email"
          required
          type="email"
          autoComplete="email"
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/70 px-3.5 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="you@college.edu"
        />
      </label>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-700">Password</label>
          {!isSignup && (
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
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
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/70 px-3.5 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="At least 8 characters"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-700">
          {state.success}
        </p>
      )}

      <SubmitButton>{isSignup ? "Create account" : "Log in"}</SubmitButton>

      <p className="text-center text-sm text-slate-500">
        {isSignup ? "Already have an account?" : "New to SORTED?"}{" "}
        <Link className="font-bold text-blue-600 hover:text-blue-700" href={isSignup ? "/login" : "/signup"}>
          {isSignup ? "Log in" : "Create an account"}
        </Link>
      </p>
    </form>
  );
}
