"use client";

import { useState } from "react";
import { markListingStatus, deleteListing, toggleWishlist } from "@/app/listings/actions";

interface ListingActionsProps {
  listingId: string;
  isOwner: boolean;
  status: string;
  isSaved: boolean;
  sellerEmail?: string | null;
  sellerName: string;
}

export function ListingActions({
  listingId,
  isOwner,
  status,
  isSaved,
  sellerEmail,
  sellerName,
}: ListingActionsProps) {
  const [showContact, setShowContact] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: "active" | "sold") => {
    await markListingStatus(listingId, newStatus);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete this listing?")) {
      setIsDeleting(true);
      await deleteListing(listingId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Seller controls */}
      {isOwner ? (
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Seller Management Controls
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {status === "active" ? (
              <button
                onClick={() => handleStatusChange("sold")}
                className="rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-amber-600"
              >
                Mark as Sold
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange("active")}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Relist as Active
              </button>
            )}

            <button
              disabled={isDeleting}
              onClick={handleDelete}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
            >
              {isDeleting ? "Deleting…" : "Delete listing"}
            </button>
          </div>
        </div>
      ) : (
        /* Buyer controls */
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => setShowContact(true)}
            className="flex-1 rounded-2xl bg-blue-600 px-6 py-4 text-center text-sm font-bold text-white shadow-xl shadow-blue-500/25 transition hover:bg-blue-700"
          >
            💬 Contact Seller ({sellerName})
          </button>

          <button
            onClick={() => toggleWishlist(listingId)}
            className={`rounded-2xl border px-5 py-4 text-sm font-bold transition ${
              isSaved
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
            }`}
          >
            {isSaved ? "❤️ Saved" : "♡ Save"}
          </button>
        </div>
      )}

      {/* Contact modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Contact {sellerName}</h3>
            <p className="mt-1 text-xs text-slate-500">
              Message the student directly to negotiate or arrange a meetup on campus.
            </p>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Seller Email</p>
              <p className="mt-1 font-mono text-sm font-semibold text-blue-600">
                {sellerEmail || "Available via campus messaging"}
              </p>
            </div>

            <div className="mt-4 space-y-2">
              {sellerEmail && (
                <a
                  href={`mailto:${sellerEmail}?subject=Interested in your SORTED listing`}
                  className="block w-full rounded-xl bg-blue-600 py-3 text-center text-xs font-bold text-white hover:bg-blue-700"
                >
                  Open in Mail app ✉️
                </a>
              )}
              <button
                onClick={() => setShowContact(false)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
