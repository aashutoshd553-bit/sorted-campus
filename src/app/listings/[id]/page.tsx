import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ListingActions } from "./listing-actions";
import { ShieldCheckIcon, MapPinIcon, BoxIcon, ArrowRightIcon } from "@/components/ui/icons";

export const instant = false;

interface ListingPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingPage({ params }: ListingPageProps) {
  await connection();
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch listing details
  const { data: listing } = await supabase
    .from("listings")
    .select(
      `
      *,
      categories(name, slug),
      colleges(name, city),
      profiles:seller_id(id, full_name, is_student_verified, created_at, city),
      listing_images(storage_path, alt_text)
    `
    )
    .eq("id", id)
    .single();

  if (!listing) {
    notFound();
  }

  // Check wishlist status
  let isSaved = false;
  if (user) {
    const { data: saved } = await supabase
      .from("wishlists")
      .select("listing_id")
      .eq("user_id", user.id)
      .eq("listing_id", id)
      .maybeSingle();
    isSaved = !!saved;
  }

  const isOwner = !!(user && user.id === listing.seller_id);
  const seller = Array.isArray(listing.profiles) ? listing.profiles[0] : (listing.profiles as { full_name?: string; city?: string } | null);
  const categoryName = Array.isArray(listing.categories) ? listing.categories[0]?.name : (listing.categories as { name?: string } | null)?.name;
  const collegeName = Array.isArray(listing.colleges) ? listing.colleges[0]?.name : (listing.colleges as { name?: string } | null)?.name;

  const conditionLabel =
    listing.condition === "like_new"
      ? "Like New"
      : listing.condition === "good"
      ? "Good Condition"
      : "Fair Condition";

  // Compute image URL
  const firstImage = listing.listing_images?.[0]?.storage_path;
  let imageUrl: string | null = null;
  if (firstImage) {
    if (firstImage.startsWith("http")) {
      imageUrl = firstImage;
    } else {
      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing-images/${firstImage}`;
    }
  }

  return (
    <main className="site-canvas min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-950">
            <span className="flex size-7 items-center justify-center rounded bg-slate-950 text-xs font-bold text-white">
              S
            </span>
            SORTED
          </Link>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/browse" className="text-slate-600 hover:text-slate-950">
              Browse Catalog
            </Link>
            <Link
              href="/sell"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Post Listing
            </Link>
          </div>
        </div>
      </header>

      {/* Main Details View */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Image (5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={listing.title}
                  className="aspect-square w-full rounded object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center rounded bg-slate-100 text-slate-300">
                  <BoxIcon className="size-16" />
                </div>
              )}

              {/* Status Ribbon */}
              {listing.status === "sold" && (
                <div className="absolute right-4 top-4 rounded bg-amber-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Sold Out
                </div>
              )}
            </div>

            {/* Quick Specs Box */}
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="rounded border border-slate-200 bg-slate-50 p-2.5">
                  <p className="text-[10px] font-semibold uppercase text-slate-500">Condition</p>
                  <p className="mt-0.5 font-bold text-slate-900">{conditionLabel}</p>
                </div>
                <div className="rounded border border-slate-200 bg-slate-50 p-2.5">
                  <p className="text-[10px] font-semibold uppercase text-slate-500">Category</p>
                  <p className="mt-0.5 font-bold text-slate-900">{categoryName || "General"}</p>
                </div>
              </div>
            </div>

            {/* Campus Safety Notice */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                <ShieldCheckIcon className="size-4 text-slate-700" />
                Campus Handover Protocol
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
                <li>Meet in public campus areas during daylight hours.</li>
                <li>Verify item functionality before making payment.</li>
                <li>Never transfer advance deposits or holding fees.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Title, Price, Description, Actions (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {categoryName || "Marketplace"}
                </span>
                {collegeName && (
                  <span className="flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                    <MapPinIcon className="size-3" /> {collegeName}
                  </span>
                )}
                <span className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
                  {listing.city}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                {listing.title}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-950">
                  {listing.price_inr === 0 ? "FREE" : `₹${listing.price_inr.toLocaleString("en-IN")}`}
                </span>
                {listing.price_inr === 0 && (
                  <span className="text-xs font-semibold text-emerald-700">No cost item</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 border-t border-slate-100 pt-6">
                <ListingActions
                  listingId={listing.id}
                  isOwner={isOwner}
                  status={listing.status}
                  isSaved={isSaved}
                  sellerName={seller?.full_name || "Campus Seller"}
                />
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Item Details
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {listing.description}
                </p>
              </div>

              {/* Seller details */}
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Listed By
                </h3>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded bg-slate-950 text-sm font-bold text-white">
                    {(seller?.full_name || "S")[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {seller?.full_name || "Student Seller"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Campus student in {listing.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
