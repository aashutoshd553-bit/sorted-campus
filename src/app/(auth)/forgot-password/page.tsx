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
      className="mt-2 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending link…" : "Send reset link"}
    </button>
  );
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(requestPasswordReset, initialState);

  return (
    <main className="site-canvas grid min-h-screen place-items-center p-5">
      <div className="glass w-full max-w-md rounded-3xl p-7 shadow-2xl shadow-blue-900/10 sm:p-9">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-[-.06em] text-slate-950">
          <span className="grid size-8 place-items-center rounded-xl bg-blue-600 text-sm text-white">S</span>
          SORTED
        </Link>

        <div className="mt-9">
          <p className="text-sm font-bold text-blue-600">Password recovery</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Forgot password?</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter your registered college email and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <form action={formAction} className="mt-8 space-y-4">
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

          <SubmitButton />

          <p className="text-center text-sm text-slate-500">
            Remembered your password?{" "}
            <Link className="font-bold text-blue-600 hover:text-blue-700" href="/login">
              Back to log in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
