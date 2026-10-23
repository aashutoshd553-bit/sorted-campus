"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile, type AuthState } from "@/app/(auth)/actions";

const initialState: AuthState = {};

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

interface ProfileFormProps {
  initialFullName: string;
  initialCity: string | null;
  initialCollegeId: string | null;
  colleges: { id: string; name: string; city: string }[];
}

export function ProfileForm({
  initialFullName,
  initialCity,
  initialCollegeId,
  colleges,
}: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Full Name
          </label>
          <input
            name="fullName"
            defaultValue={initialFullName}
            required
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            City / Location
          </label>
          <input
            name="city"
            defaultValue={initialCity || ""}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="e.g. New Delhi, Pune"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
          College / Campus
        </label>
        {colleges.length > 0 ? (
          <select
            name="collegeId"
            defaultValue={initialCollegeId || ""}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="">Select your college</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.city})
              </option>
            ))}
          </select>
        ) : (
          <div className="mt-1.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-3 text-xs text-slate-500">
            No predefined colleges found yet. You can set your city above.
          </div>
        )}
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-700">
          {state.success}
        </p>
      )}

      <div className="pt-2">
        <SaveButton />
      </div>
    </form>
  );
}
