"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createListing, type ListingActionState } from "@/app/listings/actions";
import { CameraIcon } from "@/components/ui/icons";

const initialState: ListingActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      type="submit"
      className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Publishing listing..." : "Publish Listing"}
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
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          {state.error}
        </div>
      )}

      {/* Item Basic Details */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">1. Item Information</h2>
        <p className="mt-1 text-xs text-slate-500">
          Provide accurate details about the item and its current condition.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Listing Title *
            </label>
            <input
              name="title"
              required
              minLength={3}
              maxLength={120}
              placeholder="e.g. Casio fx-991CW Scientific Calculator or Physics Vol 1"
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Category *
              </label>
              <select
                name="categoryId"
                required
                className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Condition *
              </label>
              <select
                name="condition"
                required
                defaultValue="good"
                className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="like_new">Like New (Barely used, pristine)</option>
                <option value="good">Good (Normal wear, fully functional)</option>
                <option value="fair">Fair (Visible markings or wear, works well)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows={4}
              minLength={10}
              maxLength={5000}
              placeholder="Include details regarding edition, cosmetic condition, included cables or accessories, and campus handover preference..."
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* Pricing and Photos */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">2. Price and Image</h2>
        <p className="mt-1 text-xs text-slate-500">Set a price and provide an actual photo of the item.</p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Price (INR) *
            </label>
            <div className="relative mt-1.5">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-500">₹</span>
              <input
                name="priceInr"
                required
                type="number"
                min={0}
                max={1000000}
                placeholder="450"
                className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-8 pr-3.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Enter 0 if passing forward for free.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Item Photograph
            </label>

            <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center">
              <label className="flex cursor-pointer flex-1 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-slate-400 hover:bg-slate-100/50">
                <input
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center">
                  <CameraIcon className="size-6 text-slate-500" />
                  <p className="mt-2 text-xs font-semibold text-slate-700">Upload photo from device</p>
                  <p className="text-[11px] text-slate-500">JPEG, PNG, or WebP</p>
                </div>
              </label>

              {previewUrl && (
                <div className="size-24 shrink-0 overflow-hidden rounded-md border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Item Preview" className="size-full object-cover" />
                </div>
              )}
            </div>

            <div className="mt-3">
              <p className="text-xs text-slate-500">Or provide an image web link (optional):</p>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://..."
                className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">3. Campus Location</h2>
        <p className="mt-1 text-xs text-slate-500">Designate the college where handover can occur.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              City *
            </label>
            <input
              name="city"
              required
              defaultValue={defaultCity || "New Delhi"}
              placeholder="e.g. New Delhi"
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              College Campus (Optional)
            </label>
            <select
              name="collegeId"
              defaultValue={defaultCollegeId || ""}
              className="mt-1.5 w-full rounded-md border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="">Open / General Campus Area</option>
              {colleges.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name} ({col.city})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <SubmitButton />
      </div>

      <p className="text-center text-xs text-slate-500">
        All listings are reviewed. Sellers must follow campus safety standards and meet in open public spots.
      </p>
    </form>
  );
}
