import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ListingActions } from "./listing-actions";

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
    <main className="site-canvas min-h-screen pb-16">
      {/* Header */}
      <header className="px-4 pt-4 sm:px-8">
        <div className="glass mx-auto flex h-16 max-w-5xl items-center justify-between rounded-2xl px-5">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-extrabold tracking-[-.06em] text-slate-950">
            <span className="grid size-8 place-items-center rounded-xl bg-blue-600 text-sm text-white shadow-lg shadow-blue-500/25">
              S
            </span>
            SORTED
          </Link>

          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/browse" className="text-slate-600 hover:text-blue-600">
              ← Browse all
            </Link>
            <Link
              href="/sell"
              className="rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-blue-600"
            >
              Sell an item
            </Link>
          </div>
        </div>
      </header>

      {/* Main Details View */}
      <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column: Image & Badges (5 cols) */}
          <div className="space-y-4 lg:col-span-5">
            <div className="glass relative overflow-hidden rounded-3xl p-3">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={listing.title}
                  className="aspect-square w-full rounded-2xl object-cover shadow-sm"
                />
              ) : (
                <div className="grid aspect-square w-full place-items-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 text-7xl shadow-inner">
                  📦
                </div>
              )}

              {/* Status Ribbon */}
              {listing.status === "sold" && (
                <div className="absolute right-6 top-6 rounded-full bg-amber-500 px-3.5 py-1 text-xs font-bold text-white shadow-lg">
                  Sold Out
                </div>
              )}
            </div>

            {/* Quick Specs Pill Box */}
            <div className="glass rounded-2xl p-4">
              <div className="grid grid-cols-2 gap-3 text-center text-xs font-semibold">
                <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                  <p className="text-[10px] uppercase text-blue-500">Condition</p>
                  <p className="mt-0.5 font-bold">{conditionLabel}</p>
                </div>
                <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
                  <p className="text-[10px] uppercase text-slate-500">Category</p>
                  <p className="mt-0.5 font-bold">{categoryName || "General"}</p>
                </div>
              </div>
            </div>

            {/* Campus Safety Notice */}
            <div className="rounded-2xl border border-blue-200/60 bg-blue-50/50 p-4 text-xs text-slate-600">
              <p className="font-bold text-blue-900">🛡️ Campus Safety Tip</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-slate-600">
                <li>Meet in public campus areas (library, cafeteria).</li>
                <li>Inspect and verify item before making payment.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Title, Price, Description, Actions (7 cols) */}
          <div className="space-y-6 lg:col-span-7">
            <div className="glass rounded-3xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                  {categoryName || "Marketplace"}
                </span>
                {collegeName && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    🎓 {collegeName}
                  </span>
                )}
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  📍 {listing.city}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                {listing.title}
              </h1>

              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-blue-600 sm:text-4xl">
                  {listing.price_inr === 0 ? "FREE" : `₹${listing.price_inr.toLocaleString("en-IN")}`}
                </span>
                {listing.price_inr === 0 && (
                  <span className="text-xs font-bold uppercase text-emerald-600">Pass-forward Gift</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 border-t border-slate-200/60 pt-6">
                <ListingActions
                  listingId={listing.id}
                  isOwner={isOwner}
                  status={listing.status}
                  isSaved={isSaved}
                  sellerName={seller?.full_name || "Campus Seller"}
                />
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-slate-200/60 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  About this item
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                  {listing.description}
                </p>
              </div>

              {/* Seller details */}
              <div className="mt-8 border-t border-slate-200/60 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  Seller Information
                </h3>
                <div className="mt-3 flex items-center gap-3">
                  <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 font-bold text-white shadow-md">
                    {(seller?.full_name || "S")[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      {seller?.full_name || "Campus Student"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Student seller in {listing.city}
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
