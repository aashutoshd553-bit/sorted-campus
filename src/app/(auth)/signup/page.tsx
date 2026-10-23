import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { signup } from "../actions";

export default function SignupPage() {
  return (
    <main className="site-canvas grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="SORTED" className="h-8 w-auto" />
        </Link>

        <div className="mt-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-950">Register Student Account</h1>
          <p className="mt-1 text-xs text-slate-500">
            Join the peer-to-peer marketplace on your campus.
          </p>
        </div>

        <div className="mt-6">
          <AuthForm action={signup} mode="signup" />
        </div>
      </div>
    </main>
  );
}
