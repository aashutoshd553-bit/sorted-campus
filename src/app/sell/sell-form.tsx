"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { createListing, type ListingActionState } from "@/app/listings/actions";

const initialState: ListingActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Publishing your listing…" : "🚀 Publish listing"}
    </button>
  );
}

interface SellFormProps {
  categories: { id: string; name: string; slug: string }[];
  colleges: { id: string; name: string; city: string }[];
  defaultCity: string;
  defaultCollegeId: string | null;
}

export function SellForm({
  categories,
  colleges,
  defaultCity,
  defaultCollegeId,
}: SellFormProps) {
  const [state, formAction] = useActionState(createListing, initialState);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          ⚠️ {state.error}
        </div>
      )}

      {/* Item Basic Details */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">1. Item Details</h2>
        <p className="mt-1 text-xs text-slate-500">
          Tell buyers what you are passing on.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Listing Title *
            </label>
            <input
              name="title"
              required
              minLength={3}
              maxLength={120}
              placeholder="e.g. Casio fx-991CW Calculator / HC Verma Physics Vol 1"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Category *
              </label>
              <select
                name="categoryId"
                required
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Condition *
              </label>
              <select
                name="condition"
                required
                defaultValue="good"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="like_new">Like New (Barely used, pristine)</option>
                <option value="good">Good (Normal wear, fully functional)</option>
                <option value="fair">Fair (Visible use/notes, works well)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              minLength={10}
              maxLength={5000}
              placeholder="Describe what condition it's in, accessories included, reason for selling, or meetup preferences on campus..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>
        </div>
      </div>

      {/* Pricing & Photo */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">2. Price & Photos</h2>
        <p className="mt-1 text-xs text-slate-500">Set a student-friendly price and add a photo.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Price (₹ INR) *
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-4 top-3.5 text-lg font-bold text-slate-500">₹</span>
              <input
                name="priceInr"
                required
                type="number"
                min={0}
                max={1000000}
                placeholder="450"
                className="w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-9 pr-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">Enter 0 if you are giving it away for free.</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Item Photo (Upload or Image URL)
            </label>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="flex cursor-pointer flex-1 items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                <input
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div>
                  <span className="text-3xl">📸</span>
                  <p className="mt-2 text-xs font-bold text-blue-700">Choose a photo from device</p>
                  <p className="mt-1 text-[11px] text-slate-500">JPG, PNG, WebP up to 5MB</p>
                </div>
              </label>

              {previewUrl && (
                <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Item Preview" className="size-full object-cover" />
                </div>
              )}
            </div>

            <div className="mt-3">
              <p className="text-xs text-slate-400">Or paste an image web link (optional):</p>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2 text-xs text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Campus Location */}
      <div className="glass rounded-3xl p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">3. Campus & Location</h2>
        <p className="mt-1 text-xs text-slate-500">Where can the buyer meet you?</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              City *
            </label>
            <input
              name="city"
              required
              defaultValue={defaultCity || "New Delhi"}
              placeholder="e.g. New Delhi, Bengaluru"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              College (Optional)
            </label>
            <select
              name="collegeId"
              defaultValue={defaultCollegeId || ""}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Open / Near Campus</option>
              {colleges.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name} ({col.city})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton />
      </div>

      <p className="text-center text-xs text-slate-500">
        By posting, you agree to SORTED safety guidelines. Always meet in open public spots on campus.
      </p>
    </form>
  );
}
