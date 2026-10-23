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
      className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving changes..." : "Save changes"}
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
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Full Name
          </label>
          <input
            name="fullName"
            defaultValue={initialFullName}
            required
            className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            City / Location
          </label>
          <input
            name="city"
            defaultValue={initialCity || ""}
            className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            placeholder="e.g. New Delhi, Pune"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
          College Campus
        </label>
        {colleges.length > 0 ? (
          <select
            name="collegeId"
            defaultValue={initialCollegeId || ""}
            className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          >
            <option value="">Select your college</option>
            {colleges.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.city})
              </option>
            ))}
          </select>
        ) : (
          <div className="mt-1.5 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            No predefined colleges found yet. You can set your city above.
          </div>
        )}
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

      <div className="pt-2">
        <SaveButton />
      </div>
    </form>
  );
}
