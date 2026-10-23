"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { resetPassword, type AuthState } from "../actions";

const initialState: AuthState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Updating..." : "Update Password"}
    </button>
  );
}

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState(resetPassword, initialState);

  return (
    <main className="site-canvas grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
          <span className="flex size-7 items-center justify-center rounded bg-slate-950 text-xs font-bold text-white">
            S
          </span>
          SORTED
        </Link>

        <div className="mt-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-950">Set New Password</h1>
          <p className="mt-1 text-xs text-slate-500">
            Choose a strong password with at least 8 characters.
          </p>
        </div>

        <form action={formAction} className="mt-6 space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            New Password
            <input
              name="password"
              required
              type="password"
              minLength={8}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              placeholder="Minimum 8 characters"
            />
          </label>

          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Confirm Password
            <input
              name="confirmPassword"
              required
              type="password"
              minLength={8}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              placeholder="Repeat your password"
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
        </form>
      </div>
    </main>
  );
}
