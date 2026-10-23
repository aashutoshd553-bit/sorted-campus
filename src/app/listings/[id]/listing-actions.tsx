"use client";

import { useState } from "react";
import { markListingStatus, deleteListing, toggleWishlist } from "@/app/listings/actions";
import { MailIcon } from "@/components/ui/icons";

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
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
            Seller Management Controls
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {status === "active" ? (
              <button
                onClick={() => handleStatusChange("sold")}
                className="rounded-md bg-amber-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-amber-700"
              >
                Mark as Sold
              </button>
            ) : (
              <button
                onClick={() => handleStatusChange("active")}
                className="rounded-md bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Relist as Active
              </button>
            )}

            <button
              disabled={isDeleting}
              onClick={handleDelete}
              className="rounded-md border border-red-300 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete Listing"}
            </button>
          </div>
        </div>
      ) : (
        /* Buyer controls */
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => setShowContact(true)}
            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <MailIcon className="size-4" /> Contact Seller ({sellerName})
          </button>

          <button
            onClick={() => toggleWishlist(listingId)}
            className={`rounded-md border px-4 py-3 text-sm font-semibold transition ${
              isSaved
                ? "border-red-300 bg-red-50 text-red-700"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {isSaved ? "Saved" : "Save Item"}
          </button>
        </div>
      )}

      {/* Contact modal */}
      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Contact {sellerName}</h3>
            <p className="mt-1 text-xs text-slate-500">
              Arrange an in-person campus handover in a public area.
            </p>

            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium uppercase text-slate-500">Verified Email</p>
              <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                {sellerEmail || "Available on request via campus directory"}
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {sellerEmail && (
                <a
                  href={`mailto:${sellerEmail}?subject=Regarding your listing on SORTED`}
                  className="block w-full rounded-md bg-blue-600 py-2.5 text-center text-xs font-semibold text-white hover:bg-blue-700"
                >
                  Send Email
                </a>
              )}
              <button
                onClick={() => setShowContact(false)}
                className="w-full rounded-md border border-slate-300 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
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
