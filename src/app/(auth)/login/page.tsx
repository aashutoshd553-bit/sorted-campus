import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { login } from "../actions";

export default function LoginPage() {
  return <main className="site-canvas grid min-h-screen place-items-center p-5"><div className="glass w-full max-w-md rounded-3xl p-7 shadow-2xl shadow-blue-900/10 sm:p-9"><Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-[-.06em] text-slate-950"><span className="grid size-8 place-items-center rounded-xl bg-blue-600 text-sm text-white">S</span>SORTED</Link><div className="mt-9"><p className="text-sm font-bold text-blue-600">Welcome back</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">Log in to your account</h1><p className="mt-3 text-sm leading-6 text-slate-600">Continue buying and selling within your student community.</p></div><div className="mt-8"><AuthForm action={login} mode="login" /></div></div></main>;
}
