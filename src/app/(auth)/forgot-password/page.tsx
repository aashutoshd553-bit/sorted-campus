"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { requestPasswordReset, type AuthState } from "../actions";

const initialState: AuthState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending link..." : "Send Reset Link"}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <main className="site-canvas grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="SORTED" className="h-8 w-auto" />
        </Link>

        <div className="mt-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-950">Reset Password</h1>
          <p className="mt-1 text-xs text-slate-500">
            Enter your college email address to receive recovery instructions.
          </p>
        </div>

        <form action={formAction} className="mt-6 space-y-4">
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

          <SubmitButton />

          <p className="text-center text-xs text-slate-500 pt-2">
            Remembered your password?{" "}
            <Link className="font-semibold text-blue-600 hover:text-blue-800" href="/login">
              Back to log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
